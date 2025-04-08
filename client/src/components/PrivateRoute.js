import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = true; // Replace with actual authentication logic
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
