import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#8b4513',
    },
    secondary: {
      main: '#800000',
    },
    background: {
      default: '#eeeeee',
      sidebar: '#1F2421',
      active: '#B9314F',
      checkoutL: '#DEDBD2',
      checkoutR: '#B0C4B1',
    },
    info: {
      main: '#40e0d0',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
      disabled: '#444444',
      sidebar: '#eeeeee',
    },
    warning: {
      main: '#ffd700',
    },
    error: {
      main: '#dc143c',
    },
    success: {
      main: '#006400',
    },
    divider: '#808080',
  },
});

theme = responsiveFontSizes(theme);

export default theme;
