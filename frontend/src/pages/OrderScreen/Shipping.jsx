import { Box, Button, Divider, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserInfo } from '../../utils/userHelper';
import { useContext } from 'react';
import { CheckoutContext } from '../../contexts/CheckoutContext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const Shipping = () => {
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
        <Box sx={{ display: 'flex', alignItems: 'baseline', pb: 1 }}>
          <Typography
            variant='subtitle1'
            sx={{ width: '20%', color: 'text.disabled', pr: 1 }}
          >
            Contact
          </Typography>
          <Typography variant='subtitle1' sx={{ width: '60%', pr: 2 }}>
            {userInfo.email}
          </Typography>
          <Box
            sx={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}
          >
            <Link component={RouterLink} to='/checkout/information'>
              Change
            </Link>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'baseline', pt: 1 }}>
          <Typography
            variant='subtitle1'
            sx={{ color: 'text.disabled', width: '20%', pr: 1 }}
          >
            Ship to
          </Typography>
          <Typography variant='subtitle1' sx={{ width: '60%', pr: 2 }}>
            {formattedShippingInfo}
          </Typography>
          <Box
            sx={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}
          >
            <Link component={RouterLink} to='/checkout/information'>
              Change
            </Link>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', mt: 5, justifyContent: 'space-between' }}>
        <Link
          component={RouterLink}
          to='/checkout/information'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <NavigateBeforeIcon />
          Back to Information
        </Link>
        <Button
          component={RouterLink}
          to='/checkout/payment'
          variant='contained'
          sx={{
            textTransform: 'none',
            py: 2,
          }}
        >
          Continue to payment
        </Button>
      </Box>
    </Box>
  );
};

export default Shipping;
