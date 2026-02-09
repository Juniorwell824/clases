import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const AdminLayout = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    }}>
      <Outlet />
    </Box>
  );
};

export default AdminLayout;