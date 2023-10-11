import asyncHandler from 'express-async-handler';
import Review from '../models/ReviewModel.js';

//@desc         Get reviews with good ratings
//route         GET /api/reviews
//@access       public
const getTestimonials = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ rating: { $gte: 4 } });
  if (reviews) {
    res.status(200).json(reviews);
  } else {
    res.status(400);
    throw new Error('Something went wrong when fetching testimonials');
  }
});

// @desc        Check if review has been successfully created by the user requesting
// route        POST /api/product/reviews
// @access      user private
const getReviewStatus = asyncHandler(async (req, res) => {
  const { reviewId } = req.body;

  const review = await Review.find({ userId: req.userId, _id: reviewId });
  if (review) {
    res.status(200).json({ reviewStatus: true });
  } else {
    res.status(200).json({ reviewStatus: false });
  }
});

export { getTestimonials, getReviewStatus };
