import { Link, Box, Divider, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const OrderDetailCard = ({ order }) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <Box
      sx={{
        border: '2px solid',
        borderColor: 'text.disabled',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        my: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          bgcolor: 'background.default',
          p: 2,
          gap: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>Order Placed:</Typography>
          <Typography variant='caption'>
            {new Date(order.updatedAt).toLocaleDateString('en-US', options)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>ORDER # </Typography>
          <Typography variant='caption'>{order._id}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant='caption'>Total: </Typography>
          <Typography variant='caption'>${order.totalAmount / 100}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
        {order.products.map((product) => (
          <Box
            key={product._id}
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', sm: '60%' },
              }}
            >
              <Box
                component={RouterLink}
                to={`product/${product.productName}`}
                sx={{
                  mr: 1,
                  backgroundImage: `url(${product.images[0]})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  width: '100px',
                  height: '100px',
                  flexShrink: 0,
                }}
              />
              <Typography variant='body2'>{product.productName}</Typography>
            </Box>
            <Box
              sx={{
                width: { xs: '100%', sm: '40%' },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', sm: 'space-between' },
                alignItems: { xs: 'flex-end' },
                gap: { xs: 1, sm: 4 },
              }}
            >
              <Typography variant='body2'>Qty: {product.quantity}</Typography>
              <Typography variant='body2' textAlign='end'>
                ${product.priceAtPurchase}
              </Typography>
              <Link
                component={RouterLink}
                to={`/product/${product.productId}/review`}
                variant='outlined'
                sx={{ textTransform: 'none', mx: 3 }}
              >
                Write a review
              </Link>
            </Box>
            <Divider
              sx={{
                width: '100%',
                display: { xs: 'inline-block', sm: 'none' },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrderDetailCard;
