// components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // or from context/localStorage

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth); // Assuming user data is in Redux
console.log(user);

  // Check if user is logged in and has the correct role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect to home or unauthorized page
  }

  return element;
};

export default ProtectedRoute;
