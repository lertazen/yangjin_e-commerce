import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';

const DashboardLayout = () => {
  const sidebarWidth = 300;
  return (
    <Box display='flex'>
      <DashboardNavbar sidebarWidth={sidebarWidth} />
      <DashboardSidebar sidebarWidth={sidebarWidth} />
      <Box sx={{ mt: 10, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
