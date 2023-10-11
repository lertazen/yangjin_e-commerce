import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import './styles/global.css';
import Home from './pages/HomeScreen/Home.jsx';
import Products from './pages/ProductsScreen/Products.jsx';
import ProductDetail from './pages/ProductDetailScreen/ProductDetail.jsx';
import RegisterUser from './pages/UserScreen/RegisterUser.jsx';
import DashboardMain from './pages/DashboardScreen/DashboardMain.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import DefaultLayout from './layouts/DefaultLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProductsManagement from './pages/DashboardScreen/ProductsManagement.jsx';
import DashboardProductsGrid from './pages/DashboardScreen/DashboardProductsGrid.jsx';
import EditProductForm from './pages/DashboardScreen/EditProductForm.jsx';
import ShoppingCart from './pages/OrderScreen/ShoppingCart.jsx';
import Information from './pages/OrderScreen/Information.jsx';
import CheckoutLayout from './layouts/CheckoutLayout.jsx';
import Shipping from './pages/OrderScreen/Shipping.jsx';
import Payment from './pages/OrderScreen/Payment.jsx';
import UserRoute from './components/UserRoute.jsx';
import UserProfile from './pages/UserScreen/UserProfile.jsx';
import CheckoutSuccess from './pages/OrderScreen/CheckoutSuccess.jsx';
import UserOrder from './pages/UserScreen/UserOrder.jsx';
import CreateReview from './pages/ReviewScreen/CreateReview.jsx';
import ReviewSuccess from './pages/ReviewScreen/ReviewSuccess.jsx';
import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path='products/:category' element={<Products />} />
        <Route path='product/:productname' element={<ProductDetail />} />
        <Route path='user/register' element={<RegisterUser />} />
        <Route path='cart' element={<ShoppingCart />} />
        <Route path='review-success' element={<ReviewSuccess />} />
        <Route path='*' element={<NotFound />} />

        <Route path='' element={<UserRoute />}>
          <Route path='user/profile' element={<UserProfile />} />
          <Route path='user/orders' element={<UserOrder />} />
          <Route path='product/:productId/review' element={<CreateReview />} />
        </Route>
        <Route path='checkout-success' element={<CheckoutSuccess />} />
      </Route>
      <Route path='checkout' element={<CheckoutLayout />}>
        <Route path='information' index element={<Information />} />
        <Route path='shipping' element={<Shipping />} />
        <Route path='payment' element={<Payment />} />
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<DashboardMain />} />
          {/* <Route path='/dashboard/top-products' element={< />} /> */}
          <Route
            path='/dashboard/product-grid'
            element={<DashboardProductsGrid />}
          />
          <Route
            path='/dashboard/manage-products'
            element={<ProductsManagement />}
          />
          <Route path='/dashboard/edit-product' element={<EditProductForm />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
