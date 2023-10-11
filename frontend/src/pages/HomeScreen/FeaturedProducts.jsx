import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { Box, Container, Typography, Grid } from '@mui/material';
import { fetchFeaturedProducts } from '../../services/products-services';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchAndSetFeaturedProducts = async () => {
      const fetchedFeaturedProducts = await fetchFeaturedProducts();
      setFeaturedProducts(fetchedFeaturedProducts);
    };
    fetchAndSetFeaturedProducts();
  }, []);

  return (
    <Container maxWidth='xl' disableGutters>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box mb={7}>
          <Typography variant='h3' align='center'>
            Featured Products
          </Typography>
        </Box>
        <Box>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
          >
            {featuredProducts.length !== 0 &&
              featuredProducts.map((featuredProduct) => (
                <Grid
                  item
                  xs={4}
                  sm={4}
                  md={4}
                  lg={3}
                  key={featuredProduct.productName}
                >
                  <ProductCard featuredProduct={featuredProduct} />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default FeaturedProducts;
