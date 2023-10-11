import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import HeroImage from '../../assets/image/hero.jpg';

const Hero = () => {
  return (
    <Container maxWidth='xl'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: { lg: 660 },
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '75%', md: '50%' },
            mt: { xs: 6, lg: 12 },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { lg: 'flex-start' },
          }}
        >
          <Box>
            <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
              Adorn Yourself with Elegance
            </Typography>
          </Box>
          <Box mt={4}>
            <Typography variant='body1' mt={3}>
              Discover handcrafted jewelry, uniquely designed to celebrate your
              individuality. Find your shine today!
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to='/products/all'
            variant='contained'
            sx={{
              width: { xs: '80%', sm: '50%', lg: '35%' },
              height: 52,
              borderRadius: 10,
              mt: 4,
              ml: { xs: '50%', md: '0%' },
              transform: { xs: 'translateX(-50%)', md: 'none' },
            }}
          >
            Shop Now
          </Button>
        </Box>

        <Box
          sx={{
            backgroundImage: `url(${HeroImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: { xs: 'center' },
            backgroundSize: { xs: '100%', sm: 'contain' },
            height: { xs: 400, sm: 500, lg: 660 },
            width: { xs: '100%', md: '50%' },
            zIndex: -1,
          }}
        ></Box>
      </Box>
    </Container>
  );
};

export default Hero;
