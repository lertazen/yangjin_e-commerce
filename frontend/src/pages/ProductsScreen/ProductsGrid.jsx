import {
  Box,
  Pagination,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
  Skeleton,
  Grid,
  IconButton,
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../utils/userHelper';
import {
  fetchWishlistData,
  addOrRemoveProductInWishlist,
} from '../../services/user-services';
import AlertSnackbar from '../../components/AlertSnackbar';
import AddToCartButton from '../../components/AddToCartButton';

const ProductsGrid = ({
  products,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  totalAmount,
  isLoading,
}) => {
  const theme = useTheme();
  const userInfo = getUserInfo();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isToggling, setIsToggling] = useState(false);

  const belowMd = useMediaQuery(theme.breakpoints.down('md'));
  const aboveMd = useMediaQuery(theme.breakpoints.up('md'));

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');
  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleToggleAddToWishList = async (productId) => {
    setIsToggling(true);
    try {
      const status = await addOrRemoveProductInWishlist(productId);
      if (status === 'added') {
        setWishlistProducts((prevWishlist) => [...prevWishlist, productId]);
      } else if (status === 'removed') {
        setWishlistProducts((prevWishlist) =>
          prevWishlist.filter((pid) => pid !== productId)
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsToggling(false);
    }
  };

  const totalPages = Math.ceil(totalAmount / itemsPerPage);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchAndSetWishlistData = async () => {
      if (userInfo) {
        try {
          const wishlistData = await fetchWishlistData();
          if (wishlistData) {
            setWishlistProducts(wishlistData);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchAndSetWishlistData();
  }, [userInfo?._id]);

  useEffect(() => {
    if (belowMd) {
      setItemsPerPage(6);
    } else if (aboveMd) {
      setItemsPerPage(12);
    }
  }, [belowMd, aboveMd]);

  return (
    <Box pb={{ xs: 2, sm: 3 }}>
      <AlertSnackbar
        snackbarOpen={snackbarOpen}
        handleCloseSnackbar={handleCloseSnackbar}
        alertMessage={alertMessage}
        severity={alertSeverity}
      />
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 9, md: 12 }}
      >
        {products.map((product, index) => (
          <Grid item xs={2} sm={3} md={3} key={product._id}>
            {isLoading ? (
              <Skeleton variant='rectangular' sx={{ pb: '100%' }} />
            ) : (
              <Box
                sx={{
                  overflow: 'hidden',
                  wordWrap: 'break-word',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  {userInfo && (
                    <IconButton
                      onClick={() => handleToggleAddToWishList(product._id)}
                      disabled={isToggling}
                      sx={{ ml: 'auto', display: 'block' }}
                    >
                      {wishlistProducts.includes(product._id) ? (
                        <Tooltip title='Remove from wishlist'>
                          <FavoriteIcon sx={{ color: 'secondary.main' }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title='Add to wishlist'>
                          <FavoriteBorderIcon
                            sx={{ color: 'secondary.main' }}
                          />
                        </Tooltip>
                      )}
                    </IconButton>
                  )}
                  <Link
                    component={RouterLink}
                    underline='none'
                    to={`/product/${encodeURIComponent(
                      product.productName.toLowerCase()
                    )}`}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${product.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '100%',
                        pb: '100%',
                        position: 'relative',
                        ':hover': { transform: 'scale(1.05)' },
                      }}
                    ></Box>
                    <Typography variant='subtitle1'>
                      {product.productName}
                    </Typography>
                  </Link>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant='subtitle2'>${product.price}</Typography>
                  <AddToCartButton
                    product={product}
                    quantity={1}
                    setAlertMessage={setAlertMessage}
                    setAlertSeverity={setAlertSeverity}
                    setSnackbarOpen={setSnackbarOpen}
                    sx={{ width: '100%' }}
                  />
                </Box>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 3,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color='primary'
        />
      </Box>
    </Box>
  );
};

export default ProductsGrid;
