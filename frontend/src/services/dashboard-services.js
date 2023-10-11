// @desc        Get the products from the back end
// route        GET /api/dashboard/products
// @access      admin private
export const fetchProducts = async (currentPage, itemsPerPage) => {
  try {
    const response = await fetch(
      `/api/dashboard/products?page=${currentPage}&limit=${itemsPerPage}`
    );

    if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error fetching products in dashboard: ', err);
    throw err;
  }
};

// @desc        Create a new product
// route        POST /api/dashboard/products
// @access      admin private
export const createProduct = async (formData) => {
  try {
    const response = await fetch('/api/dashboard/products', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error creating new product in dashboard: ', err);
    throw err;
  }
};

// @desc        Delete a  product
// route        DELETE /api/dashboard/products/:productId
// @access      admin private
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`/api/dashboard/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('HTTP error: ', response.status);
    }
    return await response.json();
  } catch (err) {
    console.log('Error deleting product in dashboard: ', err);
    throw err;
  }
};

// @desc        Fetch a product by id
// route        GET /api/dashboard/products/:productId
// @access      admin private
export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`/api/dashboard/products/${productId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('HTTP error: ', response.status);
    }
    return await response.json();
  } catch (err) {
    console.log('Error fetching product in dashboard: ', err);
    throw err;
  }
};

// @desc        Update a product by id
// route        PUT /api/dashboard/products/:productId
// @access      admin private
export const updateProductById = async (productId, formData) => {
  try {
    const response = await fetch(`/api/dashboard/products/${productId}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('HTTP error: ', response.status);
    }
    return await response.json();
  } catch (err) {
    console.log('Error fetching product in dashboard: ', err);
    throw err;
  }
};
