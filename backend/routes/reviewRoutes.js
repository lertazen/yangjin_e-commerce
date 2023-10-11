import express from 'express';
import {
  getReviewStatus,
  getTestimonials,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authUserMiddleware.js';

const router = express.Router();

router.get('', getTestimonials);
router.post('', protect, getReviewStatus);

export default router;
