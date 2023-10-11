import { useEffect, useState } from 'react';
import {
  Box,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import TablePaginationActions from '../../components/dashboard/TablePaginationActions.jsx';
import { fetchProducts } from '../../services/dashboard-services.js';

const DashboardMain = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const emptyRows =
    currentPage > 0
      ? Math.max(0, (1 + currentPage) * rowsPerPage - totalAmount)
      : 0;

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      try {
        setIsLoading(true);
        const { products, totalAmount } = await fetchProducts(
          currentPage + 1,
          rowsPerPage
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
  }, [currentPage]);
  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
      }}
    >
      <Box
        sx={{
          p: 2,
          border: '1px solid red',
        }}
      >
        <Typography variant='h4'>List of Products</Typography>
        <TableContainer component={Paper} sx={{}}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Product Name</TableCell>
                <TableCell align='right'>Category</TableCell>
                <TableCell align='right'>Price</TableCell>
                <TableCell align='right'>Stock Qty</TableCell>
                <TableCell align='right'>Material</TableCell>
                <TableCell align='right'>Color</TableCell>
                <TableCell align='right'>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  {products.map((product) => (
                    <TableRow
                      key={product.productName}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component='th' scope='row'>
                        {product.productName || ''}
                      </TableCell>
                      <TableCell align='right'>
                        {product.category || ''}
                      </TableCell>
                      <TableCell align='right'>
                        ${product.price || ''}
                      </TableCell>
                      <TableCell align='right'>
                        {product.stockQuantity}
                      </TableCell>
                      <TableCell align='right'>
                        {product.material || ''}
                      </TableCell>
                      <TableCell align='right'>{product.color || ''}</TableCell>
                      <TableCell align='right'>
                        {product.averageRating}
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow sx={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={4}
                  count={totalAmount}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DashboardMain;
