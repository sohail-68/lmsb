import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import {
  Home,
  LibraryBooks,
  People,
  Settings,
  ExitToApp,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const logOutUser = async () => {
    try {
      const response = await axios.post(
        "learningm-production.up.railway.app/api/auth/logo",
        {}, // Pass an empty object for the body if no data is needed
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token in the Authorization header
          },
        }
      );
      console.log("Logout successful:", response.data);

      toast.success("logout");
      localStorage.removeItem("token");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(
        "Error logging out:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "1rem",
        padding: "0.3rem",
        left: 0,

        height: "100%",
        backgroundColor: "#2A3E52", // Sidebar background
        boxShadow: 3, // Shadow depth
        zIndex: 40, // Layer above main content
        transform: {
          xs: isOpen ? "translateX(0)" : "translateX(-100%)", // Slide in/out for small screens
          md: "translateX(0)", // Always visible on medium and larger screens
        },
        transition: "transform 0.3s ease-in-out", // Smooth sliding animation
        color: "white", // Text color
      }}
    >
      <h3 style={{ color: "#fff", fontWeight: "bold", fontSize: "1.5rem" }}>
        Admin Panel
      </h3>

      <List>
        <ListItem
          button
          component={Link}
          to="/admin/dashboard"
          sx={{
            backgroundColor: isActive("/admin/dashboard")
              ? "#1D3C75"
              : "transparent",
            "&:hover": { backgroundColor: "#1D3C75" },
          }}
        >
          <Home sx={{ mr: 2 }} />
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/admin/create-course"
          sx={{
            backgroundColor: isActive("/admin/create-course")
              ? "#1D3C75"
              : "transparent",
            "&:hover": { backgroundColor: "#1D3C75" },
          }}
        >
          <LibraryBooks sx={{ mr: 2 }} />
          <ListItemText primary="Create Course" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/admin/userdashb"
          sx={{
            backgroundColor: isActive("/admin/userdashb")
              ? "#1D3C75"
              : "transparent",
            "&:hover": { backgroundColor: "#1D3C75" },
          }}
        >
          <LibraryBooks sx={{ mr: 2 }} />
          <ListItemText primary="Enroll User" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/admin/Lectureall"
          sx={{
            backgroundColor: isActive("/admin/manage-users")
              ? "#1D3C75"
              : "transparent",
            "&:hover": { backgroundColor: "#1D3C75" },
          }}
        >
          <People sx={{ mr: 2 }} />
          <ListItemText primary="All Lecture" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/admin/pay"
          sx={{
            backgroundColor: isActive("/admin/pay")
              ? "#1D3C75"
              : "transparent",
            "&:hover": { backgroundColor: "#1D3C75" },
          }}
        >
          <Settings sx={{ mr: 2 }} />
          <ListItemText primary="Pay" />
        </ListItem>

    
          <ListItem sx={{ "&:hover": { backgroundColor: "#1D3C75" } }}>
            <ExitToApp sx={{ mr: 2 }} />
            <ListItemText primary="Logout"  onClick={logOutUser}/>
          </ListItem>
   
      </List>
    </Box>
  );
};

export default AdminSidebar;
