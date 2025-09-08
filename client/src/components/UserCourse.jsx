import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  CardMedia,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserCourse = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile
  async function fetchProfile() {
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleNavigation = (id) => {
    navigate(`/user/lect/${id}`);
  };

  const Quiz = (id) => {
    navigate(`/user/quuize/${id}`);
  };

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={70} thickness={4.5} sx={{ color: "#1e3a8a" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
        py: 6,
        px: 3,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", color: "#1e3a8a", mb: 5 }}
      >
        My Enrolled Courses
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {profile.enrolledCourses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                alt={course.title}
                height="180"
                image={`http://localhost:5000/${course.courseThumbnail}`}
                sx={{
                  objectFit: "cover",
                  borderBottom: "4px solid #1e3a8a",
                }}
              />
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1e3a8a", mb: 1 }}
                >
                  {course.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", mb: 2, lineHeight: 1.5 }}
                >
                  {course.description.length > 80
                    ? `${course.description.slice(0, 80)}...`
                    : course.description}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip
                    label={course.category}
                    sx={{
                      bgcolor: "#e0e7ff",
                      color: "#1e3a8a",
                      fontWeight: "600",
                    }}
                  />
                  <Chip
                    label={course.courseLevel}
                    sx={{
                      bgcolor: "#dbeafe",
                      color: "#1e40af",
                      fontWeight: "600",
                    }}
                  />
                  <Chip
                    label={
                      course.coursePrice > 0 ? `₹${course.coursePrice}` : "Free"
                    }
                    sx={{
                      bgcolor: course.coursePrice > 0 ? "#fee2e2" : "#dcfce7",
                      color: course.coursePrice > 0 ? "#b91c1c" : "#065f46",
                      fontWeight: "600",
                    }}
                  />
                </Box>

                <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#1e3a8a",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      py: 1.2,
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#123c7e" },
                    }}
                    onClick={() => handleNavigation(course._id)}
                  >
                    Show Lectures
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: "#1e3a8a",
                      color: "#1e3a8a",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      py: 1.2,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#123c7e",
                        color: "#123c7e",
                      },
                    }}
                    onClick={() => Quiz(course._id)}
                  >
                    Take Quiz
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserCourse;
