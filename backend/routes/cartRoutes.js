import express from 'express';
import {
  getCart,
  addItem,
  removeItem,
  updateQuantity,
} from '../controllers/cartController.js';
import { checkCustomer, protect } from '../middleware/authUserMiddleware.js';

const router = express.Router();

router.get('/', protect, checkCustomer, getCart);

router.post('/items', protect, checkCustomer, addItem);
router.delete('/items', protect, checkCustomer, removeItem);
router.put('/items', protect, checkCustomer, updateQuantity);

export default router;
