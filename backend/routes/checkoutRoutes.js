import express from 'express';
import { createPaymentIntent } from '../controllers/checkoutController.js';
import { checkCustomer, protect } from '../middleware/authUserMiddleware.js';

const router = express.Router();

router.post(
  '/create-payment-intent',
  protect,
  checkCustomer,
  createPaymentIntent
);

export default router;
