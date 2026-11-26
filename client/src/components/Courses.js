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
  Stack,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  InfoOutlined,
  Star,
  PlayCircleOutline,
  PeopleAlt,
  VerifiedUser,
  WorkspacePremium,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import apiClient from "../api/apiClient";

// ─── Theme Tokens (matches your Navbar & Feature) ───
const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  accent: "#8b5cf6",
  text: "#0f172a",
  textMuted: "#64748b",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  shadow: "rgba(79, 70, 229, 0.25)",
};

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState({});
  const [wishlist, setWishlist] = useState({}); // track wishlist locally
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Fetch Courses ───
  const fetchCourses = async () => {
    try {
      const response = await apiClient.get("/courses");
      setCourses(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ─── Review Handler ───
  const handleReviewChange = (courseId, field, value) => {
    setReview((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (courseId) => {
    const courseReview = review[courseId];
    if (!courseReview || !courseReview.rating || !courseReview.comment?.trim()) {
      toast.warn("Please provide both rating and comment.");
      return;
    }

    try {
      const response = await apiClient.post(`/courses/${courseId}/review`, courseReview);
      toast.success(response.data.message || "Review submitted!");
      setReview((prev) => ({
        ...prev,
        [courseId]: { rating: 0, comment: "" },
      }));
    } catch (err) {
      toast.error("Failed to submit review.");
    }
  };

  // ─── Enroll Handler ───
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
              const verifyRes = await apiClient.post(`/courses/verify-payment`, {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                courseId: orderData.courseId,
              });
              toast.success(verifyRes.data.message);
              navigate(`/user/lect/${course._id}`);
            } catch (err) {
              console.error("Payment Verification Failed:", err);
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: { color: COLORS.primary },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.success(`Enrolled in "${course.title}"!`);
        navigate(`/user/lect/${course._id}`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info(error.response.data.message || "Already enrolled");
        navigate(`/user/lect/${course._id}`);
      } else {
        console.error("Enrollment Error:", error);
        toast.error("Enrollment failed.");
      }
    }
  };

  // ─── Wishlist Handler ───
  const addToWishlist = async (courseId) => {
    try {
      const response = await apiClient.post(
        `/courses/${courseId}/wishlist`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const message = response.data.message;
      if (message === "Added to wishlist") {
        setWishlist((prev) => ({ ...prev, [courseId]: true }));
        toast.success("Added to your wishlist!");
      } else if (message === "Removed from wishlist") {
        setWishlist((prev) => ({ ...prev, [courseId]: false }));
        toast.success("Removed from your wishlist!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist update failed");
    }
  };

  const goToDetails = (course) => {
    navigate(`/user/detail/${course._id}`);
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: COLORS.primary }}
        />
        <Typography sx={{ color: COLORS.textMuted, fontWeight: 500 }}>
          Loading your courses...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 6 },
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ═══ Page Header ═══ */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.75rem", md: "0.85rem" },
            fontWeight: 700,
            color: COLORS.primary,
            textTransform: "uppercase",
            letterSpacing: 2,
            mb: 1,
          }}
        >
          Explore Our Library
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: 800,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            background: COLORS.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 1.5,
          }}
        >
          Discover Your Next Course
        </Typography>
        <Typography
          sx={{
            color: COLORS.textMuted,
            fontSize: { xs: "0.9rem", md: "1.05rem" },
            maxWidth: 560,
            mx: "auto",
          }}
        >
          Learn from world-class instructors, master new skills, and advance your career.
        </Typography>
      </Box>

      {/* ═══ Error ═══ */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, maxWidth: 700, mx: "auto", borderRadius: "12px" }}
        >
          {error}
        </Alert>
      )}

      {/* ═══ Courses Grid ═══ */}
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        sx={{ maxWidth: 1400, mx: "auto" }}
      >
        {courses.length === 0 && !loading && (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                bgcolor: "#fff",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
              }}
            >
              <Typography variant="h6" sx={{ color: COLORS.textMuted }}>
                No courses found
              </Typography>
            </Box>
          </Grid>
        )}

        {courses.map((course, index) => {
          const isEnrolled = course.enrolledUsers?.includes(
            localStorage.getItem("userid")
          );
          const currentReview = review[course._id] || { rating: 0, comment: "" };
          const isWishlisted = wishlist[course._id];

          return (
            <Grid item xs={12} sm={6} lg={4} key={course._id}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 20px 40px ${COLORS.shadow}`,
                    "& .course-image": { transform: "scale(1.08)" },
                  },
                }}
              >
                {/* ─── Image with Overlay Badges ─── */}
                <Box sx={{ position: "relative", overflow: "hidden", height: 220 }}>
                  <CardMedia
                    className="course-image"
                    component="img"
                    alt={course.title}
                    image={`https://lmsb-apt8.onrender.com/${course.courseThumbnail}`}
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />

                  {/* Gradient overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 50%)",
                    }}
                  />

                  {/* Price badge (top-left) */}
                  <Chip
                    label={
                      course.coursePrice > 0
                        ? `₹${course.coursePrice}`
                        : "FREE"
                    }
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background:
                        course.coursePrice > 0 ? COLORS.gradient : "#10b981",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      borderRadius: "8px",
                      height: 28,
                      px: 1,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />

                  {/* Wishlist icon (top-right) */}
                  <IconButton
                    onClick={() => addToWishlist(course._id)}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(8px)",
                      width: 38,
                      height: 38,
                      "&:hover": { background: "#fff" },
                    }}
                  >
                    {isWishlisted ? (
                      <Favorite sx={{ color: "#e11d48", fontSize: 20 }} />
                    ) : (
                      <FavoriteBorder
                        sx={{ color: COLORS.textMuted, fontSize: 20 }}
                      />
                    )}
                  </IconButton>

                  {/* Category + level chips (bottom-left overlay) */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", bottom: 12, left: 12 }}
                  >
                    <Chip
                      icon={<WorkspacePremium sx={{ fontSize: "14px !important", color: "#fff !important" }} />}
                      label={course.category}
                      size="small"
                      sx={{
                        background: "rgba(255,255,255,0.25)",
                        backdropFilter: "blur(10px)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    />
                    <Chip
                      label={course.courseLevel}
                      size="small"
                      sx={{
                        background: "rgba(255,255,255,0.25)",
                        backdropFilter: "blur(10px)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    />
                  </Stack>
                </Box>

                {/* ─── Content ─── */}
                <CardContent
                  sx={{
                    p: 2.5,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    "&:last-child": { pb: 2.5 },
                  }}
                >
                  {/* Title */}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: COLORS.text,
                      lineHeight: 1.3,
                      mb: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.6em",
                    }}
                  >
                    {course.title}
                  </Typography>

                  {/* Stats row */}
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <PeopleAlt sx={{ fontSize: 16, color: COLORS.textMuted }} />
                      <Typography
                        sx={{ fontSize: "0.8rem", color: COLORS.textMuted, fontWeight: 500 }}
                      >
                        {course.analytics?.enrollments || 0} enrolled
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: "#fbbf24" }} />
                      <Typography
                        sx={{ fontSize: "0.8rem", color: COLORS.text, fontWeight: 600 }}
                      >
                        {course.analytics?.averageRating?.toFixed(1) || "0.0"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {/* ─── Review Section (only if enrolled) ─── */}
                  {isEnrolled ? (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: COLORS.text,
                          mb: 1,
                        }}
                      >
                        Rate this course
                      </Typography>
                      <Rating
                        value={currentReview.rating}
                        onChange={(e, val) => handleReviewChange(course._id, "rating", val)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        value={currentReview.comment}
                        onChange={(e) =>
                          handleReviewChange(course._id, "comment", e.target.value)
                        }
                        variant="outlined"
                        multiline
                        rows={2}
                        fullWidth
                        size="small"
                        placeholder="Share your experience..."
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            backgroundColor: "#f8fafc",
                          },
                        }}
                      />
                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        onClick={() => handleReviewSubmit(course._id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderColor: COLORS.primary,
                          color: COLORS.primary,
                          borderRadius: "10px",
                          "&:hover": {
                            borderColor: COLORS.primaryDark,
                            backgroundColor: "rgba(79,70,229,0.04)",
                          },
                        }}
                      >
                        Submit Review
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: "10px",
                        background: "#f8fafc",
                        border: "1px dashed #cbd5e1",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.75rem", color: COLORS.textMuted, fontWeight: 500 }}
                      >
                        🔒 Enroll to leave a review
                      </Typography>
                    </Box>
                  )}

                  {/* ─── Action Buttons ─── */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: "auto",
                    }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<InfoOutlined />}
                      onClick={() => goToDetails(course)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        borderColor: "#cbd5e1",
                        color: COLORS.textMuted,
                        borderRadius: "10px",
                        py: 1,
                        "&:hover": {
                          borderColor: COLORS.primary,
                          color: COLORS.primary,
                          backgroundColor: "rgba(79,70,229,0.04)",
                        },
                      }}
                    >
                      Details
                    </Button>

                    {isEnrolled ? (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayCircleOutline />}
                        onClick={() => navigate(`/user/lect/${course._id}`)}
                        sx={{
                          background: COLORS.gradient,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          borderRadius: "10px",
                          py: 1,
                          boxShadow: `0 4px 12px ${COLORS.shadow}`,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                          },
                        }}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => enrollInCourse(course)}
                        sx={{
                          background: COLORS.gradient,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          borderRadius: "10px",
                          py: 1,
                          boxShadow: `0 4px 12px ${COLORS.shadow}`,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                          },
                        }}
                      >
                        {course.coursePrice > 0 ? "Enroll" : "Enroll Free"}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CoursePage;
