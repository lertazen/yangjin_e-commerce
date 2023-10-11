import { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { ShoppingCartContext } from '../contexts/ShoppingCartContext';
import { getUserInfo } from '../utils/userHelper';
import { addItemToCart, fetchCartProducts } from '../services/cart-services';
import { saveCartToLocal } from '../utils/cartHelper';

const AddToCartButton = ({
  product,
  quantity,
  setAlertMessage,
  setAlertSeverity,
  setSnackbarOpen,
  sx,
}) => {
  const { cart, setCart } = useContext(ShoppingCartContext);
  const userInfo = getUserInfo();
  const [isLoading, setIsLoading] = useState(false);

  const addToLocalCart = () => {
    const foundProduct = cart.find((p) => p.cartProduct._id === product._id);
    if (foundProduct) {
      setCart((prevCart) =>
        prevCart.map((obj) => {
          if (obj.cartProduct._id === product._id) {
            return {
              cartProduct: obj.cartProduct,
              cartQuantity: obj.cartQuantity + quantity,
            };
          } else {
            return obj;
          }
        })
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        { cartProduct: product, cartQuantity: quantity },
      ]);
    }
    saveCartToLocal(cart);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      if (!userInfo) {
        addToLocalCart();
      } else {
        const newProductsInfo = await addItemToCart([
          { productId: product._id, quantity: quantity },
        ]);
        if (newProductsInfo) {
          const newCartProducts = await fetchCartProducts(newProductsInfo);
          if (newCartProducts) {
            setCart(
              newProductsInfo.map((productInfo) => {
                const newProduct = newCartProducts.find(
                  (p) => p._id === productInfo.productId
                );
                return {
                  cartProduct: newProduct,
                  cartQuantity: productInfo.quantity,
                };
              })
            );
            setAlertMessage(`${product.productName} added successfully`);
            setAlertSeverity('success');
            setSnackbarOpen(true);
          }
        }
      }
    } catch (err) {
      setAlertSeverity('error');
      setAlertMessage(`Failed adding ${product.productName} to the cart`);
      setSnackbarOpen(true);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant='contained'
      onClick={handleAddToCart}
      disabled={isLoading}
      sx={sx}
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
