import express from 'express';
import {
  getProductsByCategory,
  getFilters,
  getProducts,
  getFeaturedProducts,
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/filters', getFilters);
router.get('/featured', getFeaturedProducts);
router.get('/:category', getProductsByCategory);
router.post('', getProducts);

export default router;
