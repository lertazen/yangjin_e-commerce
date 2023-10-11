// @desc        Get the products data in the cart
// route        GET /api/products
// @access      public
const fetchCartProducts = async (productsInfo) => {
  const productIds = productsInfo.map((p) => p.productId);
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productIds),
    });

    if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error fetching products in the cart');
    throw err;
  }
};

// @desc        Get the cart according to the local user
// route        GET /api/cart
// @access      user private
const fetchUserCart = async () => {
  try {
    const response = await fetch(`/api/cart/`);
    if (!response.ok) {
      const message = await response.json();
      return null;
    }
    const data = await response.json();
    if (data.cartExists) {
      const cart = data.cart;
      return cart;
    } else {
      console.log('user does not have a cart');
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//@desc       Add item/items to the cart
//route       POST /api/cart/items
//body        [{productId, quantity}, ...]
//@access     user private
const addItemToCart = async (item) => {
  try {
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      console.log(response.status);
      throw new Error('Error adding item to cart');
    }
    const data = await response.json();
    return data.products;
  } catch (err) {
    throw new Error(err);
  }
};

//@desc       Update item/items in the cart
//route       PUT /api/cart/items
//body        [{productId, quantity}, ...]
//@access     user private
const updateItemQuantityInCart = async (item) => {
  try {
    const response = await fetch('/api/cart/items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      console.log(response.status);
      throw new Error('Error updating quantity');
    }
    const data = await response.json();
    return data.products;
  } catch (err) {
    throw new Error(err);
  }
};

//@desc       Delete item/items in the cart
//route       DELTE /api/cart/items
//body        [{productId},...]
//@access     user private
const deleteItemInCart = async (item) => {
  try {
    const response = await fetch('/api/cart/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      console.log(response.status);
      throw new Error('Error updating quantity');
    }
    const data = await response.json();
    return data.products;
  } catch (err) {
    throw new Error(err);
  }
};

export {
  fetchUserCart,
  addItemToCart,
  updateItemQuantityInCart,
  deleteItemInCart,
  fetchCartProducts,
};
