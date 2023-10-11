import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  IconButton,
  Rating,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchTestimonials } from '../../services/review-services';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  const theme = useTheme();
  const belowSm = useMediaQuery(theme.breakpoints.down('sm'));
  const onlySm = useMediaQuery(theme.breakpoints.only('sm'));
  const aboveSm = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (boxRef.current) {
      setWidth(boxRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (boxRef.current) {
        setWidth(boxRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex;
      if (aboveSm) {
        newIndex = prevIndex + 3;
      } else if (belowSm) {
        newIndex = prevIndex + 1;
      } else if (onlySm) {
        newIndex = prevIndex + 2;
      }

      setIsFirst(newIndex === 0);

      return newIndex;
    });
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex;
      if (aboveSm) {
        newIndex = Math.max(prevIndex - 3, 0);
      } else if (belowSm) {
        newIndex = Math.max(prevIndex - 1, 0);
      } else if (onlySm) {
        newIndex = Math.max(prevIndex - 2, 0);
      }

      setIsFirst(newIndex === 0);

      return newIndex;
    });
  };

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const fetchedReviews = await fetchTestimonials();

        setReviews(fetchedReviews);
        if (aboveSm) {
          setIsLast(currentIndex > fetchedReviews.length - 3);
        } else if (belowSm) {
          setIsLast(currentIndex === 11);
        } else if (onlySm) {
          setIsLast(currentIndex === 12 - 2);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      if (aboveSm) {
        setIsLast(currentIndex >= reviews.length - 3);
      } else if (belowSm) {
        setIsLast(currentIndex >= reviews.length - 1);
      } else if (onlySm) {
        setIsLast(currentIndex >= reviews.length - 2);
      }
    }
  }, [currentIndex]);

  return (
    <Container maxWidth='xl'>
      <Box
        pt={3}
        px={1}
        display={'flex'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Typography variant='h4'>Our happy customers</Typography>
        <Box display={'flex'} alignItems={'flex-end'}>
          <IconButton aria-label='prev' onClick={goToPrev} disabled={isFirst}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            aria-label='next'
            onClick={goToNext}
            disabled={isLast || isLoading}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        ref={boxRef}
        sx={{
          display: 'flex',
          width: '100%',
          py: 1,
          overflow: 'hidden',
          mt: 3,
        }}
      >
        {reviews.map((review, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexShrink: 0,
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.33%',
              },
              transform: `translateX(${
                -currentIndex *
                (belowSm ? width : onlySm ? width / 2 : width / 3)
              }px)`,
              transition: 'transform 0.5s',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                borderRadius: 3,
                p: 2,
                mx: { xs: 1, md: 1.5 },
                width: '100%',
                height: '100%',
                border: '1px solid black',
                borderColor: 'divider',
              }}
            >
              <Rating readOnly value={review.rating} />
              <Typography variant='subtitle1' color={theme.palette.text}>
                {review?.username}
              </Typography>
              <Typography
                variant='body2'
                lineHeight={1.3}
                sx={{ color: theme.palette.text.disabled }}
              >
                {review?.content}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Testimonials;
