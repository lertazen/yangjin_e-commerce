import asyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';
import { getImageUrls } from '../utils/getImageUrls.js';

// @desc        Get all products
// route        GET /api/dashboard/products
// @access      admin private
//TODO          Add admin authentication middleware before this in dashboard route
const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const products = await Product.find({}).skip(skip).limit(limit);
    const totalAmount = await Product.countDocuments({});

    res.status(200).json({ products, totalAmount });
  } catch (err) {
    console.log(err);
    res.status(404);
    throw new Error('Products not found in dashboard');
  }
});

// @desc        Create a product
// route        POST /api/dashboard/products
// @access      private
const createProduct = asyncHandler(async (req, res) => {
  try {
    const imageUrls = await getImageUrls(req.files);
    const {
      productName,
      price,
      category,
      material,
      size,
      color,
      description,
      stockQuantity,
      isInStock,
      salePrice,
      isOnSale,
      tags,
      featured,
    } = req.body;

    const productExists = await Product.findOne({ productName });

    if (productExists) {
      res.status(400);
      throw new Error('Product already exists');
    }

    const newProduct = await Product.create({
      productName,
      price,
      category,
      material,
      size,
      color,
      description,
      images: imageUrls,
      stockQuantity,
      isInStock,
      salePrice,
      isOnSale,
      tags,
      featured,
    });

    if (newProduct) {
      res.status(201).json({
        _id: newProduct._id,
        productName: newProduct.productName,
        price: newProduct.price,
        category: newProduct.category,
        material: newProduct.material,
        size: newProduct.size,
        color: newProduct.color,
        description: newProduct.description,
        images: newProduct.images,
        stockQuantity: newProduct.stockQuantity,
        isInStock: newProduct.isInStock,
        salePrice: newProduct.salePrice,
        isOnSale: newProduct.isOnSale,
        tags: newProduct.tags,
        featured: newProduct.featured,
      });
    } else {
      res.status(400);
      throw new Error('Invalid product data');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading images or saving product.');
  }
});

// @desc        Delete a product
// route        DELETE /api/dashboard/products/:productId
// @access      private
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  try {
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product removed' });
  } catch (err) {
    res.status(400);
    throw new Error('Product not found: ', err);
  }
});

// @desc        Get a product by _id
// route        GET /api/dashboard/products/:productId
// @access      private
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error retrieving product');
  }
});

// @desc        Update a product by _id
// route        PUT /api/dashboard/products/:productId
// @access      private
const updateProductById = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.productId;
    const imageUrls = await getImageUrls(req.files);
    // console.log(imageUrls);
    const {
      productName,
      price,
      category,
      material,
      size,
      color,
      description,
      stockQuantity,
      isInStock,
      salePrice,
      isOnSale,
      tags,
      existingImageURLs,
      featured,
    } = req.body;

    const existingImageURLsArray = existingImageURLs
      ? JSON.parse(existingImageURLs)
      : [];
    // console.log(existingImageURLsArray);

    let product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    product.productName = productName || product.productName;
    product.description = description || product.description;
    product.material = material || product.material;
    product.color = color || product.color;
    product.size = size || product.size;
    product.tags = tags || product.tags;
    product.price = price || product.price;
    product.stockQuantity = stockQuantity || product.stockQuantity;
    product.category = category || product.category;
    product.featured = featured || product.featured;
    if (!imageUrls.length && existingImageURLsArray.length) {
      product.images = existingImageURLsArray;
    } else if (imageUrls.length && existingImageURLsArray.length) {
      product.images = existingImageURLsArray.concat(imageUrls);
    } else if (imageUrls.length && !existingImageURLsArray.length) {
      product.images = imageUrls;
    } else if (!imageUrls.length && !existingImageURLs.length) {
      product.images = [];
    }
    // console.log();

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400);
    throw new Error('Error updating product: ', err);
  }
});

export {
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProductById,
};
