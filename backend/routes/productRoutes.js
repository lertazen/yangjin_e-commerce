import express from 'express';
import {
  getProductByName,
  createReview,
  getProductReviews,
  getProductById,
} from '../controllers/productController.js';
import { protect, checkCustomer } from '../middleware/authUserMiddleware.js';

const router = express.Router();

router.post('', getProductById);
router
  .route('/review/:productId')
  .post(protect, checkCustomer, createReview)
  .get(getProductReviews);
router.get('/:productname', getProductByName);

export default router;
