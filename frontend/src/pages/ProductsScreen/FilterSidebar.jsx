import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  OutlinedInput,
  Rating,
  FormControl,
  Typography,
} from '@mui/material';
// import MuiAccordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { fetchFilters } from '../../services/products-services';

const FilterSidebar = ({
  materialChecked,
  colorChecked,
  ratingValue,
  priceValue,
  setMaterialChecked,
  setColorChecked,
  setRatingValue,
  setPriceValue,
  onApplyFilters,
}) => {
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);

  const clearFilters = () => {
    setMaterialChecked({});
    setColorChecked({});
    setRatingValue(0);
    setPriceValue(['', '']);
  };

  const fetchFiltersData = async () => {
    try {
      const filters = await fetchFilters();
      if (filters) {
        setMaterials(filters.materials);
        setColors(filters.colors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMaterialChange = (e, material) => {
    setMaterialChecked((prev) => ({ ...prev, [material]: e.target.checked }));
  };

  const handleColorChange = (e, color) => {
    setColorChecked((prev) => ({ ...prev, [color]: e.target.checked }));
  };

  const handleRatingChange = (e, newRating) => {
    setRatingValue(newRating);
  };

  const handleMinPriceChange = (e) => {
    const minPrice = e.target.value;
    const hasOneOrLessDecimalPoints = (minPrice.match(/\./g) || []).length <= 1;
    const validFormat =
      minPrice === '' ||
      minPrice === '.' ||
      /^(\d+(\.\d{0,2})?|\.\d{0,2})$/.test(minPrice);

    if (hasOneOrLessDecimalPoints && validFormat) {
      setPriceValue([minPrice, priceValue[1]]);
    }
  };
  const handleMaxPriceChange = (e) => {
    const maxPrice = e.target.value;
    const hasOneOrLessDecimalPoints = (maxPrice.match(/\./g) || []).length <= 1;
    const validFormat =
      maxPrice === '' ||
      maxPrice === '.' ||
      /^(\d+(\.\d{0,2})?|\.\d{0,2})$/.test(maxPrice);

    if (hasOneOrLessDecimalPoints && validFormat) {
      setPriceValue([priceValue[0], maxPrice]);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    const initialMaterialCheckedState = materials.reduce((acc, material) => {
      acc[material] = false;
      return acc;
    }, {});
    const initialColorCheckedState = colors.reduce((acc, color) => {
      acc[color] = false;
      return acc;
    }, {});
    setMaterialChecked(initialMaterialCheckedState);
    setColorChecked(initialColorCheckedState);
  }, [materials, colors]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='h6'>Filters</Typography>
      </Box>
      <Accordion
        elevation={0}
        square
        disableGutters
        defaultExpanded
        sx={{ '&:before': { backgroundColor: 'unset' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Material</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {materials.length ? (
            materials.map((material, index) => (
              <FormControlLabel
                key={material}
                control={
                  <Checkbox
                    checked={materialChecked[material] || false}
                    onChange={(e) => handleMaterialChange(e, material)}
                    name={material}
                    color='primary'
                  />
                }
                label={material}
              />
            ))
          ) : (
            <CircularProgress />
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={0}
        square
        disableGutters
        defaultExpanded
        sx={{ '&:before': { backgroundColor: 'unset' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Color</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {colors.length ? (
            colors.map((color, index) => (
              <FormControlLabel
                key={color}
                control={
                  <Checkbox
                    checked={colorChecked[color] || false}
                    onChange={(e) => handleColorChange(e, color)}
                    name={color}
                    color='primary'
                  />
                }
                label={color}
              />
            ))
          ) : (
            <CircularProgress />
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={0}
        square
        disableGutters
        defaultExpanded
        sx={{ '&:before': { backgroundColor: 'unset' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Rating</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex' }}>
          <Rating value={ratingValue} onChange={handleRatingChange} />
          <Typography variant='body1' ml={1}>
            & Up
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={0}
        square
        disableGutters
        defaultExpanded
        sx={{ '&:before': { backgroundColor: 'unset' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Price</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <FormControl variant='outlined' sx={{ width: '47%' }}>
            <OutlinedInput
              value={priceValue[0]}
              onChange={handleMinPriceChange}
              placeholder='min'
              startAdornment={
                <InputAdornment position='start'>$</InputAdornment>
              }
            />
          </FormControl>
          <FormControl variant='outlined' sx={{ width: '47%' }}>
            <OutlinedInput
              value={priceValue[1]}
              onChange={handleMaxPriceChange}
              placeholder='max'
              startAdornment={
                <InputAdornment position='start'>$</InputAdornment>
              }
            />
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Button
        variant='contained'
        onClick={onApplyFilters}
        sx={{
          width: '90%',
          alignSelf: 'center',
          borderRadius: 6,
          py: 1,
          my: 3,
        }}
      >
        Apply Filters
      </Button>
      <Button
        variant='outlined'
        onClick={clearFilters}
        sx={{
          width: '90%',
          alignSelf: 'center',
          borderRadius: 6,
          py: 1,
          mb: 2,
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default FilterSidebar;
