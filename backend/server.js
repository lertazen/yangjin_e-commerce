import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import cookieParser from 'cookie-parser';

import categoryRoutes from './routes/categoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { webhookHandler } from './controllers/checkoutController.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(
  '/api/checkout/webhook',
  express.raw({ type: 'application/json' }),
  webhookHandler
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/subscriber', subscriberRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/reviews', reviewRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Server is ready');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
