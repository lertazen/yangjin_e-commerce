// @desc        Get the filter options from the back end
// route        GET /api/products/filters
// @access      public
const fetchFilters = async () => {
  try {
    const response = await fetch('/api/products/filters');

    if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error fetching filters in dashboard: ', err);
    throw err;
  }
};

// @desc        Get the products based on filters from the back end
// route        GET /api/products/:category?page=&limit=&materials=&colors=&rating=&price=
// @access      public
const fetchProductsByFilters = async (
  category,
  currentPage,
  itemsPerPage,
  materialChecked,
  colorChecked,
  ratingValue,
  priceValue,
  sort
) => {
  try {
    const materialFilter = serializeFilters(materialChecked);
    const colorFilter = serializeFilters(colorChecked);
    const response = await fetch(
      `/api/products/${category}?page=${currentPage}&limit=${itemsPerPage}
      &materials=${materialFilter}&colors=${colorFilter}&rating=${ratingValue}
      &price=${priceValue.toString()}&sort=${sort}`
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err?.data?.message || err.error);
    throw err;
  }
};

const serializeFilters = (filterState) => {
  return Object.keys(filterState)
    .filter((key) => filterState[key])
    .join(',');
};

// Fetch product by name
const fetchProductByName = async (productname) => {
  try {
    const response = await fetch(`/api/product/${productname}`);
    if (!response.ok) {
      console.log(response.status);
      throw new Error('Error fetching product by name');
    }
    const product = await response.json();
    return product;
  } catch (err) {
    throw new Error('Error fetching product by name');
  }
};

// Fetch featured products
const fetchFeaturedProducts = async () => {
  try {
    const response = await fetch('/api/products/featured', {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(response.status);
      throw new Error('Response is not ok');
    }
    const featuredProducts = await response.json();
    return featuredProducts;
  } catch (err) {
    throw new Error('Error fetching product by name');
  }
};

const fetchProductById = async (productId) => {
  try {
    const response = await fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return null;
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    throw err;
  }
};

export {
  fetchFilters,
  fetchProductsByFilters,
  fetchProductByName,
  fetchFeaturedProducts,
  fetchProductById,
};
