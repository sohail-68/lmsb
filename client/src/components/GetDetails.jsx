import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  Rating,
} from '@mui/material';
import { toast } from 'react-toastify';
import { FaBook, FaGlobe, FaGraduationCap, FaMoneyBill, FaUsers } from 'react-icons/fa';

const GetDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/courses/detail/${id}`);
      console.log(res);
      
      setCourse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourseDetails();
  }, [id]);
console.log(course);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }
  const enrollInCourse = async (course) => {
    try {
      const response = await apiClient.post(`/courses/${course._id}/enroll`);
      const orderData = response.data;
console.log(orderData);

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
              // navigate(`/user/lect/${course._id}`);
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
        toast.success(`You have enrolled in "${course.title}"`, {
          position: 'top-right',
          autoClose: 2000,
        });
        alert(response.data.message || "Successfully enrolled in the course!");
        // navigate(`/user/lect/${course._id}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(
          error.response.data.message ||
            "You are already enrolled in this course."
        );
        Navigate(`/user/lect/${course._id}`);
      } else {
        console.error("Enrollment Error:", error);
        alert("Enrollment failed.");
      }
    }
  };

  return (
<Box sx={{
        backgroundColor: '#f0f4fa',

  minHeight: "100vh",
  padding: "40px 20px"
}}>
  <Card sx={{ borderRadius: "16px", boxShadow: 6, overflow: "hidden", backgroundColor: "#ffffff" }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <CardMedia
          component="img"
          alt={course.title}
          height="400"
          image={`learningm-production.up.railway.app/${course.courseThumbnail}`}
          sx={{ objectFit: "cover", borderRadius: "16px 0 0 16px" }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CardContent sx={{ padding: "24px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1e3a8a" }}>
            🎓 {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {course.description}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            📚 <strong>Category:</strong> {course.category}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            🎯 <strong>Level:</strong> {course.courseLevel}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            🌍 <strong>Language:</strong> {course.language}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            💰 <strong>Price:</strong> {course.coursePrice > 0 ? `₹${course.coursePrice}` : "🆓 Free"}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={course.analytics?.averageRating || 0} precision={0.5} readOnly size="large" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" color="text.secondary">
              ⭐ {course.analytics?.averageRating || "N/A"} / 5
            </Typography>
          </Box>
          <Typography variant="subtitle1" gutterBottom>
            👥 <strong>Enrollments:</strong> {course.analytics?.enrollments || 0}
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              size="large"
              sx={{
                width: "100%",
                borderRadius: "8px",
                fontWeight: "bold",
                backgroundColor: "#ff9800",
                "&:hover": { backgroundColor: "#e65100", transform: "scale(1.05)" },
              }}
              onClick={() => enrollInCourse(course)}
            >
              🚀 Enroll Now
            </Button>
          </Box>
        </CardContent>
      </Grid>
    </Grid>
  </Card>
  <Box mt={4}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: "24px", borderRadius: "12px", backgroundColor: "#ffffff" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#1e3a8a", fontWeight: "bold" }}>
            🔑 Prerequisites
          </Typography>
          {course.prerequisites?.length > 0 ? (
            <List>
              {course.prerequisites.map((prerequisite, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`✔️ ${prerequisite}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              ❌ No prerequisites listed.
            </Typography>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: "24px", borderRadius: "12px", backgroundColor: "#ffffff" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#1e3a8a", fontWeight: "bold" }}>
            📝 Reviews
          </Typography>
          {course.reviews?.length > 0 ? (
            <List>
              {course.reviews.map((review, index) => (
                <Box key={index} mb={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1e3a8a" }}>
                    👤 {review.user?.name || "Anonymous"}
                  </Typography>
                  <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    💬 {review.comment}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              ❌ No reviews yet.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  </Box>
</Box>


  );
};

export default GetDetails;
