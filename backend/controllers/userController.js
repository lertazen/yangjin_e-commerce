import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import generateToken from '../utils/generateToken.js';
import Order from '../models/OrderModel.js';

// @desc      Register user
// route      POST /api/user/
// @access    public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  const userExists = await User.findOne({ email: userEmail });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username: userName,
    email: userEmail,
    password: userPassword,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@desc       Login user
//route       /api/user/login
//@access     public
const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, userPassword } = req.body;
  const user = await User.findOne({
    email: userEmail,
  });
  if (user && (await user.matchPassword(userPassword))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//@desc       Logout user
//route       POST /api/user/logout
//@access     public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: 'User logged out',
  });
});

//@desc       Check user log in status from status sent by auth middleware
//route       GET /api/user
//@access     user private
const checkTokenStatus = asyncHandler(async (req, res) => {
  if (req.tokenValid) {
    res.json({ tokenStatus: true });
  } else {
    res.json({ tokenStatus: false });
  }
});

//@desc       Toggle product in wishlist
//route       POST /api/user/wishlist
//@access     user private
const toggleProductInWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const productInWishlist = await User.findOne({
    _id: req.userId,
    wishList: productId,
  });

  if (productInWishlist) {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { wishList: productId },
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({ status: 'removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: { wishList: productId },
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({ status: 'added' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  }
});

//@desc       Get products in wishlist
//route       GET /api/user/wishlist
//@access     user private
const getWishlist = asyncHandler(async (req, res) => {
  const userWishlist = await User.findById(req.userId, 'wishList');
  if (userWishlist) {
    res.status(200).json(userWishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc       Get user profile
//route       GET /api/user/profile
//@access     user private
const getProfile = asyncHandler(async (req, res) => {
  const userProfile = await User.findById(req.userId).select('-password');
  if (userProfile) {
    res.status(200).json(userProfile);
  } else {
    res.status(404);
    throw new Error('User profile not found');
  }
});

//@desc       Update user profile
//route       PUT /api/user/profile
//@access     user private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc       Get user order previously paid
//route       GET /api/user/order
//@access     user private
const getOrder = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.query;
  console.log('paymentIntentId: ', paymentIntentId);
  console.log('userId: ', req.userId);
  const fetchedOrder = await Order.findOne({
    paymentIntentId: paymentIntentId,
    userId: req.userId,
  });
  if (fetchedOrder) {
    res.status(200).json(fetchedOrder);
  } else {
    res.status(404);
    throw new Error('Order detail not found');
  }
});

//@desc       Get user orders
//route       GET /api/user/orders
//@access     user private
const getOrders = asyncHandler(async (req, res) => {
  const fetchedOrders = await Order.find({
    userId: req.userId,
  }).select('-paymentIntentId');
  if (fetchedOrders) {
    res.status(200).json(fetchedOrders);
  } else {
    res.status(404);
    throw new Error('Order detail not found');
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  checkTokenStatus,
  toggleProductInWishlist,
  getWishlist,
  getProfile,
  updateProfile,
  getOrder,
  getOrders,
};
