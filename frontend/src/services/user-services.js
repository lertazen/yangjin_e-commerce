//@desc       Get user's wishlist
//route       GET /api/user/wishlist
//body        none
//return      wishlist array [productId,...]
//@access     user private
const fetchWishlistData = async () => {
  try {
    const response = await fetch('/api/user/wishlist', {
      method: 'GET',
    });
    if (!response.ok) {
      const message = await response.json();
      return null;
    }
    const data = await response.json();
    return data.wishList;
  } catch (err) {
    console.log(err);
  }
};

//@desc       Toggle product in the user's wishlist
//route       POST /api/user/wishlist
//body        {productId: _id}
//return      status string: either 'removed' or 'added'
//@access     user private
const addOrRemoveProductInWishlist = async (productId) => {
  try {
    const response = await fetch('/api/user/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      console.log(response.status);
      throw new Error('Error toggle product in wishlist');
    }
    const data = await response.json();
    return data.status;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

//@desc       Update user profile
//route       PUT /api/user/profile
//@access     user private
const updateUserProfile = async (userProfile) => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userProfile),
    });
    if (!response.ok) {
      const errMessage = await response.text();
      throw new Error(errMessage);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    throw err;
  }
};

//@desc       Fetch user previously paid order after successful payment
//route       GET /api/user/order?paymentIntent=
//@access     user private
const fetchOrder = async (paymentIntentId) => {
  try {
    const response = await fetch(
      `/api/user/order?paymentIntentId=${paymentIntentId}`
    );
    if (!response.ok) {
      return await response.text();
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

//@desc       Fetch user orders
//route       GET /api/user/orders
//@access     user private
const fetchOrders = async () => {
  try {
    const response = await fetch('/api/user/orders', {
      method: 'GET',
    });
    if (!response.ok) {
      return await response.text();
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

//@desc       Check if the user is logged in
//route       GET /api/user
//@access     user private
const checkAuthStatus = async () => {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.tokenStatus;
  } catch (err) {
    return false;
  }
};

//@desc       Log in user
//route       POST /api/user/login
//@access     public
const singInUser = async (user) => {
  try {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      return null;
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export {
  fetchWishlistData,
  addOrRemoveProductInWishlist,
  updateUserProfile,
  fetchOrder,
  fetchOrders,
  checkAuthStatus,
  singInUser,
};
