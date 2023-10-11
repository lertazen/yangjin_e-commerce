import {
  Container,
  Typography,
  Box,
  Divider,
  Rating,
  TextField,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from '../../services/products-services';
import { submitNewReview } from '../../services/review-services';

const CreateReview = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const review = { rating, title, content };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const newReview = await submitNewReview(review, productId);
      if (newReview) {
        navigate(`/review-success?id=${newReview._id}`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await fetchProductById(productId);
        if (fetchedProduct) {
          console.log(fetchedProduct);
          setProduct(fetchedProduct);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, []);

  return (
    <Container maxWidth='lg'>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{
          minHeight: '50vh',
          mt: 5,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant='h5'>Create Review</Typography>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            my: 4,
          }}
        >
          <Box
            sx={{
              mr: 1,
              backgroundImage: `url(${product?.images[0]})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100px',
              height: '100px',
              flexShrink: 0,
            }}
          />
          <Typography variant='body1'>{product?.productName}</Typography>
        </Box>
        <Divider sx={{ width: '100%' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            my: 4,
          }}
        >
          <Typography variant='h6'>Rating</Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => {
              setRating(newValue);
            }}
          />
        </Box>
        <Divider sx={{ width: '100%' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            my: 4,
          }}
        >
          <Typography variant='h6'>Add a title</Typography>
          <TextField
            required
            id='title'
            placeholder="What's Your Take on This Product?"
            multiline
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ my: 1, width: { xs: '100%', md: '50%' } }}
          />
        </Box>
        <Divider sx={{ width: '100%' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            my: 4,
          }}
        >
          <Typography variant='h6'>Add a review</Typography>
          <TextField
            required
            id='content'
            placeholder='Share your thoughts about the product...'
            type='text'
            value={content}
            multiline
            rows={2}
            onChange={(e) => setContent(e.target.value)}
            sx={{ my: 1, width: '100%' }}
          />
        </Box>
        <Divider sx={{ width: '100%' }} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            my: 4,
          }}
        >
          <Button variant='contained' disabled={isLoading} type='submit'>
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateReview;
