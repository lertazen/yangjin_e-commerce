import asyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';
import Review from '../models/ReviewModel.js';
import User from '../models/UserModel.js';

// @desc        Get the product by product name
// route        /api/product/:productname
// @access      public
const getProductByName = asyncHandler(async (req, res) => {
  const productName = decodeURIComponent(req.params.productname);

  const product = await Product.findOne({
    productName: new RegExp(`^${productName}$`, 'i'),
  });

  if (!product) {
    res.status(404);
    throw new Error(`Product ${productName} not found`);
  }

  res.status(200).json(product);
});

// @desc        Create product review by user
// route        POST /api/product/review/:productId
// @access      user private
const createReview = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { title, content, rating } = req.body;
  const user = await User.findById(req.userId, 'username');
  const username = user ? user.username : null;

  if (productId && username) {
    const product = await Product.findById(productId);
    if (product) {
      const review = await Review.create({
        username: username,
        userId: req.userId,
        product: productId,
        rating: rating,
        title: title,
        content: content,
      });
      if (review) {
        res.status(201).json(review);
      } else {
        res.status(400);
        throw new Error(
          `Failed creating Product ${product.productName} review`
        );
      }
    } else {
      res.status(404);
      throw new Error(`${product.productName} not found for review`);
    }
  } else {
    res.status(400);
    throw new Error('Product ID or username not found');
  }
});

// @desc        Get product reviews
// route        GET /api/product/review/:productId
// @access      public
const getProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  if (productId) {
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({
        product: productId,
      });
      if (reviews.length > 0) {
        res.status(200).json(reviews);
      } else {
        res.status(200).json({ message: 'Product does not have any reviews.' });
      }
    } else {
      res.status(404);
      throw new Error(`${product.productName} not found for review`);
    }
  } else {
    res.status(400);
    throw new Error('Product ID not received');
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId, 'productName images');
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error(`Product ${productId} not found`);
  }
});

export { getProductByName, createReview, getProductReviews, getProductById };
