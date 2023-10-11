import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { protect, checkCustomer } from '../middleware/authUserMiddleware.js';

const router = express.Router();
router.post('/', protect, checkCustomer, createOrder);

export default router;
