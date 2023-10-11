import Navbar from '../components/Navbar.jsx';
import FooterSignup from '../components/FooterSignup.jsx';
import { Outlet } from 'react-router-dom';
import { ShoppingCartProvider } from '../contexts/ShoppingCartContext.jsx';

const DefaultLayout = () => {
  return (
    <>
      {/* <ShoppingCartProvider> */}
      <Navbar />
      <Outlet />
      {/* </ShoppingCartProvider> */}
      <FooterSignup />
    </>
  );
};

export default DefaultLayout;
