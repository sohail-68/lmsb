  import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Chip,
  TextField,
  IconButton,
  Rating,
} from "@mui/material";
import { FaHeart, FaInfoCircle, FaStar } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Link } from "@mui/icons-material";
import { motion } from "framer-motion"; // Im
import axios from "axios";
const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState({}); // Changed to an object to handle reviews for specific courses
  const [searchTerm, setSearchTerm] = useState("");
  const [sels, setsels] = useState("");
  const navigate = useNavigate();
  const location=useLocation()
  const pa=useSearchParams()
console.log(location);

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


  // Handle review changes for a specific course
  const handleReviewChange = (courseId, event) => {
    const { name, value } = event.target;
    console.log("ratting", courseId, "e", event);
    console.log(name);

    setReview((prevReview) => ({
      ...prevReview,
      [courseId]: {
        ...prevReview[courseId],
        [name]: value,
      },
    }));
  };
console.log(courses);

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
        navigate(`/user/lect/${course._id}`);
      } else {
        console.error("Enrollment Error:", error);
        alert("Enrollment failed.");
      }
    }
  };

  // Handle review submission for specific course
  const handleReviewSubmit = async (courseId) => {
    const courseReview = review[courseId];
    console.log(courseReview);

    if (
      !courseReview ||
      courseReview.rating === 0 ||
      courseReview.comment === ""
    ) {
      alert("Please provide both rating and comment.");
      return;
    }

    try {
      const response = await apiClient.post(
        `/courses/${courseId}/review`,
        courseReview
      );
      alert(response.data.message);
      setReview((prevReview) => ({
        ...prevReview,
        [courseId]: { rating: 0, comment: "" }, // Reset review after submission
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  // Handle search term change

  const addToWishlist = async (courseId) => {
    try {
      const response = await apiClient.post(
        `/courses/${courseId}/wishlist`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      console.log(response.data.message); // For debugging purposes, you can check the response structure
  
      if (response.data.message === "Added to wishlist") {
        toast.success('Added to your wishlist!', {
          position: 'top-right',
          autoClose: 2000,
        });
      } else if (response.data.message === "Removed from wishlist") {
        toast.success('Removed from your wishlist!', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
  
      return response.data; // This will return the full response if needed elsewhere
    } catch (error) {
      // Error handling if the request fails
      const errorMessage =
        error.response?.data?.message || "Adding to wishlist failed";
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 2000,
      });
      throw errorMessage; // You may want to throw the error if you want to handle it elsewhere
    }
  };
  
  function HandDetali(course) {
    navigate(`/user/detail/${course._id}`);
  }
  useEffect(()=>{
    fetchCourses();

  },[])
  console.log(courses);
  
  const handleSearch = async () => {
    if (!searchTerm || searchTerm.trim() === "") {
      alert("Please enter a valid search term.");
      return;
    }

    setLoading(true);  // Set loading to true when the request starts
    setError('');  // Reset error message
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to search.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/auth/s`, {
        params: { searchTerm },
        headers: {
          Authorization: `Bearer ${token}` // Include the token if it exists
        }
      });
console.log(response);
console.log(location);

      if (response.data.courses) {
        setCourses(response.data.courses);  // Set the courses data to state
      } else {
        setCourses([]);  // Clear courses if no data found
      }
      window.history.pushState(
        null, 
        '', 
        `${location.pathname}?term=${encodeURIComponent(searchTerm)}`
      );
 
    } catch (err) {
      console.error(err);
      setError('Failed to fetch courses. Please try again later.');  // Handle error
    } finally {
      setLoading(false);  // Set loading to false after the request completes
    }
  };
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    if(!e.target.value){
      window.history.pushState(null, '', location.pathname);
    }
  };

  return (
  <Box
  sx={{
    minHeight: "90vh",
    bgcolor: "linear-gradient(135deg, #eef2ff, #e0e7ff, #c7d2fe)",
    py: 6,
    px: 2,
  }}
>
  {/* Heading */}
  <Box display="flex" justifyContent="center" mb={5}>
    <Typography
      component={motion.h2}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        color: "#1e3a8a",
        fontSize: { xs: "2rem", sm: "2.6rem" },
        fontWeight: "bold",
        letterSpacing: "0.02rem",
        textAlign: "center",
      }}
    >
      Our Courses
    </Typography>
  </Box>

  {/* Search Box */}
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    mb={6}
    gap={2}
    sx={{
      flexDirection: { xs: "column", sm: "row" },
      maxWidth: "800px",
      mx: "auto",
    }}
  >
    <TextField
      placeholder="Search courses by title or description"
      variant="outlined"
      value={searchTerm}
      onChange={handleSearchInputChange}
      sx={{
        width: { xs: "100%", sm: "70%" },
        bgcolor: "#fff",
        borderRadius: "10px",
      }}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handleSearch}
      sx={{
        borderRadius: "10px",
        px: 3,
        py: 1.2,
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        "&:hover": {
          background: "linear-gradient(135deg, #1e40af, #2563eb)",
        },
      }}
    >
      Search
    </Button>
  </Box>

  {/* Loading / Error */}
  {loading && (
    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
      <CircularProgress size={80} thickness={4.5} sx={{ color: "#1e3a8a" }} />
    </Box>
  )}
  {error && <Alert severity="error">{error}</Alert>}

  {/* Courses Grid */}
  <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
    <Grid container spacing={4}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <motion.div whileHover={{ scale: 1.05, y: -6 }}>
            <Card
              sx={{
                backdropFilter: "blur(16px)",
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                borderRadius: "18px",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
              }}
            >
              {/* Thumbnail */}
              <CardMedia
                component="img"
                alt={course.title}
                height="220"
                image={`http://localhost:5000/${course.courseThumbnail}`}
                sx={{ objectFit: "cover" }}
              />

              {/* Content */}
              <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                    color: "#1e3a8a",
                    mb: 1.5,
                    lineHeight: 1.4,
                  }}
                >
                  {course.title}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  <Chip
                    label={course.category}
                    sx={{
                      bgcolor: "#1e3a8a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                    }}
                  />
                  <Chip
                    label={course.courseLevel}
                    sx={{
                      bgcolor: "#3b82f6",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                    }}
                  />
                  <Chip
                    label={course.coursePrice > 0 ? `₹${course.coursePrice}` : "Free"}
                    sx={{
                      bgcolor: course.coursePrice > 0 ? "#3b82f6" : "#10b981",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                    }}
                  />
                </Box>

                {/* Stats */}
                <Typography sx={{ fontSize: "0.9rem", color: "#6B7280" }}>
                  Enrollments: {course.analytics.enrollments}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#6B7280", mb: 2 }}>
                  Rating: {course.analytics.averageRating}
                </Typography>

                {/* Actions */}
                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                      color: "#1e3a8a",
                      borderColor: "#1e3a8a",
                      borderRadius: "10px",
                      py: 1,
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#1e40af",
                        backgroundColor: "rgba(30,58,138,0.05)",
                      },
                    }}
                    onClick={() => HandDetali(course)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      flex: 1,
                      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      borderRadius: "10px",
                      py: 1,
                      fontWeight: 600,
                      "&:hover": {
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      },
                    }}
                    onClick={() => addToWishlist(course._id)}
                  >
                    Wishlist
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </Box>
</Box>


     
     
  );
};

export default CoursePage;
