import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Product from '../models/ProductModel.js';
import {
  calculateSubTotal,
  createNewOrder,
  calculateTax,
} from '../utils/orderUtils.js';
import Cart from '../models/CartModel.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Calculate the total price of items in a cart
 *
 * @params {Object[]} cart - An array of cart items
 * @params {ObjectId} cart[].productId - product _id
 * @params {number} cart[].quantity - The quantity of the items in the cart
 * @returns {number} The total price of all items in the cart
 */
const calculateOrderAmount = async (cart) => {
  try {
    const subtotal = await calculateSubTotal(cart);
    // free shipping for testing
    const tax = calculateTax(subtotal, 0);

    return Math.round((subtotal + tax) * 100);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to calculate order amount');
  }
};

//@desc           create check out intent
//route           POST /api/checkout/create-payment-intent
//@access         public
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { cart, shippingInfo } = req.body;

  const amount = await calculateOrderAmount(cart);

  const orderItemsPromises = cart.map(async (item) => {
    const fetchedProduct = await Product.findById(
      item.productId,
      'productName price'
    );
    return {
      productId: item.productId,
      productName: fetchedProduct.productName,
      quantity: item.quantity,
      priceAtPurchase: fetchedProduct.price,
    };
  });

  const orderItems = await Promise.all(orderItemsPromises);

  const shipping = {
    name: shippingInfo.fname + ' ' + shippingInfo.lname,
    address: {
      line1: shippingInfo.address,
      line2: shippingInfo.apartment,
      city: shippingInfo.city,
      state: shippingInfo.province,
      postal_code: shippingInfo.postalCode,
      country: shippingInfo.country,
    },
    phone: shippingInfo.phone,
  };

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.userId,
      orderItems: JSON.stringify(orderItems),
    },
    shipping: shipping,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    amount: amount,
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  if (paymentIntent) {
    // console.log(paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } else {
    throw new Error('Payment intent failed to be created');
  }
});

//@desc           Handle events from webhook
//route           POST /api/checkout/webhook
//@access         public
const webhookHandler = async (req, res) => {
  let event = req.body;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      try {
        const paymentIntent = event.data.object;

        const customer = await stripe.customers.retrieve(
          paymentIntent.customer
        );

        const orderData = {
          paymentIntentId: paymentIntent.id,
          userId: customer.metadata.userId,
          customerId: customer.id,
          products: JSON.parse(customer.metadata.orderItems),
          totalAmount: paymentIntent.amount,
          shippingDetails: customer.shipping,
          shippingPrice: 0,
        };

        const newOrder = await createNewOrder(orderData);
        if (newOrder) {
          try {
            const newCart = await Cart.findOneAndUpdate(
              { userId: customer.metadata.userId },
              { $set: { products: [] } },
              { new: true }
            );
          } catch (err) {
            console.log('something went wrong when updating the data', err);
          }
        } else {
          throw new Error(
            `Error creating new order for customer ${customer.metadata.userId}`
          );
        }
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
      } catch (err) {
        console.log(err);
      }

      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
};

export { createPaymentIntent, webhookHandler };
