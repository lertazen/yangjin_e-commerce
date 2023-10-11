import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.userId;
      req.tokenValid = true;
      next();
    } catch (err) {
      req.tokenValid = false;
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    req.tokenValid = false;
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

const checkCustomer = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).select('-password');
  if (user && user.role === 'customer') {
    next();
  } else {
    res.status(403).json({ message: 'Not an existing customer' });
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).select('-password');

  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
});

export { protect, checkAdmin, checkCustomer };
