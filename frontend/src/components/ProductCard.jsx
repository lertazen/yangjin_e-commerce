import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Paper } from '@mui/material';

const ProductCard = ({ featuredProduct }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: "center",
        alignItems: 'center',
      }}
    >
      <Paper
        component={RouterLink}
        to={`/product/${encodeURIComponent(
          featuredProduct.productName.toLowerCase()
        )}`}
        elevation={6}
        sx={{
          backgroundImage: `url(${featuredProduct.images[0]})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: { xs: 200, sm: 225, md: 250 },
          height: { xs: 200, sm: 225, md: 250 },
          borderRadius: 5,
          my: 2,
        }}
      />
      <Box
        sx={{
          width: { xs: 200, sm: 225, md: 250 },
        }}
      >
        <Typography
          component={RouterLink}
          to={`/product/${encodeURIComponent(
            featuredProduct.productName.toLowerCase()
          )}`}
          variant='subtitle1'
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            ':visited': { color: 'text.primary' },
          }}
        >
          {featuredProduct.productName}
        </Typography>
        <Typography variant='body1'>${featuredProduct.price}</Typography>
      </Box>
    </Box>
  );
};

export default ProductCard;
