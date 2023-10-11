import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';

const DashboardNavbar = ({ sidebarWidth }) => {
  return (
    <AppBar
      position='fixed'
      sx={{
        width: `calc(100% - ${sidebarWidth}px)`,
        ml: `${sidebarWidth}px`,
      }}
    >
      <Toolbar>
        <Typography variant='h6'>This is the dashboard</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;
