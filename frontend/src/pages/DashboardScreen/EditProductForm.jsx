import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  styled,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createProduct,
  fetchProductById,
  updateProductById,
} from '../../services/dashboard-services.js';
import AlertSnackbar from '../../components/AlertSnackbar.jsx';

const EditProductForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [tags, setTages] = useState([]);
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedImageURLs, setSelectedImageURLs] = useState([]);
  const [fetchedImageURLs, setFetchedImageURLs] = useState([]);

  const handleFeaturedChange = (e) => {
    setFeatured(e.target.checked);
  };

  let allImageUrls = [...fetchedImageURLs, ...selectedImageURLs];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const product = {
    productName,
    description,
    material,
    color,
    size,
    tags,
    price,
    stockQuantity,
    category,
    featured,
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeveriry, setAlertSeverity] = useState('');

  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handlePriceChange = (e) => {
    const newValue = e.target.value;
    const hasOneOrLessDecimalPoints = (newValue.match(/\./g) || []).length <= 1;
    const validFormat =
      newValue === '' ||
      newValue === '.' ||
      /^(\d+(\.\d{0,2})?|\.\d{0,2})$/.test(newValue);

    if (hasOneOrLessDecimalPoints && validFormat) {
      setPrice(newValue);
    }
  };

  const handleQtyChange = (e) => {
    const newQty = parseInt(e.target.value, 10) || '';
    setStockQuantity(newQty);
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    // Filter out files already in the state based on name
    const newFiles = files.filter((file) => {
      return !imageFiles.some((imageFile) => imageFile.name === file.name);
    });
    // If no new files, just return
    if (!newFiles.length) return;

    const newImageURLs = [];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageURLs.push(reader.result);

        if (newImageURLs.length === newFiles.length) {
          setSelectedImageURLs((prevURLs) => [...prevURLs, ...newImageURLs]);
          setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeselectImage = (indexToRemove) => {
    // Filter out the image URL, file based on the index
    setFetchedImageURLs((prevURLs) =>
      prevURLs.filter((_, index) => index !== indexToRemove)
    );
    setSelectedImageURLs((prevURLs) =>
      prevURLs.filter(
        (_, index) => index !== indexToRemove - fetchedImageURLs.length
      )
    );
    setImageFiles((prevFiles) =>
      prevFiles.filter(
        (_, index) => index !== indexToRemove - fetchedImageURLs.length
      )
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    imageFiles.map((file) => {
      formData.append('images', file);
    });
    for (let prop in product) {
      formData.append(`${prop}`, product[prop]);
    }
    try {
      const newProduct = await createProduct(formData);

      setAlertSeverity('success');
      setAlertMessage(`Product ${newProduct.productName} Created!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    imageFiles.map((file) => {
      formData.append('newImages', file);
    });
    for (let prop in product) {
      formData.append(`${prop}`, product[prop]);
    }
    if (fetchedImageURLs.length) {
      formData.append('existingImageURLs', JSON.stringify(fetchedImageURLs));
    }
    console.log(formData);
    try {
      const updatedProduct = await updateProductById(productId, formData);
      console.log(updatedProduct);
      setAlertSeverity('success');
      setAlertMessage(`Product ${updatedProduct.productName} updated!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProductData = async () => {
    try {
      const fetchedProduct = await fetchProductById(productId);
      if (fetchedProduct) {
        setProductName(fetchedProduct.productName);
        setDescription(fetchedProduct.description);
        setMaterial(fetchedProduct.material);
        setColor(fetchedProduct.color);
        setSize(fetchedProduct.size);
        setPrice(fetchedProduct.price);
        setStockQuantity(fetchedProduct.stockQuantity);
        setCategory(fetchedProduct.category);
        setFetchedImageURLs(fetchedProduct.images || []);
        setFeatured(fetchedProduct.featured);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, []);

  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  return (
    <Box sx={{ p: 3, mx: 'auto' }}>
      <Box
        component='form'
        onSubmit={productId ? handleUpdate : handleCreate}
        sx={{
          p: 3,
          border: '1px solid black',
          borderRadius: 5,
          width: '50%',
          mx: 'auto',
        }}
      >
        <Typography variant='h6'>Product Name</Typography>
        <TextField
          required
          variant='outlined'
          placeholder='Enter product name'
          sx={{ width: '100%' }}
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
          }}
        />
        <Typography variant='h6'>Description</Typography>
        <TextField
          required
          variant='outlined'
          placeholder='Enter product description'
          multiline
          rows={2}
          sx={{ width: '100%' }}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '45%' }}>
            <Typography variant='h6'>Material</Typography>
            <TextField
              required
              variant='outlined'
              placeholder='Enter product material'
              sx={{ width: '100%' }}
              value={material}
              onChange={(e) => {
                setMaterial(e.target.value);
              }}
            />
          </Box>
          <Box sx={{ width: '45%' }}>
            <Typography variant='h6'>Color</Typography>
            <TextField
              required
              variant='outlined'
              placeholder='Enter product color'
              sx={{ width: '100%' }}
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '45%' }}>
            <Typography variant='h6'>Size</Typography>
            <TextField
              required
              variant='outlined'
              placeholder='Enter product size'
              sx={{ width: '100%' }}
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
              }}
            />
          </Box>
          <Box sx={{ width: '45%' }}>
            <Typography variant='h6'>Tags</Typography>
            <TextField
              variant='outlined'
              placeholder='Enter product Tags'
              sx={{ width: '100%' }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '20%' }}>
            <Typography variant='h6'>Price</Typography>
            <FormControl fullWidth required>
              <OutlinedInput
                placeholder='Enter price'
                startAdornment={
                  <InputAdornment position='start'>$</InputAdornment>
                }
                value={price === 0 ? '' : price}
                onChange={handlePriceChange}
                inputProps={{
                  inputMode: 'decimal',
                }}
              />
            </FormControl>
          </Box>
          <Box sx={{ width: '20%' }}>
            <Typography variant='h6'>Stock Quantity</Typography>
            <TextField
              required
              variant='outlined'
              placeholder='Enter quantity'
              sx={{ width: '100%' }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={stockQuantity === 0 ? '' : stockQuantity}
              onChange={handleQtyChange}
            />
          </Box>
          <Box sx={{ width: '40%' }}>
            <Typography variant='h6'>Category</Typography>
            <TextField
              required
              variant='outlined'
              placeholder='Enter category'
              sx={{ width: '100%' }}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6'>Featured</Typography>
          <Checkbox checked={featured} onChange={handleFeaturedChange} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h6'>Product Images</Typography>
          <Button
            component='label'
            variant='outlined'
            sx={{
              width: '20%',
              textTransform: 'none',
              mb: 2,
            }}
          >
            <AddIcon sx={{ mr: 2 }} />
            Add an image
            <VisuallyHiddenInput
              type='file'
              multiple
              onChange={handleImageChange}
            />
          </Button>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {allImageUrls.map((url, index) => (
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                key={index}
                sx={{
                  position: 'relative',
                }}
              >
                <Paper
                  key={index}
                  elevation={4}
                  alt={`Selected Thumbnail ${index}`}
                  sx={{
                    width: '100%',
                    pb: '100%',
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <IconButton
                  onClick={() => handleDeselectImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 25,
                    right: 0,
                  }}
                >
                  <DeleteIcon color='error' />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            width: '100%',
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {productId ? (
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
              sx={{ position: 'relative' }}
            >
              <CircularProgress
                sx={{
                  display: isSubmitting ? 'inline' : 'none',
                  position: 'absolute',
                }}
              />
              Update
            </Button>
          ) : (
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
              sx={{ position: 'relative' }}
            >
              <CircularProgress
                sx={{
                  display: isSubmitting ? 'inline' : 'none',
                  position: 'absolute',
                }}
              />
              Submit
            </Button>
          )}
        </Box>
        <AlertSnackbar
          snackbarOpen={snackbarOpen}
          handleCloseSnackbar={handleCloseSnackbar}
          alertMessage={alertMessage}
          severity={alertSeveriry}
        />
      </Box>
    </Box>
  );
};

export default EditProductForm;
