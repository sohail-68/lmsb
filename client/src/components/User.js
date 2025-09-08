import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
  CardMedia,
  Chip,
  Stack,
} from '@mui/material';

const User = () => {
  const [courses, setCourses] = useState([]); // State to store courses with enrolled users

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await apiClient.get('/courses/userdata');
      setCourses(response.data.data); // Save the data to state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
console.log(courses);

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: '#121212', // Dark background
        color: '#e0e0e0', // Light text for better contrast
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        textAlign="center"
        sx={{ mb: 4, color: '#ffffff' }} // White title for better visibility
      >
        Courses and Enrolled Users
      </Typography>
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: '#1e1e1e', // Darker card background
                color: '#e0e0e0', // Light text
                boxShadow: '0px 4px 10px rgba(0,0,0,0.8)', // Subtle shadow for depth
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)', // Slight zoom on hover
                },
              }}
            >
              {/* Display the course thumbnail */}
              <CardMedia
                component="img"
                height="180"
                image={`http://localhost:5000/${course.courseThumbnail.replace(/\\/g, '/')}`}
                alt={`${course.title} Thumbnail`}
                sx={{
                  borderBottom: '4px solid #1976d2',
                }}
              />
              <CardContent>
                {/* Course Title */}
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#ffffff' }}>
                  {course.title}
                </Typography>
                {/* Category & Level Chips */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={course.category}
                    sx={{
                      backgroundColor: '#1976d2',
                      color: '#ffffff',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    label={course.courseLevel}
                    sx={{
                      backgroundColor: '#388e3c',
                      color: '#ffffff',
                      fontWeight: 'bold',
                    }}
                  />
                </Stack>
                {/* Course Details */}
                <Typography variant="body2" color="#bdbdbd" gutterBottom>
                  {course.description}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                  <strong>Price:</strong> ${course.coursePrice}
                </Typography>
                {/* Enrolled Users Section */}
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mt: 3, mb: 1, color: '#ffffff' }}
                >
                  Enrolled Users
                </Typography>
                {course.enrolledUsers.length > 0 ? (
                  course.enrolledUsers.map((user) => (
                    <Box
                      key={user._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        p: 1,
                        border: '1px solid #424242',
                        borderRadius: 2,
                        backgroundColor: '#212121', // Slightly lighter than main background
                      }}
                    >
                      <Avatar
                        sx={{
                          marginRight: 2,
                          backgroundColor: '#1976d2',
                          color: '#ffffff',
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#ffffff' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="#bdbdbd">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="#bdbdbd">
                    No users enrolled in this course.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default User;
