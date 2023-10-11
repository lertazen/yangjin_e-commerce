import { useContext, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  handleDeleteItemInCart,
  handleUpdateQuantity,
  saveCartToLocal,
} from '../../utils/cartHelper';
import AlertSnackbar from '../../components/AlertSnackbar';

const ShoppingCart = () => {
  const { cart, setCart } = useContext(ShoppingCartContext);
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');

  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const subtotal =
    Math.round(
      cart.reduce((total, obj) => {
        return total + obj.cartProduct.price * obj.cartQuantity;
      }, 0) * 100
    ) / 100;

  const computePricePerItem = (item) => {
    return Math.round(item.cartProduct.price * item.cartQuantity * 100) / 100;
  };

  const handleIncQty = async (index) => {
    setIsLoading(true);
    try {
      await handleUpdateQuantity(cart, setCart, index, 1);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecQty = async (index) => {
    setIsLoading(true);
    try {
      await handleUpdateQuantity(cart, setCart, index, -1);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index) => {
    setIsLoading(true);
    try {
      await handleDeleteItemInCart(cart, setCart, index);
      setAlertMessage(
        `${cart[index].cartProduct.productName} has been removed`
      );
      setAlertSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setAlertSeverity('error');
      setSnackbarOpen(true);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updateLocalCart = async () => {
      try {
        await saveCartToLocal(cart);
      } catch (err) {
        console.log(err);
      }
    };
    updateLocalCart();
  }, [cart]);

  return (
    <Container maxWidth='xl'>
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          mt: 4,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ flex: 3, px: { xs: 0, md: 3 } }}>
          <Typography variant='h3' textAlign='center' sx={{ p: 2, mt: 5 }}>
            Your cart
          </Typography>
          <Divider />
          {cart.length > 0 ? (
            cart.map((p, index) => (
              <Box key={p.cartProduct.productName} sx={{ py: 1 }}>
                <Box
                  sx={{
                    p: { xs: 0, md: 1 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Box
                      component={RouterLink}
                      to={`/product/${p.cartProduct.productName}`}
                      sx={{
                        backgroundImage: `url(${p.cartProduct.images[0]})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '100px',
                        height: '100px',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant='subtitle1'
                      component={RouterLink}
                      replace
                      to={`/product/${p.cartProduct.productName}`}
                      sx={{
                        ml: 2,
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'text.primary',
                        ':visited': { color: 'text.primary' },
                      }}
                    >
                      {p.cartProduct.productName}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, display: 'flex', py: { xs: 2, md: 0 } }}>
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        maxHeight: 70,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid grey',
                          borderRadius: 5,
                        }}
                      >
                        <IconButton
                          disabled={isLoading || p.cartQuantity === 1}
                          onClick={() => {
                            handleDecQty(index);
                          }}
                          sx={{ py: 0 }}
                        >
                          <RemoveIcon fontSize='small' />
                        </IconButton>
                        <Typography variant='caption'>
                          {p.cartQuantity}
                        </Typography>
                        <IconButton
                          disabled={
                            isLoading ||
                            p.cartQuantity === p.cartProduct.stockQuantity
                          }
                          onClick={() => {
                            handleIncQty(index);
                          }}
                          sx={{ py: 0 }}
                        >
                          <AddIcon fontSize='small' />
                        </IconButton>
                      </Box>
                      <IconButton
                        disabled={isLoading}
                        onClick={() => handleDelete(index)}
                        sx={{
                          py: 0,
                          '&:hover': { color: 'error.main' },
                          ml: 3,
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography variant='body1'>
                        ${computePricePerItem(p)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant='h5'>Your cart is empty.</Typography>
              <Button
                component={RouterLink}
                to='/products/all'
                variant='contained'
                sx={{ mt: 5 }}
              >
                Keep shopping
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            pl: { xs: 0, md: 3 },
          }}
        >
          <Typography variant='h4' sx={{ mt: 5, p: 2 }}>
            Order Summary
          </Typography>
          <Divider sx={{ width: { sm: '50%', md: '100%' } }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: { sm: '50%', md: '100%' },
            }}
          >
            <Typography variant='subtitle1'>Subtotal:</Typography>
            <Typography variant='subtitle1'>${subtotal}</Typography>
          </Box>
          <Divider sx={{ width: { sm: '50%', md: '100%' } }} />
          <Button
            component={RouterLink}
            to='/checkout/information'
            variant='contained'
            sx={{
              textTransform: 'none',
              mt: 3,
              width: { sm: '50%', md: '100%' },
            }}
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
          <Button
            component={RouterLink}
            to='/products/all'
            variant='outlined'
            sx={{
              mt: 2,
              textTransform: 'none',
              width: { sm: '50%', md: '100%' },
            }}
          >
            Keep shopping
          </Button>
        </Box>
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

export default ShoppingCart;
