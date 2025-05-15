import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Chip, CircularProgress, Alert, Button } from '@mui/material';
import { motion } from 'framer-motion';
import apiClient from "../api/apiClient";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Play = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get("/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const startQuiz = (id) => {
    navigate(`/user/quuize/${id}`)

  };

  return (
    <Box sx={{ minHeight: "60vh", bgcolor: "#eef2ff", padding: "20px" }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Typography
          component="h2"
          sx={{
            color: "#1e3a8a",
            fontSize: "2.5rem",
            letterSpacing: "0.5rem",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Play & Learn 🎮📚
        </Typography>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress size={80} thickness={4.5} sx={{ color: "#1e3a8a" }} />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <Card sx={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", borderRadius: "12px", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    alt={course.title}
                    height="250"
                    image={`learningm-production.up.railway.app/${course.courseThumbnail}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ padding: "20px", bgcolor: "#f8fafc" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e3a8a" }}>
                      {course.title} 🎓
                    </Typography>

                    <Box sx={{ display: "flex", gap: "0.5rem", mt: "0.5rem" }}>
                      <Chip label={course.category} sx={{ bgcolor: "#1e3a8a", color: "#fff" }} />
                      <Chip label={course.courseLevel} sx={{ bgcolor: "#3b82f6", color: "#fff" }} />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mt: "0.5rem" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e3a8a" }}>
                        Price 💰:
                      </Typography>
                      <Chip
                        label={course.coursePrice > 0 ? `₹${course.coursePrice}` : "Free"}
                        sx={{
                          bgcolor: course.coursePrice > 0 ? "#3b82f6" : "#1e3a8a",
                          color: "#fff",
                          marginLeft: "8px",
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: "6px", fontSize: "0.95rem", color: "#6B7280" }}>
                      <Typography>📊 Enrollments: {course.analytics.enrollments}</Typography>
                      <Typography>⭐ Average Rating: {course.analytics.averageRating}</Typography>
                    </Box>

                    <Box sx={{ mt: "16px" }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#3b82f6",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          "&:hover": { backgroundColor: "#123c7e" },
                        }}
                        onClick={() => startQuiz(course._id)}
                      >
                        Play Quiz 🎮
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <ToastContainer />
    </Box>
  );
};

export default Play;