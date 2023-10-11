import { fetchCartProducts, fetchUserCart } from '../services/cart-services';

const calculateSubtotal = async () => {
  try {
    const fetchedCart = await fetchUserCart();
    const fetchedCartProducts = await fetchCartProducts(fetchedCart.products);

    const subtotal = fetchedCart.products.reduce((total, product) => {
      const fetchedProduct = fetchedCartProducts.find((p) => {
        return p._id === product.productId;
      });
      return total + fetchedProduct.price * product.quantity;
    }, 0);
    return Math.round(subtotal * 100) / 100;
  } catch (err) {
    console.log(err);
  }
};

export { calculateSubtotal };
