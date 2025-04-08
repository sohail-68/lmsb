
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
  sx={{
    backgroundColor: '#FFFFFF', // Solid blue background
    padding: '1rem 1rem',
    boxShadow: '10 4px 10px rgba(0, 0, 0, 0.3)',
  }}
>

  <Toolbar>
    {/* Logo/Brand */}
    <Typography
      variant="h6"
      component={Link}
      to="/user"
      sx={{
        flexGrow: 1,
        fontWeight: 'bold',
        textDecoration: 'none',
        color: '#1e3a8a', // White text
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <img src={Path} alt="" loading="lazy"   style={{width:"6rem", background:"none", objectFit:"cover", borderRadius:"3rem"}}/>
    </Typography>

    {/* Hamburger Menu for Mobile */}
    <IconButton
      edge="end"
      color="1e3a8a"
      aria-label="menu"
      onClick={toggleDrawer(true)}
      sx={{ display: { xs: 'block', lg: 'none' } }}
    >
      <MenuIcon sx={{ color: '#1e3a8a' }} /> {/* White icon */}
    </IconButton>

    <Box
      sx={{
        display: { xs: 'none', xl: 'flex' },
        gap: 3,
        alignItems: 'center',
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search courses"
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={handleSearch}
        sx={{
          backgroundColor: '#1e3a8a',
        }}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </Button>
      <Button
        component={Link}
        to="/user/course"
        sx={{
          textTransform: 'none',
          fontSize:'1rem',
          color: '#1e3a8a',
          
          
           // White text
          fontWeight: 'bold',
          '&:hover': { color: '#1e3a8a' }, // Light blue on hover
        }}
        startIcon={<SchoolIcon sx={{ color: '#ffffff' }} />}
      >
        Courses
      </Button>
      <Button
        component={Link}
        to="/login"
        sx={{
          textTransform: 'none',
          fontSize:'1rem',
          color: '#1e3a8a',
          
          
           // White text
          fontWeight: 'bold',
          '&:hover': { color: '#1e3a8a' }, // Light blue on hover
        }}
        startIcon={<SchoolIcon sx={{ color: '#ffffff' }} />}
      >
        Login
      </Button>
      <Button
        component={Link}
        to="/user/wish"
        sx={{
          textTransform: 'none',
          fontSize:'1rem',
          color: '#1e3a8a',
          
          
           // White text
          fontWeight: 'bold',
          '&:hover': { color: '#1e3a8a' }, // Light blue on hover
        }}
        startIcon={<SchoolIcon sx={{ color: '#ffffff' }} />}
      >
        Wishlist
      </Button> 
      {/* <Button
        onClick={handleMenuOpen}
        sx={{
          textTransform: 'none',
          fontSize:'1rem',

          color: '#1e3a8a',
          fontWeight: 'bold',
          '&:hover': { color: '#1e3a8a' },
        }}
        startIcon={<HomeIcon sx={{ color: '#ffffff' }} />}
      >
        Lectures
      </Button> */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 2 }}
      >
        <MenuItem
          component={Link}
          to="/lectures/1"
          onClick={handleMenuClose}
          sx={{ fontWeight: 'bold' }}
        >
          Lecture 1
        </MenuItem>
        <MenuItem
          component={Link}
          to="/lectures/2"
          onClick={handleMenuClose}
          sx={{ fontWeight: 'bold' }}
        >
          Lecture 2
        </MenuItem>
        <MenuItem
          component={Link}
          to="/lectures/3"
          onClick={handleMenuClose}
          sx={{ fontWeight: 'bold' }}
        >
          Lecture 3
        </MenuItem>
      </Menu>
      <Button
        component={Link}
        to="/user/profile"
        sx={{
          textTransform: 'none',
          color: '#1e3a8a',
          fontSize:'1rem',

          fontWeight: 'bold',
          '&:hover': { color: '#add8e6' },
        }}
        startIcon={<AccountCircleIcon sx={{ color: '#ffffff' }} />}
      >
        Profile
      </Button>
      <Button
        component={Link}
        // to="/logout"
        sx={{
          fontSize:'1rem',

          textTransform: 'none',
          color: '#1e3a8a',
          fontWeight: 'bold',
          '&:hover': { color: '#add8e6' },
        }}
        startIcon={<LogoutIcon sx={{ color: '#ffffff' }} />}
        onClick={logoutUser}
      >
        Logout
      </Button>
    </Box>

    {/* Drawer for Mobile */}
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 250,
          backgroundColor: '#007bff', // Match the header color
          color: '#ffffff',
          padding: 2,
        },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{ color: '#ffffff', alignSelf: 'flex-end' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          textAlign: 'center',
        }}
      >
        <Button
          component={Link}
          to="/courses"
          sx={{
            textTransform: 'none',
            color: '#ffffff',
            fontWeight: 'bold',
            '&:hover': { color: '#add8e6' },
          }}
          startIcon={<SchoolIcon sx={{ color: '#ffffff' }} />}
          onClick={toggleDrawer(false)}
        >
          Courses
        </Button>
        <Button
          component="div"
          onClick={handleMenuOpen}
          sx={{
            textTransform: 'none',
            color: '#ffffff',
            fontWeight: 'bold',
            '&:hover': { color: '#add8e6' },
          }}
          startIcon={<HomeIcon sx={{ color: '#ffffff' }} />}
        >
          Lectures
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 2 }}
        >
          <MenuItem
            component={Link}
            to="/lectures/1"
            onClick={handleMenuClose}
            sx={{ fontWeight: 'bold' }}
          >
            Lecture 1
          </MenuItem>
          <MenuItem
            component={Link}
            to="/lectures/2"
            onClick={handleMenuClose}
            sx={{ fontWeight: 'bold' }}
          >
            Lecture 2
          </MenuItem>
          <MenuItem
            component={Link}
            to="/lectures/3"
            onClick={handleMenuClose}
            sx={{ fontWeight: 'bold' }}
          >
            Lecture 3
          </MenuItem>
        </Menu>
        <Button
          component={Link}
          to="/profile"
          sx={{
            textTransform: 'none',
            color: '#ffffff',
            fontWeight: 'bold',
            '&:hover': { color: '#add8e6' },
          }}
          startIcon={<AccountCircleIcon sx={{ color: '#ffffff' }} />}
          onClick={toggleDrawer(false)}
        >
          Profile
        </Button>
        <Button
          component={Link}
          to="/logout"
          sx={{
            textTransform: 'none',
            color: '#ffffff',
            fontWeight: 'bold',
            '&:hover': { color: '#add8e6' },
          }}
          startIcon={<LogoutIcon sx={{ color: '#ffffff' }} />}
          onClick={toggleDrawer(false)}
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