import { createContext, useState } from 'react';

export const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const [shippingInfo, setShippingInfo] = useState({});

  return (
    <CheckoutContext.Provider value={{ shippingInfo, setShippingInfo }}>
      {children}
    </CheckoutContext.Provider>
  );
};
