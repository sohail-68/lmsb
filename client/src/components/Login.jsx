import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserStart, registerUserSuccess, registerUserFailure } from '../Auth/Authslice.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUserStart());
    try {
      const response = await axios.post('https://lmsb-apt8.onrender.com/api/auth/login', { email, password });
      const userData = response.data.user;
      const token = response.data.token;

      // Store userData and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userid', userData._id);
      localStorage.setItem('token', token);

      // Dispatch the userData and token to Redux
      dispatch(registerUserSuccess({ userData, token }));

      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard'); // Redirect to admin dashboard or home page
      } else {
        navigate('/user'); // Redirect to another page for non-admin users
      }
    } catch (err) {
      dispatch(registerUserFailure(err.response?.data?.error || 'Something went wrong'));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
        px: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 450,
          bgcolor: '#fff',
          borderRadius: 3,
          p: 5,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: '#333', mb: 2 }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          mb={3}
        >
          Please enter your credentials to log in.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          InputProps={{
            style: { backgroundColor: '#f9f9f9' },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            style: { backgroundColor: '#f9f9f9' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
            '&:hover': {
              background: 'linear-gradient(45deg, #6a11cb, #5B86E5)',
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
        </Button>

        <Box mt={3} textAlign="center">
          <Button
            variant="text"
            size="small"
            sx={{ color: '#6a11cb', textTransform: 'none', fontWeight: 'bold' }}
          >
            Forgot Password?
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            py: 1.5,
            textTransform: 'none',
            color: '#333',
            borderColor: '#ddd',
            '&:hover': {
              backgroundColor: '#f9f9f9',
            },
          }}
        >
          Continue with Google
        </Button>

        <Typography
          variant="body2"
          mt={3}
          color="textSecondary"
        >
          Don’t have an account?{' '}
          <Button
            variant="text"
            size="small"
            sx={{ color: '#6a11cb', fontWeight: 'bold', textTransform: 'none' }}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
