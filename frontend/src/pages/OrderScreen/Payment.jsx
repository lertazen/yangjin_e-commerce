import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { initPaymentIntent } from '../../services/checkout-services';
import {
  Box,
  Button,
  Divider,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import { fetchUserCart } from '../../services/cart-services';
import { getUserInfo } from '../../utils/userHelper';
import { useContext } from 'react';
import { CheckoutContext } from '../../contexts/CheckoutContext';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(publishableKey);

const Payment = () => {
  const theme = useTheme();

  const userInfo = getUserInfo();

  const { shippingInfo } = useContext(CheckoutContext);

  const formattedShippingInfo = `${
    shippingInfo.company ? shippingInfo.company + ', ' : ''
  }${shippingInfo.address}, ${
    shippingInfo.apartment ? shippingInfo.apartment + ', ' : ''
  } 
  ${shippingInfo.city} ${shippingInfo.province} ${shippingInfo.postalCode}, ${
    shippingInfo.country
  }`;
  const [clientSecret, setClientSecret] = useState('');

  const appearance = {
    theme: 'stripe',
    variables: {
      colorBackground: `${theme.palette.background.default}`,
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const cart = await fetchUserCart();

        if (cart.products.length) {
          const data = await initPaymentIntent(cart.products, shippingInfo);
          if (data) {
            setClientSecret(data.clientSecret);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchClientSecret();
  }, []);

  return (
    <Box sx={{ minHeight: '60vh' }}>
      <Box
        sx={{
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            pb: 1,
            flexDirection: 'column',
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{ color: 'text.disabled', pr: 1 }}
          >
            Contact
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Typography variant='subtitle1'>{userInfo.email}</Typography>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Link component={RouterLink} to='/checkout/information'>
                Change
              </Link>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', pt: 1, flexDirection: 'column' }}>
          <Typography
            variant='subtitle1'
            sx={{ color: 'text.disabled', pr: 1 }}
          >
            Ship to
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Typography variant='subtitle1'>{formattedShippingInfo}</Typography>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Link component={RouterLink} to='/checkout/shipping'>
                Change
              </Link>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', pt: 1, flexDirection: 'column' }}>
          <Typography
            variant='subtitle1'
            sx={{ color: 'text.disabled', pr: 1 }}
          >
            Shipping method
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Typography variant='subtitle1'>Free Shipping</Typography>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Link component={RouterLink} to='/checkout/shipping'>
                Change
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant='h5'>Payment</Typography>
        <Typography variant='body1' sx={{ color: 'text.disabled' }}>
          All transactions are secure and encrypted.
        </Typography>
      </Box>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </Box>
  );
};

export default Payment;
