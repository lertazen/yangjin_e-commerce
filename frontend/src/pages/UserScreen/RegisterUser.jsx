import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  OutlinedInput,
  InputLabel,
  TextField,
  FormHelperText,
  Paper,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import backgroundImg from '../../assets/image/register_bg.jpg';
import { setCredentials } from '../../utils/userHelper.js';

const RegisterUser = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const user = { userName, userEmail, userPassword };
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (userPassword !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [userPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userPassword !== confirmPassword) {
      setPasswordMatch(false);
      return;
    } else {
      try {
        const res = await fetch('/api/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        if (res.ok) {
          const data = await res.json();
          console.log('User registered: ', data);
          setCredentials(data);
          navigate('/');
        } else {
          const errorMessage = await res.text();
          console.error('Error registering user: ', errorMessage);
        }
      } catch (error) {
        console.log('Error sending the request', error);
      }
    }
  };

  return (
    <Container maxWidth='xl'>
      <Box
        sx={{
          minWidth: '50%',
          mx: 'auto',
          mt: 10,
          border: '1px solid',
          display: 'flex',
          borderRadius: 5,
          height: '80vh',
          overflow: 'hidden',
        }}
      >
        <Paper
          sx={{
            width: '45%',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
            display: { xs: 'none', md: 'inline-block' },
            backgroundImage: `url(${backgroundImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          alt='tibetan beads'
        />
        <Box
          sx={{
            flex: '1 0 auto',
            width: { xs: '100%', md: '55%' },
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant='h2' align='center' sx={{ fontWeight: 500 }}>
            Register
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              pt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TextField
              required
              id='user name'
              label='User Name'
              type='text'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={{ my: 1, width: { xs: '90%', md: '75%' } }}
            />
            <TextField
              required
              id='email'
              label='Email Address'
              type='email'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              sx={{ my: 1, width: { xs: '90%', md: '75%' } }}
            />
            <FormControl
              sx={{ my: 1, width: { xs: '90%', md: '75%' } }}
              required
              variant='outlined'
            >
              <InputLabel htmlFor='new password'>New Password</InputLabel>
              <OutlinedInput
                id='new password'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label='New Password'
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{
                my: 1,
                width: { xs: '90%', md: '75%' },
                position: 'relative',
              }}
              required
              variant='outlined'
              error={!passwordMatch}
            >
              <InputLabel htmlFor='confirm password'>
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id='confirm password'
                type={showPassword ? 'text' : 'password'}
                error={!passwordMatch}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FormHelperText
                sx={{
                  display: passwordMatch ? 'none' : 'block',
                  position: 'absolute',
                  top: '100%',
                }}
              >
                Incorrect password
              </FormHelperText>
            </FormControl>
            <Button
              type='submit'
              variant='contained'
              sx={{
                borderRadius: 8,
                p: 2,
                width: { xs: '90%', md: '50%' },
                mt: 5,
              }}
            >
              Create Account
            </Button>
            <Link component={RouterLink} sx={{ my: 2 }} to='/'>
              Cancel
            </Link>
            <Typography variant='subtitle1'>
              Already have an account? /
              <Link component={RouterLink} to='/user/signin'>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterUser;
