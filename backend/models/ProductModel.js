import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    material: {
      type: String,
      require: true,
    },
    size: {
      type: String,
      require: true,
    },
    color: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    images: [
      {
        type: String,
      },
    ],
    stockQuantity: {
      type: Number,
      default: 0,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: 'Stock quantity cannot be negative',
      },
    },
    isInStock: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String, default: '' }],
    featured: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
