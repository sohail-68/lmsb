
import { AppBar, Toolbar, Typography, Menu, MenuItem, Box, Button, IconButton, Drawer, TextField } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import Path from "../images/Path.png"
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, fetchCourses } from '../store/features/searchSlice';
import { toast } from 'react-toastify';
const Navbar = () => {
    const dispatch = useDispatch();
  const { searchTerm, loading,courses } = useSelector((state) => state.search);
console.log(courses);
const navigate=useNavigate();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert('Please enter a valid search term.');
      return;
    }
    navigate(`/user/search?term=${encodeURIComponent(searchTerm)}`);
    dispatch(setSearchTerm(''));
    dispatch(fetchCourses(searchTerm));
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dropdown menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const logoutUser = async () => {
    try {
      // Inform the server (optional, but useful for logging purposes)
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`, // Pass the token in the Authorization header
        }
      });
  
      if (response.ok) {
        // Clear the token from localStorage
        localStorage.removeItem('token');  // Or any other key you're using for the token
  toast.success("logout")

        // window.location.href = '/login';  // Or wherever you want to redirect
        setTimeout(() => {
          
          navigate("/login")
        }, 2000);
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
 <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: "#ffffff",
        padding: "0.5rem 1rem",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/user"
          sx={{
            textDecoration: "none",
            color: "#1e3a8a",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={Path}
            alt="logo"
            loading="lazy"
            style={{
              width: "6rem",
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </Typography>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search courses..."
            value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))} 
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
            sx={{
              backgroundColor: "#1e3a8a",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#162c65" },
            }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>

          {[
            { label: "Courses", to: "/user/course", icon: <SchoolIcon /> },
            { label: "Login", to: "/login", icon: <SchoolIcon /> },
            { label: "Wishlist", to: "/user/wish", icon: <SchoolIcon /> },
            { label: "Profile", to: "/user/profile", icon: <AccountCircleIcon /> },
          ].map((item, idx) => (
            <Button
              key={idx}
              component={Link}
              to={item.to}
              startIcon={item.icon}
              sx={{
                textTransform: "none",
                color: "#1e3a8a",
                fontWeight: "bold",
                fontSize: "0.95rem",
                "& svg": { color: "#1e3a8a" },
                "&:hover": { color: "#162c65" },
              }}
            >
              {item.label}
            </Button>
          ))}

          <Button
            onClick={logoutUser}
            startIcon={<LogoutIcon />}
            sx={{
              textTransform: "none",
              color: "#d32f2f",
              fontWeight: "bold",
              "& svg": { color: "#d32f2f" },
              "&:hover": { color: "#b71c1c" },
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Mobile Hamburger */}
        <IconButton
          edge="end"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: "block", lg: "none" }, color: "#1e3a8a" }}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 260,
              backgroundColor: "#1e3a8a",
              color: "#ffffff",
              padding: 2,
            },
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              textAlign: "left",
              mt: 2,
            }}
          >
            {[
              { label: "Courses", to: "/user/course", icon: <SchoolIcon /> },
              { label: "Lectures", to: "/lectures/1", icon: <HomeIcon /> },
              { label: "Profile", to: "/user/profile", icon: <AccountCircleIcon /> },
              { label: "Wishlist", to: "/user/wish", icon: <SchoolIcon /> },
            ].map((item, idx) => (
              <Button
                key={idx}
                component={Link}
                to={item.to}
                startIcon={item.icon}
                sx={{
                  textTransform: "none",
                  color: "#ffffff",
                  fontWeight: "bold",
                  justifyContent: "flex-start",
                  "&:hover": { color: "#add8e6" },
                }}
                onClick={toggleDrawer(false)}
              >
                {item.label}
              </Button>
            ))}

            <Button
              onClick={logoutUser}
              startIcon={<LogoutIcon />}
              sx={{
                textTransform: "none",
                color: "#ffbaba",
                fontWeight: "bold",
                justifyContent: "flex-start",
                "& svg": { color: "#ffbaba" },
                "&:hover": { color: "#ff8080" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>

  );
};

export default Navbar