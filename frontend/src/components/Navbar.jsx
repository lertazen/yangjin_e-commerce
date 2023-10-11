import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Link,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Badge,
  Button,
  Tooltip,
  MenuItem,
  Grow,
  FormControl,
  Input,
  InputAdornment,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { clearCredentials, getUserInfo } from '../utils/userHelper.js';
import { ShoppingCartContext } from '../contexts/ShoppingCartContext.jsx';
import LoginUser from '../pages/UserScreen/LoginUser.jsx';
import CartMenu from './CartMenu.jsx';
import { checkAuthStatus } from '../services/user-services.js';

const pages = ['All', 'Necklace', 'Rings', 'Bracelets', 'Earrings'];

const Navbar = () => {
  const userInfo = getUserInfo();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopListShow, setShopListShow] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, setCart } = useContext(ShoppingCartContext);

  let hideTimeout;
  const showShopList = () => {
    if (hideTimeout) clearTimeout(hideTimeout);

    setShopListShow(true);
  };

  const hideShopList = () => {
    hideTimeout = setTimeout(() => setShopListShow(false), 500);
  };
  const clearHideTimeout = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
  };

  const handleOpenLoginDialog = () => {
    setLoginDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/user/logout', {
        method: 'POST',
      });
      clearCredentials();
      setCart([]);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const closeCartDrawer = () => {
    setCartOpen(false);
  };

  const toggleCartDrawer = () => {
    setCartOpen((prevOpen) => !prevOpen);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const verifyAuth = async () => {
      const status = await checkAuthStatus();
      setIsAuthenticated(status);
    };
    verifyAuth();
  }, [userInfo]);

  return (
    <AppBar position='sticky' sx={{ height: { xs: 60, md: 70 } }}>
      <Container maxWidth='xl' sx={{ height: '100%' }}>
        <Toolbar disableGutters sx={{ height: '100%', display: 'flex' }}>
          <Link
            component={RouterLink}
            to='/'
            color={'inherit'}
            underline='none'
            sx={{
              my: 'auto',
              display: { xs: 'none', md: 'inline-block' },
              mr: 6,
            }}
          >
            <Typography
              variant='h5'
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              YANGJIN
            </Typography>
          </Link>

          {/* The hamburger menu to show categories
              hidden when bigger than md */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='products pages'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='inherit'
              onClick={(e) => {
                setAnchorElNav(e.currentTarget);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
                '.MuiPaper-root': {
                  backgroundColor: 'secondary.main',
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page}>
                  <Link
                    component={RouterLink}
                    to={`products/${page.toLowerCase()}`}
                    textAlign='center'
                    underline='none'
                    color='warning.main'
                    onClick={() => setAnchorElNav(null)}
                  >
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Brand name hidden when bigger than md */}
          <Typography
            variant='h5'
            noWrap
            component={RouterLink}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            YANGJIN
          </Typography>

          {/* Categories dropdown hidden when smaller than md */}
          <Box
            sx={{
              height: '100%',
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              position: 'relative',
            }}
          >
            <Button
              onMouseEnter={showShopList}
              onMouseLeave={hideShopList}
              disableElevation
              variant='contained'
              sx={{
                height: '100%',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'warning.main',
                },
                fontSize: 22,
                textTransform: 'none',
              }}
            >
              Shop
            </Button>
            {shopListShow && (
              <Grow in={shopListShow} style={{ transformOrigin: '0 0 0' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    borderRadius: '0 0 5px 5px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    alignItems: 'flex-start',
                    backgroundColor: 'secondary.main',
                    transform: 'translateX(-50%)',
                  }}
                  onMouseEnter={clearHideTimeout}
                  onMouseLeave={hideShopList}
                >
                  {pages.map((page) => (
                    <Button
                      component={RouterLink}
                      to={`products/${page.toLowerCase()}`}
                      key={page}
                      sx={{
                        width: '100%',
                        color: 'warning.main',
                        minWidth: 0,
                        textTransform: 'none',
                        '&:hover': { color: 'warning.dark' },
                        justifyContent: 'start',
                      }}
                    >
                      {page}
                    </Button>
                  ))}
                </Box>
              </Grow>
            )}
            <Button
              component={RouterLink}
              to='products/all?sort=newestArrival'
              variant='contained'
              disableElevation
              sx={{
                height: '100%',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'warning.main',
                },
                fontSize: 22,
                textTransform: 'none',
              }}
            >
              New Arrival
            </Button>
          </Box>

          {/* Hello message if user loged in */}
          {userInfo && isAuthenticated && (
            <Typography
              variant='body1'
              mr={2}
              sx={{ display: { xs: 'none', sm: 'inline-block' } }}
            >
              Hello, {userInfo.username}
            </Typography>
          )}

          {/* Search, profile, cart icons */}
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0, sm: 1 },
            }}
          >
            {/* User settings */}
            <Box
              sx={{
                flexGrow: 0,
                height: '100%',
                display: 'flex',
              }}
            >
              <Tooltip title={userInfo ? 'User settings' : 'Log in'}>
                <IconButton
                  onClick={(e) => setAnchorElUser(e.currentTarget)}
                  sx={{ p: 0 }}
                >
                  <PersonOutlineIcon
                    sx={{ color: 'background.default', fontSize: 36 }}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={() => {
                  setAnchorElUser(null);
                }}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: 'secondary.main',
                    borderRadius: '0 0 5px 5px',
                  },
                }}
              >
                {userInfo && isAuthenticated ? (
                  <Box>
                    {userInfo.role === 'admin' && (
                      <MenuItem
                        onClick={() => {
                          setAnchorElUser(null);
                        }}
                      >
                        <Typography
                          component={RouterLink}
                          to='/dashboard'
                          sx={{ color: 'warning.main', textDecoration: 'none' }}
                        >
                          Dashboard
                        </Typography>
                      </MenuItem>
                    )}
                    {userInfo.role === 'customer' && (
                      <>
                        <MenuItem
                          onClick={() => {
                            setAnchorElUser(null);
                          }}
                        >
                          <Typography
                            component={RouterLink}
                            to='/user/profile'
                            sx={{
                              color: 'warning.main',
                              textDecoration: 'none',
                            }}
                          >
                            My Profile
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setAnchorElUser(null);
                          }}
                        >
                          <Typography
                            component={RouterLink}
                            to='/user/orders'
                            sx={{
                              color: 'warning.main',
                              textDecoration: 'none',
                            }}
                          >
                            My Orders
                          </Typography>
                        </MenuItem>
                      </>
                    )}
                    <MenuItem
                      onClick={() => {
                        setAnchorElUser(null);
                      }}
                      sx={{ display: 'flex' }}
                    >
                      <Typography
                        component={RouterLink}
                        onClick={handleLogout}
                        to='/'
                        sx={{ color: 'warning.main', textDecoration: 'none' }}
                      >
                        Log out
                      </Typography>
                    </MenuItem>
                  </Box>
                ) : (
                  <Box>
                    <MenuItem
                      onClick={() => {
                        setAnchorElUser(null);
                        handleOpenLoginDialog();
                      }}
                    >
                      <Typography
                        sx={{ color: 'warning.main', textDecoration: 'none' }}
                      >
                        Sign in
                      </Typography>
                    </MenuItem>
                    <LoginUser
                      open={loginDialogOpen}
                      setOpen={setLoginDialogOpen}
                    />
                    <MenuItem
                      onClick={() => {
                        setAnchorElUser(null);
                      }}
                    >
                      <Typography
                        component={RouterLink}
                        to='/user/register'
                        sx={{ color: 'warning.main', textDecoration: 'none' }}
                      >
                        Create an account
                      </Typography>
                    </MenuItem>
                  </Box>
                )}
              </Menu>
            </Box>
            <IconButton
              onClick={handleOpenSearch}
              color='inherit'
              sx={{
                height: '100%',
                p: 0,
              }}
            >
              <SearchIcon sx={{ fontSize: 36 }} />
            </IconButton>
            {/* Shopping cart icon to navigate to shopping cart page */}
            <Tooltip title='Shopping cart'>
              <IconButton
                onClick={toggleCartDrawer}
                color='inherit'
                sx={{
                  height: '100%',
                  p: 0,
                }}
              >
                <Badge badgeContent={cart.length} color='info'>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <CartMenu open={cartOpen} onClose={closeCartDrawer} />
          </Box>
          {/* Search box */}
          {searchOpen && (
            <Box
              sx={{
                width: '100%',
                height: '80%',
                zIndex: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'absolute',
                backgroundColor: 'background.default',
                borderRadius: 2,
              }}
            >
              <FormControl fullWidth variant='standard'>
                <Input
                  placeholder='Search...'
                  autoFocus
                  disableUnderline
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setSearchOpen(false)}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  startAdornment={<SearchIcon />}
                  sx={{
                    height: '100%',
                    pl: 2,
                  }}
                />
              </FormControl>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
