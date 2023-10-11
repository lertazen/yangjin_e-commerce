import { Box, Container, Typography } from '@mui/material';
import CryingIcon from '../assets/icon/cry-icon.png';

const NotFound = () => {
  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 10,
        }}
      >
        <Box
          sx={{
            pb: '20%',
            width: '20%',
            backgroundImage: `url(${CryingIcon})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'center',
          }}
        />
        <Typography variant='h4'>Page Not Found</Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
