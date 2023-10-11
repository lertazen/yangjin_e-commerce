import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  OutlinedInput,
  InputLabel,
  TextField,
  FormHelperText,
  Paper,
  Link,
  Dialog,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { setCredentials } from '../../utils/userHelper.js';
import {
  fetchCartData,
  loadCartFromLocal,
  saveCartToLocal,
} from '../../utils/cartHelper.js';
import { addItemToCart } from '../../services/cart-services.js';
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext.jsx';
import { singInUser } from '../../services/user-services.js';

const LoginUser = ({ open, setOpen }) => {
  const { setCart } = useContext(ShoppingCartContext);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const user = { userEmail, userPassword };
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handlePasswordChange = (e) => {
    if (userPassword.length === 0) {
      setPasswordMatch(true);
    }
    setUserPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await singInUser(user);

      if (userData) {
        const localCart = loadCartFromLocal();
        if (localCart.length > 0) {
          const localCartProducts = localCart.map((obj) => {
            return {
              productId: obj.cartProduct._id,
              quantity: obj.cartQuantity,
            };
          });

          const newUpdatedCartProducts = await addItemToCart(localCartProducts);
          if (newUpdatedCartProducts) {
            const serverCart = await fetchCartData();
            setCart(serverCart);
          }
        }
        setCredentials(userData);
        setOpen(false);
        navigate('/');
      } else {
        setPasswordMatch(false);
        setUserPassword('');
        const errorMessage = await res.text();
        console.error('Error logging in user: ', errorMessage);
      }
    } catch (error) {
      console.log('Error sending the request', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Typography variant='h3' align='center' sx={{ pt: 3, fontWeight: 500 }}>
        Sign In
      </Typography>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TextField
          required
          id='email'
          label='Email Address'
          type='email'
          value={userEmail}
          fullWidth
          onChange={(e) => setUserEmail(e.target.value)}
          sx={{ my: 1 }}
        />

        <FormControl
          sx={{
            my: 1,
            position: 'relative',
          }}
          required
          variant='outlined'
          error={!passwordMatch}
        >
          <InputLabel htmlFor='password'>Password</InputLabel>
          <OutlinedInput
            id='password'
            type={showPassword ? 'text' : 'password'}
            error={!passwordMatch}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
            value={userPassword}
            onChange={handlePasswordChange}
          />
          <FormHelperText
            sx={{
              display: passwordMatch ? 'none' : 'block',
              position: 'absolute',
              top: '100%',
            }}
          >
            Invalid email or password
          </FormHelperText>
        </FormControl>
        <Button
          type='submit'
          variant='contained'
          sx={{
            borderRadius: 8,
            py: 1,
            px: 2,
            mt: 4,
            width: '100%',
          }}
        >
          Sign in
        </Button>
        <Link
          component={RouterLink}
          onClick={() => {
            setOpen(false);
          }}
          sx={{ my: 2 }}
          to='/'
        >
          Cancel
        </Link>
        <Typography variant='subtitle1'>
          New customer? /
          <Link
            component={RouterLink}
            to='/user/register'
            onClick={() => setOpen(false)}
          >
            Register
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default LoginUser;
