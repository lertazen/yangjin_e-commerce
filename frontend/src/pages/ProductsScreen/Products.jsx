import { useLocation, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Drawer,
  IconButton,
  useTheme,
  Skeleton,
  useMediaQuery,
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterSidebar from './FilterSidebar';
import ProductsGrid from './ProductsGrid';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useEffect, useState } from 'react';
import { fetchProductsByFilters } from '../../services/products-services';

const Products = () => {
  const theme = useTheme();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sortMethod = queryParams.get('sort');

  const { category } = useParams();
  const belowSm = useMediaQuery(theme.breakpoints.down('sm'));
  const aboveLg = useMediaQuery(theme.breakpoints.up('lg'));
  const drawerAnchor = belowSm ? 'bottom' : 'left';

  const [isProductsLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth <= theme.breakpoints.values.md ? 9 : 12
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (isOpen) => (e) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }
    setDrawerOpen(isOpen);
  };

  const sortQuery = [
    'featured',
    'priceLowToHigh',
    'priceHighToLow',
    'averageRating',
    'newestArrival',
  ];
  const [sort, setSort] = useState(0);

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const [materialChecked, setMaterialChecked] = useState({});
  const [colorChecked, setColorChecked] = useState({});
  const [applyFiltersClicked, setApplyFiltersClicked] = useState(false);

  const [ratingValue, setRatingValue] = useState(0);
  const [priceValue, setPriceValue] = useState(['', '']);

  const fetchProductsData = async () => {
    switch (sortMethod) {
      case 'newestArrival':
        setSort(4);
        break;

      default:
        break;
    }
    try {
      setIsLoading(true);
      const data = await fetchProductsByFilters(
        category,
        currentPage,
        itemsPerPage,
        materialChecked,
        colorChecked,
        ratingValue,
        priceValue,
        sortQuery[sort]
      );
      setTotalAmount(data.totalAmount);
      setProducts(data.products);
    } catch (err) {
      console.log(err?.data?.message || err.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [
    category,
    currentPage,
    itemsPerPage,
    applyFiltersClicked,
    sort,
    location,
  ]);

  return (
    <Container maxWidth='xl'>
      <Box
        sx={{
          mt: { xs: 3, md: 4 },
          mb: { md: 20 },
          display: 'flex',
        }}
      >
        {/* The filter side bar */}
        {aboveLg ? (
          <Box
            sx={{
              flex: 1,
            }}
          >
            <FilterSidebar
              materialChecked={materialChecked}
              colorChecked={colorChecked}
              ratingValue={ratingValue}
              priceValue={priceValue}
              setMaterialChecked={setMaterialChecked}
              setColorChecked={setColorChecked}
              setRatingValue={setRatingValue}
              setPriceValue={setPriceValue}
              onApplyFilters={() => setApplyFiltersClicked((prev) => !prev)}
            />
          </Box>
        ) : (
          <Drawer
            sx={{
              '& .MuiDrawer-paper': {
                maxWidth: { xs: '100%', sm: '60%', md: '50%' },
              },
            }}
            anchor={drawerAnchor}
            open={drawerOpen}
            variant='persistent'
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              <IconButton onClick={toggleDrawer(false)}>
                <ArrowBackIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
            <Divider sx={{ backgroundColor: 'primary.main' }} />
            <FilterSidebar
              materialChecked={materialChecked}
              colorChecked={colorChecked}
              ratingValue={ratingValue}
              priceValue={priceValue}
              setMaterialChecked={setMaterialChecked}
              setColorChecked={setColorChecked}
              setRatingValue={setRatingValue}
              setPriceValue={setPriceValue}
              onApplyFilters={() => setApplyFiltersClicked((prev) => !prev)}
            />
          </Drawer>
        )}

        {/* The products grids */}
        <Box
          sx={{
            flex: 4,
            pl: { lg: 3 },
          }}
        >
          <Box
            mb={2}
            pr={{ xs: 1, sm: 2 }}
            display='flex'
            justifyContent='space-between'
          >
            <Typography variant='h4'>
              {category === 'all'
                ? 'All'
                : category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id='select-sort-label'>Sort by:</InputLabel>
                <Select
                  labelId='select-sort-label'
                  id='select-sort'
                  defaultValue={0}
                  autoWidth
                  onChange={handleSortChange}
                  label='Sort by:'
                >
                  <MenuItem value={0}>Featured</MenuItem>
                  <MenuItem value={1}>Price: Low to high</MenuItem>
                  <MenuItem value={2}>Price: High to low</MenuItem>
                  <MenuItem value={3}>Avg. customer review</MenuItem>
                  <MenuItem value={4}>Newest arrivals</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                sx={{
                  display: { xs: 'block', lg: 'none' },
                  p: 0,
                  color: 'primary.main',
                }}
                onClick={toggleDrawer(true)}
              >
                <FilterAltOutlinedIcon
                  sx={{ alignSelf: 'center', fontSize: 40 }}
                />
              </IconButton>
            </Box>
          </Box>
          <ProductsGrid
            products={products}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            totalAmount={totalAmount}
            isLoading={isProductsLoading}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
