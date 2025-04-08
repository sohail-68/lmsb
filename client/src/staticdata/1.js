import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Link } from '@mui/icons-material';
import { motion } from 'framer-motion'; // Im
const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // Track the current page
  const [itemsPerPage] = useState(2); // Set nu
  const [error, setError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [review, setReview] = useState({}); // Changed to an object to handle reviews for specific courses
  const navigate = useNavigate();

  function HandDetali(course){
    navigate(`/user/detail/${course._id}`)
  }
    const handleLevelFilterChange = (event) => {
    setSelectedLevel(event.target.value);
    // setCurrentPage()
  };

    // const filteredCourses = selectedLevel
    // ? courses.filter(course => course.courseLevel === selectedLevel)
    // : courses;

      // Handle the page change
  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage * itemsPerPage < courses.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Calculate the current page's courses
  const filteredCourses = selectedLevel
    ? courses.filter(course => course.courseLevel === selectedLevel)
    : courses;

  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", padding: "20px" }}>
    {/* Search Section */}
    <Box display="flex" justifyContent="center" mb={4}>
  <Typography component={"h2"} sx={{color:"GrayText",fontSize:"2rem",letterSpacing:"1rem"}}>Our Courses</Typography>
    </Box>
  
    {/* Loading & Error */}
    {loading && (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress size={80} thickness={4.5} sx={{ color: "#1e3a8a" }} />
      </Box>
    )}
    {error && <Alert severity="error">{error}</Alert>}
   {/* Filter by Level */}
   <Box display="flex" justifyContent="center" mb={4}>
        <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel id="level-filter-label">Filter by Level</InputLabel>
          <Select
            labelId="level-filter-label"
            id="level-filter"
            value={selectedLevel}
            onChange={handleLevelFilterChange}
            label="Filter by Level"
          >
            <MenuItem value="">
              <em>All Levels</em>
            </MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
            <MenuItem value="Expert">Expert</MenuItem>
          </Select>
        </FormControl>
      </Box>
    <Grid container spacing={4} sx={{ padding: "0 20px" }}>
  {currentCourses.map((course) => (
    <Grid item xs={12} sm={6} md={4} key={course._id}>
      <Card
        sx={{
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardMedia
          component="img"
          alt={course.title}
          height="350"
          image={`http://localhost:5000/${course.courseThumbnail}`}
          sx={{
            objectFit: "cover",
          }}
        />
        <CardContent sx={{ padding: "20px", bgcolor: "#F9FCFF", borderRadius: "10px" }}>
          {/* Title */}
     <Box sx={{display:'flex',gap:"0.4rem",alignItems:"center"}}>
          <Typography>Title</Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "700",
              color: "#1e3a8a", // Dark blue for title for better contrast
              lineHeight: "1.5",
              fontSize: "1.25rem",
              textTransform: "uppercase", // Gives it a modern, professional look
            }}
          >
            {course.title}
          </Typography>

     </Box>


          {/* Category Chip */}
     <Box sx={{display:'flex',gap:"0.4rem",alignItems:"center",mt:'0.4rem'}}>
           <Typography variant="body2" sx={{ fontWeight: "600", color: "#1e3a8a", marginBottom: "6px" }}>
            Category:
          </Typography>
          <Chip
            label={course.category}
            sx={{
              fontWeight: "600",
              fontSize: "0.95rem",
              color: "#fff",
              backgroundColor: "#1e3a8a", // Dark blue for category label
              padding: "6px 12px",
              marginBottom: "12px",
            }}
          />

     </Box>

     <Box sx={{display:'flex',gap:"0.4rem",alignItems:"center"}}>
     <Typography variant="body2" sx={{ fontWeight: "600", color: "#1e3a8a", marginBottom: "6px" }}>
            Level:
          </Typography>
          <Chip
            label={course.courseLevel}
            sx={{
              fontWeight: "600",
              fontSize: "0.95rem",
              color: "#fff",
              backgroundColor: "#3b82f6", // Lighter blue for level chip
              padding: "6px 12px",
              marginBottom: "12px",
            }}
          />
     </Box>

          {/* Level */}
    
          {/* Price */}
     <Box sx={{display:'flex',gap:"0.4rem",alignItems:"center"}}>
     <Typography variant="body2" sx={{ fontWeight: "600", color: "#1e3a8a", marginBottom: "6px" }}>
            Price:
          </Typography>
          <Chip
            label={course.coursePrice > 0 ? `₹${course.coursePrice}` : "Free"}
            sx={{
              fontWeight: "600",
              fontSize: "0.95rem",
              color: "#fff",
              backgroundColor: course.coursePrice > 0 ? "#3b82f6" : "#1e3a8a", // Lighter blue for paid, dark blue for free
              padding: "6px 12px",
              marginBottom: "12px",
            }}
          />
     </Box>

     

          {/* Analytics Section */}
          <Box sx={{ marginTop: "2px", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "0.95rem", color: "#6B7280" }}>
              Enrollments: {course.analytics.enrollments}
            </Typography>

            <Typography sx={{ fontSize: "0.95rem", color: "#6B7280" }}>
              Average Rating: {course.analytics.averageRating}
            </Typography>
          </Box>

          {/* Prerequisites */}
   

          {/* Review Section */}
          <Box sx={{ marginTop: "6px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#1e3a8a" }}>
              Add Your Review
            </Typography>
            <Rating
              value={review[course._id]?.rating || 0}
              onChange={(event, newValue) =>
                handleReviewChange(course._id, { target: { name: "rating", value: newValue } })
              }
              sx={{ color: "#3b82f6" }} // Lighter blue for rating stars
            />
            <TextField
              name="comment"
              value={review[course._id]?.comment || ""}
              onChange={(event) => handleReviewChange(course._id, event)}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              sx={{
                marginTop: "4px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  borderColor: "#3b82f6", // Lighter blue border for the comment box
                },
              }}
              placeholder="Write a comment..."
            />
            {course.enrolledUsers.includes(localStorage.getItem("userid")) && (
              <Button
                variant="contained"
                sx={{
                  marginTop: "16px",
                  backgroundColor: "#1e3a8a", // Dark blue
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#123c7e",
                  },
                }}
                onClick={() => handleReviewSubmit(course._id)}
              >
                Submit Review
              </Button>
            )}
          </Box>

          {/* Buttons */}
          <Box sx={{ marginTop: "16px", display: "flex", justifyContent: "space-between" ,

flexDirection:{
 xl:"row",
 xs:"column",
},
gap:{
  xl:"0",
  xs:"1rem",
 }
          }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3b82f6", // Lighter blue for the button
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#123c7e" },
                padding: "8px 16px", // Padding for a more balanced button
              }}
              onClick={() => enrollInCourse(course)}
            >
              Enroll
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "#1e3a8a", // Dark blue for the button
                borderColor: "#1e3a8a",
                borderRadius: "8px",
                "&:hover": { borderColor: "#123c7e", color: "#123c7e" },
                padding: "8px 16px",
              }}
              onClick={() => HandDetali(course)}
            >
              Details
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3b82f6", // Lighter blue for the button
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#123c7e" },
                padding: "8px 16px",
              }}
              onClick={() => addToWishlist(course._id)}
            >
              Add to Wishlist
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

   {/* Pagination */}
 {/* Pagination */}
