import asyncHandler from 'express-async-handler';
import Cart from '../models/CartModel.js';

//@desc       Get user cart
//route       GET /api/cart/
//@access     user private
const getCart = asyncHandler(async (req, res) => {
  const userId = req.userId;
  try {
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(200).json({
        cartExists: false,
        message: `Cart not found for user ${userId}`,
      });
    }
    return res.status(200).json({ cartExists: true, cart: cart });
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error(`Error retrieving cart for user ${userId}`);
  }
});

//@desc       Add item/items to the cart
//route       POST /api/cart/items
//return      updated cart
//@access     user private
const addItem = asyncHandler(async (req, res) => {
  const items = req.body; // [{productId, quantity}, ...]
  const userId = req.userId;

  const cart = await Cart.findOne({ userId: req.userId });
  if (cart) {
    items.forEach((item) => {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === item.productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += item.quantity;
      } else {
        cart.products.push(item);
      }
    });
    const newCart = await cart.save();
    res.status(201).json(newCart);
  } else {
    const newCart = await Cart.create({
      userId,
      products: items,
    });
    if (newCart) {
      res.status(201).json(newCart);
    } else {
      res.status(400);
      throw new Error('Item cannot be added');
    }
  }
});

//@desc       Delete item/items in the cart
//route       DELTE /api/cart/items
//@access     user private
const removeItem = asyncHandler(async (req, res) => {
  const items = req.body; // [{productId}, ...]

  const cart = await Cart.findOne({ userId: req.userId });
  if (cart) {
    items.forEach((item) => {
      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== item.productId
      );
    });
    const newCart = await cart.save();
    res.status(200).json(newCart);
  } else {
    res.status(404);
    throw new Error('Cart is not found');
  }
});

//@desc       Update item/items in the cart
//route       PUT /api/cart/items
//@access     user private
const updateQuantity = asyncHandler(async (req, res) => {
  const items = req.body; // [{productId, quantity}...]
  const cart = await Cart.findOne({ userId: req.userId });
  if (cart) {
    items.forEach((item) => {
      const product = cart.products.find(
        (p) => p.productId.toString() === item.productId
      );
      if (product) {
        product.quantity = item.quantity;
      } else {
        console.log(`item: ${item.productId} in update list not found`);
      }
    });
    const newCart = await cart.save();
    res.status(200).json(newCart);
  } else {
    res.status(404);
    throw new Error('Cart is not found');
  }
});

export { getCart, addItem, removeItem, updateQuantity };
