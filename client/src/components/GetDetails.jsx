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
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';
import { FaBook, FaGlobe, FaGraduationCap, FaMoneyBill, FaUsers } from 'react-icons/fa';

const GetDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [review, setReview] = useState({
  rating: 0,
  comment: "",
});


const handleReviewChange = (event) => {
  const { name, value } = event.target;
  setReview((prev) => ({
    ...prev,
    [name]: value,
  }));
}; 
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
               const userId = localStorage.getItem("userid");
    setCourse((prev) => ({
      ...prev,
      enrolledUsers: [...prev.enrolledUsers, userId],
    }));
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

  
const handleReviewSubmit = async (courseId) => {
  if (review.rating === 0 || review.comment === "") {
    alert("Please provide both rating and comment.");
    return;
  }

  try {
    const response = await apiClient.post(`/courses/${courseId}/review`, review);
    alert(response.data.message);

    getCourseDetails()
    setReview({ rating: 0, comment: "" }); // Reset
  } catch (err) {
    console.error(err);
    alert("Failed to submit review.");
  }
};


  return (
<Box
  sx={{
    backgroundColor: "#f4f6fb",
    minHeight: "100vh",
    py: 6,
    px: 2,
  }}
>
  {/* Course Detail Card */}
  <Card
    sx={{
      borderRadius: "18px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      overflow: "hidden",
      backgroundColor: "#fff",
      maxWidth: "1200px",
      mx: "auto",
    }}
  >
    <Grid container spacing={0}>
      {/* Left - Thumbnail */}
      <Grid item xs={12} md={6}>
        <CardMedia
          component="img"
          alt={course.title}
          height="100%"
          image={`http://localhost:5000/${course.courseThumbnail}`}
          sx={{
            objectFit: "cover",
            height: { xs: 250, md: "100%" },
          }}
        />
      </Grid>

      {/* Right - Info */}
      <Grid item xs={12} md={6}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1e3a8a" }}>
            {course.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {course.description}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            <strong>Category:</strong> {course.category}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Level:</strong> {course.courseLevel}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Language:</strong> {course.language}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Price:</strong>{" "}
            {course.coursePrice > 0 ? `₹${course.coursePrice}` : "Free"}
          </Typography>

          <Box display="flex" alignItems="center" mb={2} mt={1}>
            <Rating
              value={course.analytics?.averageRating || 0}
              precision={0.5}
              readOnly
              size="large"
              sx={{ mr: 1 }}
            />
            <Typography variant="subtitle1" color="text.secondary">
              {course.analytics?.averageRating || "N/A"} / 5
            </Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            <strong>Enrollments:</strong> {course.analytics?.enrollments || 0}
          </Typography>

          <Box mt={3}>
            <Button
              variant="contained"
              size="large"
              sx={{
                width: "100%",
                borderRadius: "10px",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                py: 1.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #1e40af, #2563eb)",
                  transform: "scale(1.03)",
                },
              }}
              onClick={() => enrollInCourse(course)}
            >
              Enroll Now
            </Button>
          </Box>
        </CardContent>
      </Grid>
    </Grid>
  </Card>

  {/* Bottom Section */}
  <Box mt={6} maxWidth="1200px" mx="auto">
    <Grid container spacing={4}>
      {/* Prerequisites */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: "14px",
            backgroundColor: "#fff",
            // height: "100%",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#1e3a8a", fontWeight: "bold" }}>
            Prerequisites
          </Typography>
          {course.prerequisites?.length > 0 ? (
            <List>
              {course.prerequisites.map((prerequisite, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText primary={prerequisite} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No prerequisites listed.
            </Typography>
          )}
        </Paper>
      </Grid>

      {/* Reviews */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: "14px",
            backgroundColor: "#fff",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#1e3a8a", fontWeight: "bold" }}>
            Reviews
          </Typography>
          {course.reviews?.length > 0 ? (
            <List sx={{ flex: 1 }}>
              {course.reviews.map((review, index) => (
                <Box key={index} mb={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1e3a8a" }}>
                    {review.user?.name || "Anonymous"}
                  </Typography>
                  <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {review.comment}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No reviews yet.
            </Typography>
          )}

          {/* Add Review */}
        <Box
  sx={{
    mt: 3,
    p: 3,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  }}
>
  {/* Heading */}
  <Typography
    variant="h6"
    sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
  >
    ✍️ Add Your Review
  </Typography>

  {/* Rating */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <Rating
      value={review.rating || 0}
      onChange={(event, newValue) =>
        setReview((prev) => ({ ...prev, rating: newValue }))
      }
      size="large"
      sx={{ color: "#fbbf24" }} // golden-yellow stars
    />
    <Typography sx={{ ml: 2, fontWeight: 500, color: "text.secondary" }}>
      {review.rating ? `${review.rating} / 5` : "No rating yet"}
    </Typography>
  </Box>

  {/* Comment Box */}
  <TextField
    name="comment"
    value={review.comment || ""}
    onChange={handleReviewChange}
    variant="outlined"
    multiline
    rows={3}
    fullWidth
    placeholder="Write your feedback..."
    sx={{
      mb: 3,
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f9fafb",
      },
    }}
  />

  {/* Submit Button */}
  {course.enrolledUsers.includes(localStorage.getItem("userid")) ? (
    <Button
      variant="contained"
      fullWidth
      sx={{
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        borderRadius: "12px",
        py: 1.5,
        fontWeight: "bold",
        fontSize: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        "&:hover": {
          background: "linear-gradient(135deg, #1e40af, #2563eb)",
        },
      }}
      onClick={() => handleReviewSubmit(course._id)}
    >
      🚀 Submit Review
    </Button>
  ) : (
    <Typography
      variant="body2"
      sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
    >
      You need to enroll in this course to leave a review.
    </Typography>
  )}
</Box>

        </Paper>
      </Grid>
    </Grid>
  </Box>
</Box>


  );
};

export default GetDetails;
