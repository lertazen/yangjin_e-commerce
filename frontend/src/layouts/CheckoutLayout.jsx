import { useEffect, useState } from 'react';
import {
  useTheme,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getUserInfo } from '../utils/userHelper.js';
import { calculateSubtotal } from '../utils/checkoutHelper.js';
import { loadCartFromLocal } from '../utils/cartHelper.js';
import { CheckoutProvider } from '../contexts/CheckoutContext.jsx';

const CheckoutLayout = () => {
  const theme = useTheme();
  const invoiceEntries = ['Subtotal', 'Shipping', 'Estimated taxes', 'Total'];
  const [subtotal, setSubtotal] = useState(0);
  const shippingCost = 0;
  const taxes = Math.round(subtotal * 0.13 * 100) / 100;
  const total = Math.round((subtotal + taxes) * 100) / 100;
  const invoiceData = [subtotal, shippingCost, taxes, total];

  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    const injectData = async () => {
      try {
        const calculatedSub = await calculateSubtotal();
        setSubtotal(calculatedSub);
        setLocalCart(() => {
          return loadCartFromLocal();
        });
      } catch (err) {
        console.log(err);
      }
    };
    injectData();
  }, []);

  return (
    <CheckoutProvider>
      <Box>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: -1,
            background: {
              xs: theme.palette.background.checkoutL,
              md: `linear-gradient(to right, 
            ${theme.palette.background.checkoutL}, 
            ${theme.palette.background.checkoutL} 55%,
            ${theme.palette.background.checkoutR} 55%, 
            ${theme.palette.background.checkoutR})`,
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row' },
          }}
        >
          {/* Left side */}
          <Box
            sx={{
              flex: 1.1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Box
              sx={{
                mt: 15,
                mr: { xs: 0, md: 5 },
                px: { xs: 2, md: 0 },
                width: { xs: '100%', md: '80%', lg: '60%', xl: '50%' },
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography
                  component={RouterLink}
                  to='/'
                  variant='h3'
                  sx={{ textDecoration: 'none', color: 'text.primary' }}
                >
                  Yangjin
                </Typography>
                <Breadcrumbs
                  aria-label='checkout-breadcrumbs'
                  separator={<NavigateNextIcon fontSize='small' />}
                  sx={{ mt: 3 }}
                >
                  <Link underline='hover' color='inherit' href='/cart'>
                    Cart
                  </Link>
                  <Link
                    component={RouterLink}
                    to='/checkout/information'
                    underline='hover'
                    color='inherit'
                  >
                    Information
                  </Link>
                  <Link
                    component={RouterLink}
                    to='/checkout/shipping'
                    underline='hover'
                    color='inherit'
                  >
                    Shipping
                  </Link>
                  <Link
                    underline='hover'
                    color='inherit'
                    component={RouterLink}
                    to='/checkout/payment'
                  >
                    Payment
                  </Link>
                </Breadcrumbs>
              </Box>
              <Divider sx={{ my: 3 }} />

              {/* The page specific content */}
              <Outlet />

              <Divider sx={{ mt: 10 }} />
              <Box sx={{ display: 'flex', gap: 3, my: 3 }}>
                <Link>Refund policy</Link>
                <Link>Privacy policy</Link>
                <Link>Terms of service</Link>
              </Box>
            </Box>
          </Box>

          {/* Right side */}
          <Box sx={{ flex: 0.9 }}>
            <Box
              sx={{
                width: { md: '80%', lg: '60%', xl: '50%' },
                mt: 15,
                ml: { xs: 0, md: 4 },
                px: { xs: 2, md: 0 },
              }}
            >
              <Typography variant='h5'>Invoice</Typography>
              <Divider />
              {localCart.length === 0 ? (
                <CircularProgress />
              ) : (
                localCart.map((obj) => (
                  <Box
                    key={obj.cartProduct._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      my: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        width: '20%',
                        pb: '20%',
                        backgroundImage: `url(${obj.cartProduct.images[0]})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    <Typography
                      variant='body2'
                      sx={{ width: '30%', wordBreak: 'break-word' }}
                    >
                      {obj.cartProduct.productName}
                    </Typography>
                    <Typography
                      variant='body1'
                      textAlign='end'
                      sx={{ width: '50%' }}
                    >
                      ${obj.cartProduct.price}
                    </Typography>
                  </Box>
                ))
              )}
              <Divider />
              <TableContainer>
                <Table aria-label='invoice-detail'>
                  <TableBody>
                    {invoiceEntries.map((el, index) => (
                      <TableRow
                        key={index}
                        sx={{ '& td, & th': { border: 0, px: 0, pb: 0 } }}
                      >
                        <TableCell component='th' scope='row'>
                          {el}
                        </TableCell>
                        <TableCell align='right'>
                          {invoiceData[index] === 0
                            ? 'free'
                            : `$${invoiceData[index]}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </CheckoutProvider>
  );
};

export default CheckoutLayout;
