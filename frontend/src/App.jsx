import { ThemeProvider } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import theme from './styles/theme.js';
import { ShoppingCartProvider } from '../src/contexts/ShoppingCartContext.jsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ShoppingCartProvider>
        <Outlet />
      </ShoppingCartProvider>
    </ThemeProvider>
  );
}

export default App;
