import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Drawer,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { ShoppingCartContext } from '../contexts/ShoppingCartContext';
import {
  fetchCartData,
  handleDeleteItemInCart,
  handleUpdateQuantity,
  loadCartFromLocal,
  saveCartToLocal,
} from '../utils/cartHelper';
import AlertSnackbar from './AlertSnackbar';
import CheckoutButton from './CheckoutButton';

const CartMenu = ({ open, onClose }) => {
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

  useEffect(() => {
    const fetchAndSetCartData = async () => {
      try {
        const localCart = loadCartFromLocal();
        const serverCart = await fetchCartData();
        if (serverCart) {
          setCart(serverCart);
        } else {
          setCart(localCart || []);
        }
      } catch (err) {
        setCart([]);
        console.log(err);
      }
    };
    fetchAndSetCartData();
  }, []);

  return (
    <Drawer
      PaperProps={{ elevation: 5 }}
      open={open}
      anchor='right'
      onClose={onClose}
      variant='persistent'
      sx={{
        // width: { xs: '100%', sm: '50%', md: '20%', lg: '20%' },
        position: 'relative',
        '& > .MuiPaper-root': {
          borderLeft: 'none',
          width: { xs: '100%', sm: '75%', md: '50%', lg: '25%' },
        },
      }}
    >
      <IconButton onClick={onClose} sx={{ position: 'absolute' }}>
        <CloseIcon />
      </IconButton>
      <Typography variant='h6' textAlign='center' sx={{ p: 2 }}>
        Shopping cart
      </Typography>

      <Box
        sx={{
          maxHeight: '80vh',
          overflowY: 'auto',
          px: 2,
        }}
      >
        {cart.length ? (
          cart.map((p, index) => (
            <Box
              key={p.cartProduct.productName}
              sx={{ py: 1, px: { xs: 0, md: 2 } }}
            >
              <Box
                sx={{
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component={RouterLink}
                    to={`product/${p.cartProduct.productName}`}
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
                    component={RouterLink}
                    to={`product/${p.cartProduct.productName}`}
                    variant='subtitle1'
                    sx={{
                      ml: 1,
                      color: 'text.primary',
                      textDecoration: 'none',
                      ':visited': { color: 'text.primary' },
                    }}
                  >
                    {p.cartProduct.productName}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    py: 2,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary',
                        borderRadius: 6,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
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
                        // ml: 3,
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignContent: 'flex-end' }}>
                    <Typography variant='body1'>
                      ${computePricePerItem(p)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
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
            <ShoppingCartOutlinedIcon sx={{ fontSize: 200, mb: 3 }} />
            <Typography variant='h5'>Your cart is empty.</Typography>
            <Button
              component={RouterLink}
              to='/products/all'
              variant='contained'
              sx={{ mt: 5 }}
              onClick={onClose}
            >
              Keep shopping
            </Button>
          </Box>
        )}
      </Box>
      {cart.length ? (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            mb: 3,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant='subtitle1'>Subtotal: ${subtotal}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Button
              component={RouterLink}
              to='cart'
              variant='outlined'
              sx={{ flex: 1 }}
              onClick={onClose}
            >
              View my cart ({cart.length})
            </Button>
            <CheckoutButton sx={{ flex: 1 }} disabled={cart.length === 0} />
          </Box>
        </Box>
      ) : (
        <></>
      )}
      <AlertSnackbar
        snackbarOpen={snackbarOpen}
        handleCloseSnackbar={handleCloseSnackbar}
        alertMessage={alertMessage}
        severity={alertSeverity}
      />
    </Drawer>
  );
};

export default CartMenu;
