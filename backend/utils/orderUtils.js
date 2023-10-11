import mongoose from 'mongoose';
import Product from '../models/ProductModel.js';
import Order from '../models/OrderModel.js';
import User from '../models/UserModel.js';

/**
 * Calculate the total price of items in a cart
 *
 * @params {Object[]} cart - An array of cart items
 * @params {ObjectId} cart[].productId - product _id
 * @params {number} cart[].quantity - The quantity of the items in the cart
 * @returns {number} The total price of all items in the cart
 */
const createNewOrder = async ({
  paymentIntentId,
  userId,
  products,
  totalAmount,
  shippingDetails,
  shippingPrice,
}) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('The customer is not valid');
  }

  // validate order data
  if (!validateOrder(products)) {
    throw new Error('Invalid order data');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.create(
      [
        {
          paymentIntentId,
          userId,
          products,
          totalAmount,
          shippingDetails,
          shippingPrice,
        },
      ],
      { session: session }
    );
    // Update stock quantity for each product
    for (let product of products) {
      const fetchedProduct = await Product.findById(product.productId).session(
        session
      );
      if (fetchedProduct.stockQuantity >= product.quantity) {
        fetchedProduct.stockQuantity -= product.quantity;
        await fetchedProduct.save({ session: session });
      } else {
        throw new Error(
          `Not enough stock for product: ${fetchedProduct.productName}`
        );
      }
    }

    // Update user's past orders
    await User.findByIdAndUpdate(
      userId,
      { $push: { pastOrders: order[0]._id } },
      { session: session }
    );

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// return false if the order data is invalid
const validateOrder = async (products) => {
  if (!products || !Array.isArray(products)) return false;

  for (let i in products) {
    if (
      !products[i].productId ||
      !products[i].quantity ||
      !products[i].priceAtPurchase
    )
      return false;
    try {
      const productData = await Product.findById(products[i].productId);
      if (!productData) return false;
      if (productData.stockQuantity < products[i].quantity) return false;
    } catch (err) {
      throw new Error(`${products[i].productId} not exists`);
    }
  }

  return true;
};

// calculate total amount and return the result
const calculateSubTotal = async (products) => {
  let total = 0;
  const productIds = products.map((p) => p.productId);
  try {
    const fetchedProducts = await Product.find(
      { _id: { $in: productIds } },
      'price'
    );
    for (let fetchedProduct of fetchedProducts) {
      const product = products.find((p) => p.productId == fetchedProduct._id);
      total += fetchedProduct.price * product.quantity;
    }
  } catch (err) {
    throw new Error('Error finding products');
  }
  return Math.round(total * 100) / 100;
};

// calculate tax based on the total amount calculated
const calculateTax = (subtotal, shippingPrice) => {
  const tax = (subtotal + shippingPrice) * 0.13;

  return Math.round(tax * 100) / 100;
};

export { validateOrder, calculateSubTotal, calculateTax, createNewOrder };
