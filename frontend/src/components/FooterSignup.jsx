import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
import AlertSnackbar from '../components/AlertSnackbar';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import styled from '@emotion/styled';
import { grey } from '@mui/material/colors';
import { createNewSubscriber } from '../services/subscriber-services';

const SubButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[200]),
  backgroundColor: grey[200],
  '&:hover': {
    backgroundColor: grey[400],
  },
}));

const FooterSignup = () => {
  const [inputEmail, setInputEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');

  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await createNewSubscriber(inputEmail);
      if (data) {
        if (data.status === 'exists') {
          setAlertSeverity('warning');
        } else if (data.status === 'success') {
          setAlertSeverity('success');
        }
        setAlertMessage(`${data.message}`);
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertSeverity('error');
      setAlertMessage(`${err?.data?.message || err.error}`);
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth='100%' disableGutters>
      <AlertSnackbar
        snackbarOpen={snackbarOpen}
        alertMessage={alertMessage}
        handleCloseSnackbar={handleCloseSnackbar}
        severity={alertSeverity}
      />
      <Box
        sx={{
          width: '100%',
          height: { xs: 850, md: 500 },
          mt: 20,
          backgroundColor: 'lightgrey',
          position: 'relative',
        }}
      >
        {/* Sign up box section */}
        <Box
          sx={{
            backgroundColor: 'black',
            borderRadius: 7,
            width: { xs: '95%', lg: '90%' },
            maxWidth: 'xl',
            height: { xs: '28%', md: '35%' },
            mx: 'auto',
            py: { xs: 2, md: 3 },
            translate: '-50% -50%',
            position: 'absolute',
            left: '50%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'space-evenly', md: 'space-between' },
            alignItems: { xs: 'center', md: 'center' },
          }}
        >
          <Box
            sx={{
              ml: { md: 10 },
              width: { xs: '90%', sm: '70%', md: '35%' },
            }}
          >
            <Typography
              variant='h4'
              sx={{
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Get the Latest Delivered to Your Inbox.
            </Typography>
          </Box>
          <Box
            component='form'
            onSubmit={handleSubmit}
            mr={{ md: 10 }}
            width={{ xs: '90%', sm: '70%', md: '35%' }}
          >
            <FormControl
              variant='outlined'
              fullWidth
              sx={{
                backgroundColor: 'white',
                height: { xs: 42, lg: 48 },
                borderRadius: 6,
              }}
            >
              <Input
                sx={{
                  my: 'auto',
                  ml: 2,
                }}
                placeholder='Enter your email address'
                disableUnderline
                type='email'
                startAdornment={
                  <InputAdornment position='start'>
                    <MailOutlineIcon />
                  </InputAdornment>
                }
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
              />
            </FormControl>
            <SubButton
              variant='contained'
              color='background'
              disabled={isSubmitting}
              sx={{
                mt: { xs: 1.5, md: 2.5 },
                borderRadius: 6,
                width: '100%',
                height: { xs: 42, lg: 48 },
              }}
              type='submit'
            >
              Subscribe Now
            </SubButton>
          </Box>
        </Box>

        {/* Footer section */}
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            width: { xs: '95%', lg: '90%' },
            maxWidth: 'xl',
            position: 'absolute',
            mt: 3,
            left: '50%',
            translate: { xs: '-50% 50%', sm: '-50% 55%', md: '-50% 50%' },
          }}
        >
          {/* Brand info */}
          <Grid
            item
            xs={4}
            sm={5}
            md={4}
            sx={{
              pr: { sm: 3 },
            }}
          >
            <Typography
              variant='h4'
              sx={{
                fontWeight: 'bold',
              }}
            >
              YANGJIN
            </Typography>
            <Typography variant='caption'>
              Crafting elegant and timeless pieces for every occasion, our
              collection embodies the art of fine jewelry. Let us be part of
              your journey to find the perfect gem that tells your story.
            </Typography>

            <Box mt={{ xs: 1, md: 4 }}>
              <IconButton>
                <TwitterIcon />
              </IconButton>
              <IconButton>
                <FacebookIcon />
              </IconButton>
              <IconButton>
                <InstagramIcon />
              </IconButton>
              <IconButton>
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
          {/* Footer grids containing important links and information */}
          <Grid
            item
            xs={2}
            sm={3}
            md={2}
            sx={{
              pr: { sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 'regular',
              }}
            >
              Quick Links
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sm={3}
            md={2}
            sx={{
              pr: { sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 'regular',
              }}
            >
              Customer Service
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sm={3}
            md={2}
            sx={{
              pr: { sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 'regular',
              }}
            >
              Legal & Policies
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sm={2}
            md={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 'regular',
              }}
            >
              Contact
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FooterSignup;
