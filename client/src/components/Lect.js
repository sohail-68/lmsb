import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import {
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  Snackbar,
  LinearProgress,
  Paper,
  styled,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getLecturesForCourse } from '../services/lectureService.js';
import { getProgress, updateProgress } from '../api/Proapi.js';
import axios from 'axios';

const Lect = () => {
  const { id: courseId } = useParams(); // Simplified destructuring
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [progress, setProgress] = useState({
    completedCount: 0,
    totalLectures: 0,
    progressPercentage: 0,
    completedLectures: [],
  });

  // Fetch progress for the course
  const fetchProgress = async () => {
    try {
      const data = await getProgress(courseId);
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };
console.log(progress);

  // Fetch lectures for the course
  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      const data = await getLecturesForCourse(courseId, token);
      setLectures(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load lectures');
      setLoading(false);
    }
  };
console.log(lectures);

  // Mark a lecture as complete
  const markLectureComplete = async (lectureId) => {
    try {
      await updateProgress(courseId, lectureId);
      fetchProgress(); // Refresh progress after marking complete
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  // Delete a lecture
  // const handleDeleteLecture = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/lecture/lecture/${id}`, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //     });
  //     setLectures((prevLectures) => prevLectures.filter((lecture) => lecture._id !== id));
  //     setSnackbarMessage('Lecture deleted successfully!');
  //     setSnackbarSeverity('success');
  //     setOpenSnackbar(true);
  //   } catch (err) {
  //     setSnackbarMessage('Failed to delete the lecture.');
  //     setSnackbarSeverity('error');
  //     setOpenSnackbar(true);
  //   }
  // };

  const handleCloseSnackbar = () => setOpenSnackbar(false);
console.log(progress);

  // Fetch data on mount
  useEffect(() => {
    if (courseId) {
      fetchProgress();
      fetchLectures();
    }
  }, [courseId]);
  console.log(
  progress.completedLectures.some((com)=>com._id===lectures._id)

  );
  
const ProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  textAlign: 'center',
  background: '#ffffff',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    transform: 'scale(1.05)',
  },
}));

  if (loading)
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (lectures.length === 0)
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No lectures found for this course.
        </Typography>
      </Box>
    );

  return (
    <Box
    sx={{
      py: 6,
      px: { xs: 2, sm: 4 },
      bgcolor: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
      minHeight: '100vh',
      perspective: '1000px',
    }}
  >
    {/* Course Title */}
    <Typography
      variant="h4"
      component="h1"
      gutterBottom
      sx={{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#3f51b5',
        fontSize: { xs: '1.8rem', sm: '2.5rem' },
        mb: 4,
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      Lectures for Course
    </Typography>
  
    {/* Lectures Grid */}
    <Grid container spacing={4}>
      {lectures.map((lecture) => (
        <Grid item xs={12} sm={6} md={4} key={lecture._id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 4,
              borderRadius: '16px',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease, box-shadow 0.5s ease',
              '&:hover': {
                boxShadow: 12,
                transform: 'rotateY(10deg) translateZ(20px)',
              },
            }}
          >
            {ReactPlayer.canPlay(lecture.video) ? (
              <ReactPlayer
                url={`http://localhost:5000/${lecture.video.replace(/\\/g, '/')}`}
                controls
                width="100%"
                height="200px"
              />
            ) : (
              <Box
                sx={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Video not available
                </Typography>
              </Box>
            )}
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {lecture.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {lecture.description}
              </Typography>
              <Chip
                label={`Created By: ${lecture.createdBy?.name || 'Unknown'}`}
                color="primary"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                {progress.completedLectures.some((pro) => pro._id === lecture._id) ? (
                  <Button variant="contained" color="success" fullWidth disabled>
                    Completed
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => markLectureComplete(lecture._id)}
                  >
                    Mark as Complete
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  
    {/* Course Progress */}
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#3f51b5',
          mb: 3,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        Course Progress
      </Typography>
      {/* Linear Progress Bar */}
      <Box
        sx={{
          mb: 4,
          boxShadow: 3,
          p: 2,
          borderRadius: 3,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={isNaN(progress.progressPercentage) ? 0 : parseFloat(progress.progressPercentage)}
          sx={{
            width: '100%',
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': { backgroundColor: '#3f51b5' },
          }}
        />
        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
          {isNaN(progress.progressPercentage)
            ? 0
            : Math.round(parseFloat(progress.progressPercentage))}% Complete
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
  {/* Completed Lectures */}
  <Grid item xs={12} sm={4}>
  <ProgressCard
    sx={{
      background: 'linear-gradient(135deg, #ede7f6, #d1c4e9)', // Soft Purple
      boxShadow: '0 5px 15px rgba(103, 58, 183, 0.2)',
      p: 3,
      borderRadius: '16px',
      textAlign: 'center',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 10px 20px rgba(103, 58, 183, 0.3)',
      },
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#673AB7' }}>
      ✅ Completed Lectures
    </Typography>
    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#673AB7' }}>
      {progress.completedCount} 🎓
    </Typography>
  </ProgressCard>
</Grid>

{/* Total Lectures */}
<Grid item xs={12} sm={4}>
  <ProgressCard
    sx={{
      background: 'linear-gradient(135deg, #ffecb3, #ffd54f)', // Golden Yellow
      boxShadow: '0 5px 15px rgba(255, 193, 7, 0.2)',
      p: 3,
      borderRadius: '16px',
      textAlign: 'center',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)',
      },
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FFC107' }}>
      📚 Total Lectures
    </Typography>
    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFC107' }}>
      {progress.totalLectures} 📖
    </Typography>
  </ProgressCard>
</Grid>

{/* Progress Percentage */}
<Grid item xs={12} sm={4}>
  <ProgressCard
    sx={{
      background: 'linear-gradient(135deg, #e0f7fa, #80deea)', // Teal Blue
      boxShadow: '0 10px 30px rgba(0, 188, 212, 0.2)',
      borderRadius: '16px',
      p: 3,
      textAlign: 'center',
      transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05) translateY(-5px)',
        boxShadow: '0 15px 40px rgba(0, 188, 212, 0.3)',
      },
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: 'bold',
        color: '#00ACC1',
        textShadow: '2px 2px 5px rgba(0, 188, 212, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      🚀 Progress
    </Typography>
    <Typography
      variant="h3"
      sx={{
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #00ACC1, #0097A7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '3px 3px 10px rgba(0, 0, 0, 0.1)',
        mt: 1,
      }}
    >
      {progress.progressPercentage}% 🎯
    </Typography>
  </ProgressCard>
</Grid>



</Grid>

    </Box>
  
    {/* Snackbar for Alerts */}
    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        sx={{ width: '100%' }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </Box>
  

  );
};

export default Lect;
