import {
  Container,
  Typography,
  Box,
  Rating,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchProductReviews } from '../../services/review-services';

const ProductReviews = ({ product }) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  const [reviews, setReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const fetchedReviews = await fetchProductReviews(product._id);
        if (fetchedReviews) {
          setReviews(fetchedReviews);
        } else {
          setReviews(null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <Container maxWidth='xl'>
      <Box sx={{ width: '100%' }}>
        {!isLoading && reviews ? (
          reviews.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              {reviews.map((review) => {
                return (
                  <Box
                    key={review._id}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      my: 3,
                    }}
                  >
                    <Typography variant='body1'>{review.username}</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <Rating value={review.rating} readOnly />
                      <Typography variant='body1'>{review.title}</Typography>
                    </Box>
                    <Typography variant='body1' sx={{ color: 'text.disabled' }}>
                      {new Date(review.createdAt).toLocaleDateString(
                        'en-US',
                        options
                      )}
                    </Typography>
                    <Typography variant='body1'>{review.content}</Typography>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography variant='subtitle1'>{reviews.message}</Typography>
          )
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  );
};

export default ProductReviews;
