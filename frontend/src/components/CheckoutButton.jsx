import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { checkAuthStatus } from '../services/user-services';

const CheckoutButton = ({ sx, disabled }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await checkAuthStatus();
      setIsLoggedIn(status);
    };
    checkLoginStatus();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <Button
          variant='contained'
          component={RouterLink}
          to='/checkout/information'
          sx={sx}
          disabled={disabled || !isLoggedIn}
        >
          Check out
        </Button>
      ) : (
        <Typography variant='body1' sx={{ color: 'red', my: 2 }}>
          Please log in to check out
        </Typography>
      )}
    </>
  );
};

export default CheckoutButton;
