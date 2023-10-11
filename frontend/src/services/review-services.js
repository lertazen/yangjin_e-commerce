//@desc         Get reviews with good ratings
//route         GET /api/reviews
//@access       public
const fetchTestimonials = async () => {
  const response = await fetch('/api/reviews');
  if (!response.ok) {
    return null;
  } else {
    const data = await response.json();
    return data;
  }
};

//@desc         Create a new review for product
// route        POST /api/product/review/:productId
// @access      user private
const submitNewReview = async (review, productId) => {
  try {
    const response = await fetch(`/api/product/review/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc        Check if review has been successfully created by the user requesting
// route        POST /api/product/review
// @access      user private
const fetchReviewStatus = async (reviewId) => {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewId }),
    });
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return false;
    } else {
      const data = await response.json();
      return data.reviewStatus;
    }
  } catch (err) {
    throw err;
  }
};

// @desc        Get product reviews
// route        GET /api/product/review/:productId
// @access      public
const fetchProductReviews = async (productId) => {
  try {
    const response = await fetch(`/api/product/review/${productId}`);
    if (!response.ok) {
      return { message: 'This product does not have any reviews.' };
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    throw err;
  }
};

export {
  fetchTestimonials,
  submitNewReview,
  fetchReviewStatus,
  fetchProductReviews,
};
