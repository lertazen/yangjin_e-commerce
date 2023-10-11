import asyncHandler from 'express-async-handler';
import Order from '../models/OrderModel.js';
import User from '../models/UserModel.js';
import {
  validateOrder,
  calculateSubTotal,
  calculateTax,
  createNewOrder,
} from '../utils/orderUtils.js';
import mongoose from 'mongoose';
import Product from '../models/ProductModel.js';

// @desc        Create a new order
// route        POST /api/orders
// @access      public
const createOrder = asyncHandler(async (req, res) => {
  try {
    const newOrder = await createNewOrder(req.body);
    res.status(201).json({
      _id: newOrder._id,
      userId: newOrder.userId,
    });
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error processing order');
  }
});

export { createOrder };
