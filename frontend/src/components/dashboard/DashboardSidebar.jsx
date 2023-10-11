import {
  Box,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useEffect, useState } from 'react';

const DashboardSidebar = ({ sidebarWidth }) => {
  const productsSubLinks = [
    'Top Products',
    'Product Grid',
    'Product Management',
    'Product Editor',
  ];
  const productsURLs = [
    '/dashboard/top-products',
    '/dashboard/product-grid',
    '/dashboard/manage-products',
    '/dashboard/edit-product',
  ];

  const [expanded, setExpanded] = useState(false);

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const location = useLocation();
  const activeLinkStyles = {
    backgroundColor: 'background.active',
    color: 'background.default',
    '&:hover': {
      backgroundColor: 'secondary.main',
    },
  };
  const inactiveLinkStyles = {
    '&:hover': {
      backgroundColor: 'background.active',
    },
  };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        width: sidebarWidth,
        '& .MuiPaper-root': {
          width: sidebarWidth,
          backgroundColor: 'background.sidebar',
          overflow: 'hidden',
          color: 'text.sidebar',
        },
      }}
      variant='permanent'
      anchor='left'
    >
      <Typography mx='auto' my={3} variant='h4'>
        Dashboard
      </Typography>
      <Divider color='divider' />

      <Accordion
        disableGutters
        square
        expanded={expanded === 'panel1'}
        onChange={handlePanelChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'text.sidebar' }} />}
        >
          <DashboardIcon sx={{ alignSelf: 'center' }} />
          <Typography ml={2} variant='h6'>
            Dashboard
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List>
            <ListItem disableGutters disablePadding>
              <ListItemButton
                component={NavLink}
                to='/dashboard'
                sx={
                  location.pathname === '/dashboard'
                    ? activeLinkStyles
                    : inactiveLinkStyles
                }
              >
                <ListItemIcon>
                  <FiberManualRecordIcon
                    sx={
                      location.pathname === '/dashboard'
                        ? { color: 'text.sidebar' }
                        : { display: 'none' }
                    }
                  />
                </ListItemIcon>
                <ListItemText primary='Overview' />
              </ListItemButton>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disableGutters
        square
        expanded={expanded === 'panel2'}
        onChange={handlePanelChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'text.sidebar' }} />}
        >
          <InventoryIcon sx={{ alignSelf: 'center' }} />
          <Typography ml={2} variant='h6'>
            Products
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List>
            {productsSubLinks.map((linkName, index) => (
              <ListItem disableGutters disablePadding key={index}>
                <ListItemButton
                  component={NavLink}
                  to={`${productsURLs[index]}`}
                  sx={
                    location.pathname === `${productsURLs[index]}`
                      ? activeLinkStyles
                      : inactiveLinkStyles
                  }
                >
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      sx={
                        location.pathname === `${productsURLs[index]}`
                          ? { color: 'text.sidebar' }
                          : { display: 'none' }
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={`${productsSubLinks[index]}`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Drawer>
  );
};

export default DashboardSidebar;
