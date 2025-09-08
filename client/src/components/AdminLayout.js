import React, { useState } from 'react';
import AdminHeader from '../admin/AdminHeader';
import AdminSidebar from '../admin/AdminSidebar';
import { Outlet } from 'react-router-dom';
import { Box, IconButton, Drawer } from '@mui/material';
import { Menu } from '@mui/icons-material';

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false); // For controlling sidebar on smaller screens


  const handleSidebarToggle = () => {
    setTimeout(() => {
      
      setIsOpen(!isOpen); // Toggle the sidebar visibility
    }, 100);
  };

  return (
    <Box sx={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <AdminHeader
      
      handleSidebarToggle={handleSidebarToggle}
      />
      
     

      <Box sx={{ display: 'flex',marginTop:"4rem"}}>
        {/* Sidebar for larger screens */}
        <AdminSidebar 
      handleSidebarToggle={handleSidebarToggle}

isOpen={isOpen}
        
        />
        
      
        {/* Main content */}
        <Box sx={{
    marginLeft: { md: '200px', xs: '0' }, // Adds left margin of 64px on medium+ screens
    padding: 1, // Adds padding equivalent to 8px
    width:"100%"
  }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
