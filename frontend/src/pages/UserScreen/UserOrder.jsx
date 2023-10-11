import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchOrders } from '../../services/user-services';
import OrderDetailCard from '../../components/OrderDetailCard';
import { fetchCartProducts } from '../../services/cart-services';

const UserOrder = () => {
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await fetchOrders();
        if (fetchedOrders && fetchedOrders.length > 0) {
          const updatedOrders = await Promise.all(
            fetchedOrders.map(async (order) => {
              const fetchedProducts = await fetchCartProducts(order.products);
              const updatedProducts = order.products.map((product) => {
                const fetchedProduct = fetchedProducts.find(
                  (fp) => fp._id === product.productId
                );
                return fetchedProduct
                  ? { ...product, images: fetchedProduct.images }
                  : product;
              });
              return { ...order, products: updatedProducts };
            })
          );
          console.log(fetchedOrders);
          setOrders(updatedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserOrders();
  }, []);
  return (
    <Container maxWidth='xl'>
      <Box sx={{ minHeight: '50vh', mt: 5 }}>
        <Typography variant='h6'>My Orders</Typography>
        {orders ? (
          orders.length > 0 ? (
            orders.map((order) => (
              <OrderDetailCard key={order._id} order={order} />
            ))
          ) : (
            <Box sx={{ mt: 10 }}>
              <Typography variant='h4'>
                Sorry, you don't have any orders.
              </Typography>
            </Box>
          )
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UserOrder;
