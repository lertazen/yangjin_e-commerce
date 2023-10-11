// create payment intent
const initPaymentIntent = async (cart, shippingInfo) => {
  try {
    const response = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: cart, shippingInfo: shippingInfo }),
    });

    if (!response.ok) {
      console.log(response.status);
      throw new Error('Something went wrong');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export { initPaymentIntent };