<Box display="flex" justifyContent="center" mt={4} sx={{ alignItems: "center" }}>
  {/* Previous Button */}
  <Button
    variant="outlined"
    disabled={currentPage === 1}
    onClick={() => handlePageChange('prev')}
    sx={{ marginRight: 2 }}
  >
    Previous
  </Button>

  {/* Page Range Display */}
  <Typography sx={{ fontWeight: '600', margin: "0 20px" }}>
    {`Page ${currentPage} of ${Math.ceil(filteredCourses.length / itemsPerPage)}`}
  </Typography>

  {/* Next Button */}
  <Button
    variant="outlined"
    disabled={currentPage * itemsPerPage >= filteredCourses.length}
    onClick={() => handlePageChange('next')}
  >
    Next
  </Button>
</Box>

{/* Optional: You can also display specific page numbers in a range (optional) */}
<Box display="flex" justifyContent="center" mt={2}>
  {Array.from({ length: Math.ceil(filteredCourses.length / itemsPerPage) }, (_, index) => index + 1).map(page => (
    <Button
      key={page}
      variant={page === currentPage ? "contained" : "outlined"}
      sx={{ margin: "0 5px" }}
      onClick={() => setCurrentPage(page)}
    >
      {page}
    </Button>
  ))}
</Box>


  </Box>
  
  
  );
};

export default CoursePage;
