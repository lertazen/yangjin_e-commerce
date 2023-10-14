import { useEffect, useState } from 'react';
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

const HOSTNAME = 'https://yangjintibetangarden.onrender.com';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${HOSTNAME}/checkout-success`,
        },
      });

      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <Box component='form' id='payment-form' onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id='link-authentication-element'
        onChange={(e) => setEmail(e.value.email)}
      />
      <PaymentElement id='payment-element' options={paymentElementOptions} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          disabled={isLoading || !stripe || !elements}
          id='submit'
          type='submit'
          variant='contained'
          sx={{ mt: 4, py: 2, px: 4 }}
        >
          {isLoading ? <CircularProgress sx={{ fontSize: 30 }} /> : 'Pay now'}
        </Button>
      </Box>
      {/* Show any error or success messages */}
      {message && (
        <Box id='payment-message'>
          <Typography variant='body1' sx={{ color: 'error.main' }}>
            {message}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutForm;
