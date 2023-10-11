import {
  Container,
  Box,
  Rating,
  Skeleton,
  Paper,
  Typography,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductTabs from './ProductTabs';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import { fetchProductByName } from '../../services/products-services';
import AlertSnackbar from '../../components/AlertSnackbar';
import { getUserInfo } from '../../utils/userHelper';
import AddToCartButton from '../../components/AddToCartButton';

const Thumbnail = ({ img, onClick }) => {
  return (
    <Paper
      elevation={4}
      onClick={() => onClick(img)}
      sx={{
        backgroundImage: `url(${img})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: { xs: '30%', md: '100%' },
        pb: { xs: '30%', md: '100%' },
        borderRadius: 5,
        mb: 2,
        cursor: 'pointer',
      }}
    />
  );
};

const ProductDetail = () => {
  const { cart, setCart } = useContext(ShoppingCartContext);
  const { productname } = useParams();
  const [currentBigImg, setCurrentBigImg] = useState('');

  const userInfo = getUserInfo();
  const [isLoading, setIsLoading] = useState(false);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');
  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleImageChange = (imageUrl) => {
    setCurrentBigImg(imageUrl);
  };

  useEffect(() => {
    const fetchAndSetProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await fetchProductByName(productname);
        setProduct(fetchedProduct);
        setCurrentBigImg(fetchedProduct.images[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSetProduct();
  }, [productname]);

  return (
    <Container maxWidth='xl'>
      {/* upper part above tabs */}
      <Box
        sx={{
          width: '100%',
          my: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* images part  */}
        <Box
          sx={{
            width: { xs: '100%', md: '70%' },
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: { xs: 2, md: 0 },
              width: { xs: '100%', md: '20%' },
              justifyContent: { xs: 'space-between', md: 'flex-start' },
            }}
          >
            {product &&
              product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  img={product.images[index]}
                  onClick={() => handleImageChange(product.images[index])}
                />
              ))}
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: '80%' },
              px: { md: 3 },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Paper
              sx={{
                backgroundImage: `url(${currentBigImg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                pb: '100%',
                borderRadius: 5,
              }}
            />
          </Box>
        </Box>
        {/* product user options */}
        <Box
          sx={{
            width: { xs: '100%', md: '30%' },
          }}
        >
          {product ? (
            <>
              <Typography variant='h5' fontWeight='bold'>
                {product.productName}
              </Typography>
              <Rating value={product.averageRating || 0} readOnly />
              <Typography variant='h6'>${product.price}</Typography>
              <Typography variant='caption'>{product.description}</Typography>
            </>
          ) : (
            <>
              <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
              <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
              <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
              <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
            </>
          )}
          <Divider variant='middle' sx={{ width: '100%', my: 3, mx: 0 }} />

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
                md: 'column',
                lg: 'row',
              },
              justifyContent: 'space-between',
              gap: { xs: 2, md: 3 },
            }}
          >
            {/* Quantity changing button */}
            <Box
              sx={{
                flex: { sm: 1 },
                border: '1px solid',
                borderColor: 'primary',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <IconButton
                onClick={() => {
                  setQuantity(quantity - 1);
                }}
                disabled={quantity === 1}
              >
                <RemoveIcon />
              </IconButton>
              {quantity}
              <IconButton
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
                disabled={quantity === product?.stockQuantity}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <AddToCartButton
              product={product}
              quantity={quantity}
              setAlertMessage={setAlertMessage}
              setAlertSeverity={setAlertSeverity}
              setSnackbarOpen={setSnackbarOpen}
              sx={{ flex: { sm: 1.8 }, borderRadius: 6 }}
            />
          </Box>
        </Box>
      </Box>
      {/* lower part product tabs*/}
      <Box
        sx={{
          width: '100%',
          my: 3,
        }}
      >
        {product ? (
          <ProductTabs product={product} />
        ) : (
          <Skeleton variant='rectangular' />
        )}
      </Box>
      <AlertSnackbar
        snackbarOpen={snackbarOpen}
        handleCloseSnackbar={handleCloseSnackbar}
        alertMessage={alertMessage}
        severity={alertSeverity}
      />
    </Container>
  );
};

export default ProductDetail;
