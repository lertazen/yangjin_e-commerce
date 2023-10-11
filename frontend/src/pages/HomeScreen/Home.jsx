import FeaturedProducts from './FeaturedProducts';
import Hero from './Hero';
import Testimonials from './Testimonials';
import { Container } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth='xl' disableGutters>
      <Hero />
      <FeaturedProducts />
      <Testimonials />
    </Container>
  );
};

export default Home;
