import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import AdminLayout from './Adminlayout';
import CreateCourse from './components/CreateCourse';
import UserLayout from './components/UserLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import PublicRoute from './components/PublicRoute'; // Keeping PublicRoute for public pages

export default function Router() {
  const routes = useRoutes([
    // Admin Routes
    {
      path: '/admin',
      element: <AdminLayout />, // Admin Layout accessible for all
      children: [
        { path: '', element: <Navigate to="/admin/create-course" replace /> }, // Default redirect for admin
        { path: 'create-course', element: <CreateCourse /> }, // Admin create-course route
        // Add other admin-specific routes here as needed
      ],
    },

    // User Routes
    {
      path: '/user',
      element: <UserLayout />, // User Layout accessible for all
      children: [
        { path: '/', element: <Navigate to="/user/dashboard" replace /> }, // Default redirect for user
        // Define other user-specific routes as needed
      ],
    },

    // Public Routes
    {
      path: '/login',
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: '/register',
      element: (
        <PublicRoute>
          <Signup />
        </PublicRoute>
      ),
    },

    // Default and Catch-all Routes
    {
      path: '/',
      element: <Navigate to="/login" replace />, // Default route (e.g., redirect to login)
    },
   
    {
      path: '*',
    //   element: <Navigate to="/404" replace />, // Redirect all unmatched routes to 404
    },
  ]);

  return routes;
}
