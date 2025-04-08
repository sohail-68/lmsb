import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  return (
    <div>
   
      {/* Render the children (Login, Signup, etc.) */}
      <main>
        {children} {/* This will render the Login or Signup component */}
      </main>
    </div>
  );
};

export default PublicRoute;
