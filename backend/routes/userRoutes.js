import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  toggleProductInWishlist,
  getWishlist,
  getProfile,
  updateProfile,
  getOrder,
  getOrders,
  checkTokenStatus,
} from '../controllers/userController.js';
import { checkCustomer, protect } from '../middleware/authUserMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('', protect, checkTokenStatus);
router
  .route('/profile')
  .get(protect, checkCustomer, getProfile)
  .put(protect, checkCustomer, updateProfile);
router.get('/order', protect, getOrder);
router.get('/orders', protect, getOrders);

router.post('/wishlist', protect, checkCustomer, toggleProductInWishlist);
router.get('/wishlist', protect, checkCustomer, getWishlist);

export default router;
