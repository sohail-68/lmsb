import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserCourse = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile
  async function fetchProfile() {
    try {
      const response = await fetch('learningm-production.up.railway.app/api/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with actual token
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);
console.log(profile);

  const handleNavigation = (id) => {
    navigate(`/user/lect/${id}`);
  };

  const Quiz = (id) => {
    navigate(`/user/quuize/${id}`)

  };
  return (
    <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e3f2fd",
      padding: 3,
    }}
  >
    <Card
      sx={{
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(15px)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.2)",
        padding: 4,
        textAlign: "center",
      }}
    >
      <CardContent>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#1e3a8a",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          📚 My Courses 🏆
        </Typography>

        {error ? (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        ) : profile ? (
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#4b5563",
                fontWeight: "bold",
                marginBottom: 3,
              }}
            >
              🎓 Enrolled Courses: {profile.enrolledCourses?.length || 0}
            </Typography>

            <Grid container spacing={4}>
              {profile.enrolledCourses?.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 12px 25px rgba(0, 0, 0, 0.15)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.06)",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={course.title}
                      height="200"
                      image={`learningm-production.up.railway.app/${course.courseThumbnail}`}
                      sx={{
                        objectFit: "cover",
                        filter: "brightness(0.95)",
                        borderBottom: "5px solid #1e3a8a",
                      }}
                    />
                    <CardContent sx={{ padding: "20px" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#1e3a8a", marginBottom: 1 }}
                      >
                        🎯 {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280", marginBottom: 1 }}>
                        {course.description.length > 60
                          ? `${course.description.slice(0, 60)}...`
                          : course.description}
                      </Typography>
                      <Chip
                        label={`📂 Category: ${course.category}`}
                        sx={{
                          backgroundColor: "#e2e8f0",
                          color: "#1e3a8a",
                          fontWeight: "bold",
                          marginBottom: 1,
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#1e3a8a", fontWeight: "600", marginBottom: 1 }}
                      >
                        📈 Level: {course.courseLevel}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#1e3a8a", marginBottom: 2 }}
                      >
                        💰 Price: {course.coursePrice > 0 ? `₹${course.coursePrice}` : "🎉 Free"}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: "#1e3a8a",
                          fontWeight: "bold",
                          textTransform: "none",
                          padding:"1rem",

                          "&:hover": { backgroundColor: "#123c7e" },
                          marginBottom: 1,
                        }}
                        onClick={() => handleNavigation(course._id)}
                      >
                        🚀 Show Lectures
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: "ThreeDDarkShadow",
                          fontWeight: "bold",
                          padding:"1rem",
                          textTransform: "none",
                        }}
                        onClick={() => Quiz(course._id)}
                      >
                        🧠 Take Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </CardContent>
    </Card>
  </Box>
  );
};

export default UserCourse;
