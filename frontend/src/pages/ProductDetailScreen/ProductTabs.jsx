import {
  Tabs,
  Tab,
  Box,
  Typography,
  styled,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { useState } from 'react';
import ProductReviews from './ProductReviews';

const ProductTabs = ({ product }) => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant='fullWidth'
        sx={{ borderBottom: '1px solid lightgrey' }}
      >
        <Tab label='Product Details'></Tab>
        <Tab label='Reviews'></Tab>
        <Tab label='FAQs'></Tab>
      </Tabs>
      <Box hidden={tabValue !== 0} sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
        <TableContainer
          sx={{ width: { xs: '100%', md: '50%' }, pr: { md: 3 } }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Product Name
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography variant='subtitle1'>
                    {product.productName}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Category
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography variant='subtitle1'>
                    {product.category}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Material
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography variant='subtitle1'>
                    {product.material}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Size
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography variant='subtitle1'>{product.size}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Color
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography variant='subtitle1'>{product.color}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box hidden={tabValue !== 1} sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
        <ProductReviews product={product} />
      </Box>
      <Box hidden={tabValue !== 2} sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
        <Typography>This is product FAQs</Typography>
      </Box>
    </Box>
  );
};

export default ProductTabs;
