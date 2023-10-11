import { useContext, useEffect, useState } from 'react';
import { Box, Radio, Typography, Button, TextField } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { getUserInfo } from '../../utils/userHelper.js';
import { CheckoutContext } from '../../contexts/CheckoutContext.jsx';

const Information = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  const { shippingInfo, setShippingInfo } = useContext(CheckoutContext);

  const [deliveryMethod, setDeliveryMethod] = useState('shipping');

  const handleDeliveryMethodChange = (event) => {
    setDeliveryMethod(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate('/checkout/shipping');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Typography variant='h5'>Contact</Typography>
        <Typography variant='body1'>Username: {userInfo.username}</Typography>
        <Typography variant='body1'>Email: {userInfo.email}</Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant='h5'>Delivery Method</Typography>
        <Box
          sx={{
            width: '100%',
            p: 1,
            mt: 3,
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Radio
              checked={deliveryMethod === 'shipping'}
              onChange={handleDeliveryMethodChange}
              value='shipping'
              name='shipping-radio-button'
              inputProps={{ 'aria-label': 'Shipping' }}
            />
            <LocalShippingOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant='h6'>Ship</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Radio
              disabled
              checked={deliveryMethod === 'pick-up'}
              onChange={handleDeliveryMethodChange}
              value='pick-up'
              name='shipping-radio-button'
              inputProps={{ 'aria-label': 'Pick-up' }}
            />
            <StorefrontOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant='h6'>Pick up</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{ mt: 3, gap: 2, display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant='h5' sx={{ mb: 3 }}>
          Shipping Address
        </Typography>
        <TextField
          id='country/region'
          label='Country/Region'
          variant='outlined'
          fullWidth
          required
          sx={{ bgcolor: 'background.default' }}
          value={shippingInfo.country || ''}
          onChange={(e) =>
            setShippingInfo((prevInfo) => {
              return { ...prevInfo, country: e.target.value };
            })
          }
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            id='firstname'
            label='First name'
            required
            variant='outlined'
            sx={{
              width: { xs: '100%', sm: '48%' },
              mb: { xs: 2, sm: 0 },
              bgcolor: 'background.default',
            }}
            value={shippingInfo.fname || ''}
            onChange={(e) =>
              setShippingInfo((prevInfo) => {
                return { ...prevInfo, fname: e.target.value };
              })
            }
          />
          <TextField
            id='lastname'
            label='Last name'
            variant='outlined'
            required
            sx={{
              width: { xs: '100%', sm: '48%' },
              bgcolor: 'background.default',
            }}
            value={shippingInfo.lname || ''}
            onChange={(e) =>
              setShippingInfo((prevInfo) => {
                return { ...prevInfo, lname: e.target.value };
              })
            }
          />
        </Box>
        <TextField
          id='company'
          label='Company (optional)'
          variant='outlined'
          fullWidth
          sx={{ bgcolor: 'background.default' }}
          value={shippingInfo.company || ''}
          onChange={(e) =>
            setShippingInfo((prevInfo) => {
              return { ...prevInfo, company: e.target.value };
            })
          }
        />
        <TextField
          id='address'
          label='Address'
          variant='outlined'
          fullWidth
          required
          sx={{ bgcolor: 'background.default' }}
          value={shippingInfo.address || ''}
          onChange={(e) =>
            setShippingInfo((prevInfo) => {
              return { ...prevInfo, address: e.target.value };
            })
          }
        />
        <TextField
          id='apartment'
          label='Apartment, suite, etc. (optional)'
          variant='outlined'
          fullWidth
          sx={{ bgcolor: 'background.default' }}
          value={shippingInfo.apartment || ''}
          onChange={(e) =>
            setShippingInfo((prevInfo) => {
              return { ...prevInfo, apartment: e.target.value };
            })
          }
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <TextField
            id='city'
            label='City'
            required
            variant='outlined'
            sx={{
              width: { xs: '100%', sm: '31%' },
              bgcolor: 'background.default',
            }}
            value={shippingInfo.city || ''}
            onChange={(e) =>
              setShippingInfo((prevInfo) => {
                return { ...prevInfo, city: e.target.value };
              })
            }
          />
          <TextField
            id='province'
            label='Province'
            variant='outlined'
            required
            sx={{
              width: { xs: '100%', sm: '31%' },
              bgcolor: 'background.default',
            }}
            value={shippingInfo.province || ''}
            onChange={(e) =>
              setShippingInfo((prevInfo) => {
                return { ...prevInfo, province: e.target.value };
              })
            }
          />
          <TextField
            id='postalcode'
            label='Postal code'
            variant='outlined'
            required
            sx={{
              width: { xs: '100%', sm: '31%' },
              bgcolor: 'background.default',
            }}
            value={shippingInfo.postalCode || ''}
            onChange={(e) =>
              setShippingInfo((prevInfo) => {
                return { ...prevInfo, postalCode: e.target.value };
              })
            }
          />
        </Box>
        <TextField
          id='phone'
          label='Phone'
          variant='outlined'
          fullWidth
          required
          sx={{ bgcolor: 'background.default' }}
          value={shippingInfo.phone || ''}
          onChange={(e) =>
            setShippingInfo((prevInfo) => {
              return { ...prevInfo, phone: e.target.value };
            })
          }
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            type='submit'
            sx={{
              textTransform: 'none',
              mt: 3,
              py: 2,
            }}
          >
            Continue to shipping
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Information;
