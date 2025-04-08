import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserStart, registerUserSuccess, registerUserFailure } from '../Auth/Authslice';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUserStart());

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('userid', data.user._id);
      dispatch(registerUserSuccess(data.user));
    } catch (error) {
      dispatch(registerUserFailure(error.response?.data?.message || error.message));
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="linear-gradient(135deg, rgba(19, 82, 131, 0.8), rgba(6, 26, 44, 0.8))"
      px={3}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          borderRadius: 6,
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              color: 'ButtonShadow',
              mb: 4,
              textTransform: 'uppercase',
            }}
          >
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 600,
                backgroundColor: '#2C4D85',
                '&:hover': {
                  backgroundColor: '#224B7B',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Box>

          <Typography
            variant="body2"
            mt={3}
            align="center"
            color="textSecondary"
          >
            Already have an account?{' '}
            <Button
              variant="text"
              size="small"
              sx={{
                color: '#2C4D85',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              <Link to="/login" style={{ textDecoration: 'none', color: '#2C4D85' }}>
                Log In
              </Link>
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
