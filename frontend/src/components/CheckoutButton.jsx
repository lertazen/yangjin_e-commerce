import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';

const CheckoutButton = ({ sx, disabled }) => {
  return (
    <Button
      variant='contained'
      component={RouterLink}
      to='/checkout/information'
      sx={sx}
      disabled={disabled}
    >
      Check out
    </Button>
  );
};

export default CheckoutButton;
