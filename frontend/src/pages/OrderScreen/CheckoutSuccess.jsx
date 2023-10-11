import StripeWrapper from '../../components/StripeWrapper';
import CheckoutComplete from '../../components/CheckoutComplete';

const CheckoutSuccess = () => {
  return (
    <StripeWrapper>
      <CheckoutComplete />
    </StripeWrapper>
  );
};

export default CheckoutSuccess;
