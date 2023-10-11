import {
  Box,
  Button,
  Grid,
  Pagination,
  Paper,
  Skeleton,
  Typography,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../services/dashboard-services';
import DeleteDialog from '../../components/dashboard/DeleteDialog';

const DashboardProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalAmount / itemsPerPage);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDeleted, setProductDeleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleProductDeleted = () => {
    setProductDeleted(true);
    setSnackbarOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setSelectedProduct(product);
    navigate(`/dashboard/edit-product?productId=${product._id}`);
  };

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      try {
        setIsLoading(true);
        const { products, totalAmount } = await fetchProducts(
          currentPage,
          itemsPerPage
        );
        setProducts(products);
        setTotalAmount(totalAmount);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    fetchAndSetProducts();
    setProductDeleted(false);
  }, [currentPage, productDeleted]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        px: 30,
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {products.map((product, index) => (
          <Grid item xs={2} sm={2} md={2.4} key={product._id}>
            {isLoading ? (
              <Skeleton variant='rectangular' sx={{ pb: '100%' }} />
            ) : (
              <Paper elevation={5} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box
                  sx={{
                    backgroundImage: `url(${product.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    pb: '100%',
                  }}
                />
                <Typography variant='body1' ml={2}>
                  {product.productName}
                </Typography>
                <Typography variant='body1' ml={2}>
                  ${product.price}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                    my: 2,
                  }}
                >
                  <Button
                    variant='contained'
                    onClick={() => handleOpenEditForm(product)}
                    sx={{ width: '40%' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => handleOpenDialog(product)}
                    sx={{ backgroundColor: 'secondary.main', width: '40%' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>
        ))}
        <DeleteDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onProductDeleted={handleProductDeleted}
          productName={selectedProduct ? selectedProduct.productName : ''}
          productId={selectedProduct ? selectedProduct._id : ''}
        />
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ alignSelf: 'center' }}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          sx={{ width: '100%' }}
        >
          Product {selectedProduct?.productName} deleted!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardProductsGrid;
