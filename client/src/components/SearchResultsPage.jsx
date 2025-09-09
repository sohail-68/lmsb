import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { searchTerm, loading, courses, error } = useSelector((state) => state.search);
  const [hoveredCard, setHoveredCard] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const searchTermFromURL = queryParams.get('term'); 
  console.log(searchTermFromURL);
  // Enroll in course functionality
  const enrollInCourse = async (course) => {
    try {
      const response = await apiClient.post(`/courses/${course._id}/enroll`);
      const orderData = response.data;

      if (course.coursePrice > 0) {
        const options = {
          key: "rzp_test_pVQpC22qnKIhBQ",
          amount: orderData.coursePrice * 100,
          currency: "INR",
          name: orderData.name,
          description: `Purchase ${orderData.name}`,
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              const paymentVerificationResponse = await apiClient.post(
                `/courses/verify-payment`,
                {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  courseId: orderData.courseId,
                }
              );
              alert(paymentVerificationResponse.data.message);
              navigate(`/user/lect/${course._id}`);
            } catch (err) {
              console.error("Payment Verification Failed:", err);
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        alert(response.data.message || "Successfully enrolled in the course!");
        navigate(`/user/lect/${course._id}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(
          error.response.data.message ||
            "You are already enrolled in this course."
        );
        navigate(`/user/lect/${course._id}`);
      } else {
        console.error("Enrollment Error:", error);
        alert("Enrollment failed.");
      }
    }
  };


  const addToWishlist = async (courseId) => {
    try {
      await apiClient.post(`/courses/${courseId}/wishlist`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Added to wishlist!', { autoClose: 3000 });
    } catch (error) {
      toast.error('Failed to add to wishlist.', { autoClose: 3000 });
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <ToastContainer />
      <Typography variant="h4" align="center" gutterBottom style={{ color: '#1e3a8a' }}>
        Search Results for "{searchTermFromURL}"
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" marginTop="3rem">
          <CircularProgress size={80} style={{ color: '#1e3a8a' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" style={{ margin: '1rem auto', maxWidth: '600px' }}>
          {error}
        </Alert>
      )}

      {!loading && !error && courses.length === 0 && (
        <Typography variant="h6" align="center" style={{ marginTop: '2rem', color: '#555' }}>
          No courses found. Try searching with a different term.
        </Typography>
      )}

      {!loading && courses.length > 0 && (
        <Grid container spacing={4} style={{ marginTop: '2rem' }}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setHoveredCard(course._id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  perspective: '1000px',
                  position: 'relative',
                  height: '600px',
                }}
              >
                <motion.div
                  animate={{
                    rotateY: hoveredCard === course._id ? 180 : 0,
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.8s',
                  }}
                >
                  {/* Front Side */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={`https://lmsb-apt8.onrender.com/${course.courseThumbnail}`}
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '60%',
                        objectFit: 'cover',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                      }}
                    />
                    <Box p={2}>
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: 'bold',
                          color: '#1e3a8a',
                          textTransform: 'capitalize',
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: '#555', marginBottom: '0.5rem' }}
                      >
                        {course.description}
                      </Typography>

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">
                          Level: {course.courseLevel}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Language: {course.language}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                        Instructor: {course.instructor}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                        Price: {course.price ? `$${course.price}` : 'Free'}
                      </Typography>
                    </Box>
                  </div>

                  {/* Back Side */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#1e3a8a',
                      }}
                    >
                      {course.title} 🎓
                    </Typography>
                  </div>
                </motion.div>
              </motion.div>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => enrollInCourse(course)}
                >
                  Enroll
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => addToWishlist(course._id)}
                >
                  Wishlist
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SearchResultsPage;
