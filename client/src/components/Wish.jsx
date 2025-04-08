import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Button, Typography, Grid, Avatar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Wish = () => {
  const [courses, setCourses] = useState([]); // State to store fetched data
const navigate=useNavigate()
  useEffect(() => {
    async function GETfe() {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/getwish", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses(response.data.courses); // Update state with fetched data
      } catch (error) {
        console.log(error); // Corrected typo
      }
    }

    GETfe(); // Call the function inside useEffect
  }, []); // Empty dependency array ensures this runs once when the component mounts
console.log(courses);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1e3a8a',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
        marginBottom: '30px',
      }}
    >
      Your Wishlist
    </Typography>
    <Grid container spacing={4}>
      {courses.length > 0 ? (
        courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                maxWidth: 345,
                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
                borderRadius: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000/${course.courseThumbnail}`}
                alt={course.title}
                sx={{
                  borderRadius: '8px',
                  margin: '10px',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <CardContent
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
                  padding: '16px',
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1e3a8a',
                    marginBottom: '8px',
                    textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
                  }}
                >
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    fontSize: '0.9rem',
                    color: '#6B7280',
                  }}
                >
                  {course.description.length > 100
                    ? `${course.description.slice(0, 100)}...`
                    : course.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', marginBottom: '8px' }}
                >
                  Level: <strong>{course.courseLevel}</strong>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: 'italic',
                    marginBottom: '16px',
                  }}
                >
                  Price: <strong>₹{course.coursePrice > 0 ? course.coursePrice : 'Free'}</strong>
                </Typography>
                {/* Users who added to wishlist */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#1e3a8a',
                  }}
                >
                  Added by:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    marginTop: 1,
                  }}
                >
                  {course.wishlistUsers.map((user) => (
                    <Box key={user._id} sx={{ textAlign: 'center', margin: '4px' }}>
                      <Avatar
                        alt={user.name}
                        src={`https://avatars.dicebear.com/api/human/${user._id}.svg`}
                        sx={{
                          width: 40,
                          height: 40,
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          color: '#6B7280',
                        }}
                      >
                        {user.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <Button
                variant="contained"
                sx={{
                  margin: 2,
                  backgroundColor: '#1e3a8a',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#123c7e',
                  },
                }}
                onClick={() => navigate(`/user/detail/${course._id}`)}
              >
                View Course
              </Button>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography
          variant="body1"
          sx={{
            color: '#6B7280',
            textAlign: 'center',
            marginTop: '40px',
            fontStyle: 'italic',
          }}
        >
          Nothing in wishlist yet.
        </Typography>
      )}
    </Grid>
  </div>
  
  );
};

export default Wish;
