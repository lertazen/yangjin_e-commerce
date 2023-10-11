import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchReviewStatus } from '../../services/review-services';

const ReviewSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get('id');
  const navigate = useNavigate();

  console.log(reviewId);
  useEffect(() => {
    const checkReviewStatus = async () => {
      try {
        setIsLoading(true);
        if (!reviewId) {
          navigate('/not-found');
        } else {
          const reviewExists = await fetchReviewStatus();
          if (reviewExists) {
            setIsLoading(false);
          } else {
            navigate('/not-found');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkReviewStatus();
  }, []);

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          mt: 20,
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <ThumbUpAltOutlinedIcon
              sx={{ color: 'success.main', fontSize: 100 }}
            />
            <Typography variant='h4'>Thank you for your feedback!</Typography>
            <Button
              component={RouterLink}
              to='/products/all'
              variant='text'
              sx={{ mt: 5 }}
            >
              Go back to shopping
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ReviewSuccess;
