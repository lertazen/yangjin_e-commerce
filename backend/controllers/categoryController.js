import asyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';

// @desc        Get the products according to category
// route        /api/products/:category
// @access      public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 9,
    materials,
    colors,
    rating,
    price,
    sort,
  } = req.query;
  const skip = (page - 1) * limit;
  const categoryName = req.params.category.toLowerCase();

  let filterCriteria = categoryName === 'all' ? {} : { category: categoryName };
  if (materials) {
    filterCriteria.material = {
      $in: materials
        .split(',')
        .map((material) => new RegExp(`^${material}$`, 'i')),
    };
  }

  if (colors) {
    filterCriteria.color = {
      $in: colors.split(',').map((color) => new RegExp(`^${color}$`, 'i')),
    };
  }

  if (rating) {
    filterCriteria.averageRating = { $gte: rating };
  }

  if (price) {
    const priceRange = price.split(',');
    if (!priceRange[0] && !priceRange[1]) {
      filterCriteria.price = { $gte: 0 };
    } else if (!priceRange[0] && priceRange[1]) {
      filterCriteria.price = { $lte: priceRange[1] };
    } else if (priceRange[0] && !priceRange[1]) {
      filterCriteria.price = { $gte: priceRange[0] };
    } else if (priceRange[0] && priceRange[1]) {
      filterCriteria.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }
  }

  let sortCriteria = {};
  switch (sort) {
    case 'featured':
      sortCriteria = { featured: -1 };
      break;
    case 'priceHighToLow':
      sortCriteria = { price: -1 };
      break;
    case 'priceLowToHigh':
      sortCriteria = { price: 1 };
      break;
    case 'averageRating':
      sortCriteria = { averageRating: -1 };
      break;
    case 'newestArrival':
      sortCriteria = { createdAt: -1 };
      break;
    default:
      break;
  }
  try {
    const products = await Product.find(
      filterCriteria,
      'productName price images'
    )
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const totalAmount = await Product.countDocuments(filterCriteria);

    res.status(200).json({ products, totalAmount });
  } catch (err) {
    console.log(err);
    res.status(404);
    throw new Error('Products not found in category');
  }
});

// @desc        Get the filters
// route        /api/products/filters
// @access      public
const getFilters = asyncHandler(async (req, res) => {
  try {
    const materials = await Product.aggregate([
      {
        $group: {
          _id: { $toLower: '$material' },
        },
      },
    ]);
    const distinctMaterials = materials.map((mat) => mat._id);
    const colors = await Product.aggregate([
      {
        $group: {
          _id: { $toLower: '$color' },
        },
      },
    ]);
    const distinctColors = colors.map((color) => color._id);

    res.status(200).json({
      materials: distinctMaterials,
      colors: distinctColors,
    });
  } catch (err) {
    console.log('Error getting filters from the server: ', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @desc        Get the products data in the cart
// route        POST /api/products
// @access      public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featuredProducts = await Product.find(
    { featured: true },
    'productName price images'
  );

  if (featuredProducts.length) {
    res.status(200).json(featuredProducts);
  } else {
    res.status(200).json({ message: 'No featured products' });
  }
});

// @desc        Get the products data in the cart
// route        POST /api/products
// @access      public
const getProducts = asyncHandler(async (req, res) => {
  const productIds = req.body;

  const products = await Product.find({
    _id: { $in: productIds },
  });
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404);
    throw new Error('Products not found from the DB');
  }
});

export { getProductsByCategory, getFilters, getProducts, getFeaturedProducts };
