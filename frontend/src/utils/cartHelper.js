import {
  fetchUserCart,
  updateItemQuantityInCart,
  fetchCartProducts,
  deleteItemInCart,
} from '../services/cart-services';
import { checkAuthStatus } from '../services/user-services';

// productsInfo: an array of objects -> {productId, quantity}
const fetchCartData = async () => {
  try {
    const fetchedCart = await fetchUserCart();
    if (fetchedCart) {
      const productsInfo = fetchedCart.products; // [{productId, quantity}, ...]
      // fetch products data
      const products = await fetchCartProducts(productsInfo);

      const serverCart = productsInfo.map((prod) => {
        const cartProduct = products.find((p) => p._id === prod.productId);
        return {
          cartProduct: cartProduct,
          cartQuantity: prod.quantity,
        };
      });

      return serverCart;
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

const mergeCarts = (localCart, fetchedCart) => {
  if (localCart) {
    let mergedCart = [];

    localCart.forEach((localProduct) => {
      let found = false;
      for (let i = 0; i < fetchedCart.length && !found; i++) {
        if (fetchedCart[i].cartProduct._id === localProduct.cartProduct._id) {
          mergedCart.push({
            cartProduct: localProduct.cartProduct,
            cartQuantity:
              localProduct.cartQuantity + fetchedCart[i].cartQuantity,
          });
          fetchedCart.splice(i, 1);
          found = true;
        }
      }
      if (!found) {
        mergedCart.push(localProduct);
      }
    });
    return (mergedCart = [...mergedCart, ...fetchedCart]);
  } else {
    return fetchedCart;
  }
};

// Save cart in the local storage
const saveCartToLocal = async (cartData) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartData));
  } catch (e) {
    console.error('Could not save cart', e);
  }
};

// Load cart from the local storage
const loadCartFromLocal = () => {
  try {
    const cart = localStorage.getItem('cart');
    if (cart === null) {
      return undefined;
    }
    return JSON.parse(cart);
  } catch (e) {
    console.error('Could not load cart', e);
    return undefined;
  }
};

const handleUpdateQuantity = async (cart, setCart, index, changeAmount) => {
  try {
    const isAuthorized = await checkAuthStatus();
    if (isAuthorized) {
      const newProductsInfo = await updateItemQuantityInCart([
        {
          productId: cart[index].cartProduct._id,
          quantity: cart[index].cartQuantity + changeAmount,
        },
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
        }
      }
    } else {
      setCart((prevCart) => {
        const newCart = [...prevCart];
        const itemToUpdate = { ...newCart[index] };
        itemToUpdate.cartQuantity += changeAmount;
        newCart[index] = itemToUpdate;

        return newCart;
      });
    }
  } catch (err) {
    throw new Error(err);
  }
};

const handleDeleteItemInCart = async (cart, setCart, index) => {
  try {
    const isAuthorized = await checkAuthStatus();
    if (isAuthorized) {
      const newProductsInfo = await deleteItemInCart([
        {
          productId: cart[index].cartProduct._id,
        },
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
        }
      }
    } else {
      setCart((prevCart) =>
        prevCart.filter(
          (prod) => prod.cartProduct._id !== prevCart[index].cartProduct._id
        )
      );
    }
  } catch (err) {
    throw err;
  }
};

export {
  fetchCartData,
  saveCartToLocal,
  loadCartFromLocal,
  handleUpdateQuantity,
  handleDeleteItemInCart,
};
