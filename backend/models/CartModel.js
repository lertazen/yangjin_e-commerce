import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    dateKept: {
      type: Date,
      default: Date.now,
      index: { expires: '7d' },
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre('save', function (next) {
  this.dateKept = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
