import express from 'express';
import {
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProductById,
} from '../controllers/dashboardController.js';
import { protect, checkAdmin } from '../middleware/authUserMiddleware.js';
import { upload } from '../config/multerConfig.js';

const router = express.Router();

router
  .route('/products')
  .get(protect, checkAdmin, getProducts)
  .post(protect, checkAdmin, upload.array('images'), createProduct);
router
  .route('/products/:productId')
  .get(protect, checkAdmin, getProductById)
  .put(protect, checkAdmin, upload.array('newImages'), updateProductById)
  .delete(protect, checkAdmin, deleteProduct);

export default router;
