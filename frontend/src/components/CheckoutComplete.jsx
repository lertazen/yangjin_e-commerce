import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import StripeWrapper from './StripeWrapper';
import { fetchOrder } from '../services/user-services';
import OrderDetailCard from './OrderDetailCard';
import { fetchCartProducts } from '../services/cart-services';

const CheckoutComplete = () => {
  const [message, setMessage] = useState(null);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const paymentIntentId = new URLSearchParams(window.location.search).get(
      'payment_intent'
    );
    const fetchPaidOrder = async (paymentIntentId) => {
      try {
        setIsLoading(true);
        const fetchedOrder = await fetchOrder(paymentIntentId);

        if (fetchedOrder) {
          const fetchedProducts = await fetchCartProducts(
            fetchedOrder.products
          );
          const updatedProducts = fetchedOrder.products.map((product) => {
            const fetchedProduct = fetchedProducts.find(
              (fp) => fp._id === product.productId
            );
            return { ...product, images: fetchedProduct.images };
          });
          setOrder({ ...fetchedOrder, products: updatedProducts });
          setMessage('Thank you for your purchase!');
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(() => {
      if (order) {
        clearInterval(interval);
        setIsLoading(false);
      } else {
        fetchPaidOrder(paymentIntentId);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [order]);

  return (
    <StripeWrapper>
      <Container maxWidth='xl'>
        <Box sx={{ minHeight: '50vh', mt: 5 }}>
          {message ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <CheckCircleOutlineOutlinedIcon
                sx={{ fontSize: 110, color: 'success.main' }}
              />
              <Typography variant='h4'>{message}</Typography>

              {!isLoading && order ? (
                <Box sx={{ mt: 5, width: '100%' }}>
                  <OrderDetailCard order={order} />
                </Box>
              ) : (
                <CircularProgress sx={{ mt: 4 }} />
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Container>
    </StripeWrapper>
  );
};

export default CheckoutComplete;
