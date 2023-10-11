import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const ProductsManagement = () => {
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
      <Typography variant='h5'>Product management</Typography>
    </Box>
  );
};

export default ProductsManagement;
