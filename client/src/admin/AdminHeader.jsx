import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, CircularProgress, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AdminHeader = ({ handleSidebarToggle }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile
  async function fetchProfile() {
    try {
      const response = await fetch('learningm-production.up.railway.app/api/auth/admin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with actual token
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);
console.log(profile);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensures it stays above the sidebar
        bgcolor: 'primary.main',
      }}
    >
      <Toolbar>
        {/* Sidebar Toggle Icon */}
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'block', md: 'none' } }} // Visible on small screens
          onClick={handleSidebarToggle}
        >
          <MenuIcon />
        </IconButton>

        {/* Header Title */}
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>

        {/* User Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : error ? (
            <Alert severity="error" sx={{ margin: 0 }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="inherit">
                {profile?.name || 'Admin'}
              </Typography>
              <Avatar sx={{ bgcolor: 'secondary.main' }} alt={profile?.name}>
                {profile?.name ? profile.name.charAt(0) : 'A'}
              </Avatar>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
