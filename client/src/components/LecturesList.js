import React, { useEffect, useState } from 'react';
import { getLecturesForCourse } from '../services/lectureService.js';
import {
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Box,
  Snackbar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LecturesList = () => {
  const params = useParams();
  const courseId = params.id;

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem('token');
        setLoading(true);
        const data = await getLecturesForCourse(courseId, token);
        console.log(data);
        
        setLectures(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load lectures');
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId]);

  const jandelde = async (id) => {
    setOpenSnackbar(true);

    try {
      const deldata = await axios.delete(`https://lmsb-apt8.onrender.com/lecture/lecture/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Delete response:', deldata);

      // Update state to remove the deleted lecture from the list
      setLectures(lectures.filter((lecture) => lecture._id !== id));

      // Show success Snackbar
      setSnackbarMessage('Lecture deleted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(false);
    } catch (error) {
      console.error('Error deleting lecture:', error);

      // Show error Snackbar
      setSnackbarMessage('Failed to delete the lecture.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
console.log(lectures);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <CircularProgress size={60} color="primary" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );

  if (lectures.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Typography variant="h6" color="textSecondary">
          No lectures found for this course.
        </Typography>
      </div>
    );

  return (
    <div style={{ padding: '2rem' }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          mb: 5,
          fontWeight: 'bold',
          color: '#3f51b5',
        }}
      >
        Lectures for Course
      </Typography>
      <Grid container spacing={4}>
        {lectures.map((lecture) => {
          const isVideo = /\.(mp4|webm|ogg)$/i.test(lecture.video || '');

          const videoContent = isVideo ? (
            <CardMedia
              component="video"
              src={`https://lmsb-apt8.onrender.com/${lecture.video.replace(/\\/g, '/')}`}
              controls
              title={lecture.title}
              style={{
                minHeight: '200px',
                maxWidth: '100%',
                border: 'none',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                minHeight: '200px',
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Video not available
              </Typography>
            </div>
          );

          return (
            <Grid item xs={12} sm={6} md={4} key={lecture._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {videoContent}
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold', color: '#3f51b5' }}
                  >
                    {lecture.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, fontSize: '0.9rem', lineHeight: '1.5' }}
                  >
                    {lecture.description}
                  </Typography>
                  <Chip
                    label={`Created By: ${lecture.createdBy?.name || 'Unknown'}`}
                    size="small"
                    sx={{
                      mr: 1,
                      backgroundColor: '#3f51b5',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        mb: 2,
                        '&:hover': { backgroundColor: '#303f9f' },
                      }}
                      onClick={() => navigate(`/admin/detail/${lecture._id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{
                        mb: 2,
                        '&:hover': { backgroundColor: '#f1f1f1' },
                      }}
                      onClick={() =>
                        navigate(`/admin/create-lecture/${lecture._id}`, {
                          state: { lecture },
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      sx={{
                        '&:hover': { backgroundColor: '#ff4f4f' },
                      }}
                      onClick={() => jandelde(lecture._id)} // Delete button
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Snackbar for delete success or error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LecturesList;
