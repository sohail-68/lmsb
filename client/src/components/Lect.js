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
  //     await axios.delete(`https://lmsb-apt8.onrender.com/lecture/lecture/${id}`, {
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
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #e0f7fa)", // soft pastel
  }}
>
  {/* Course Title */}
  <Typography
    variant="h3"
    component="h1"
    gutterBottom
    sx={{
      textAlign: "center",
      fontWeight: "bold",
      color: "#1e3a8a",
      fontSize: { xs: "2rem", sm: "2.8rem" },
      mb: 6,
      textShadow: "2px 2px 6px rgba(0, 0, 0, 0.15)",
    }}
  >
    🎥 Lectures for Course
  </Typography>

  {/* Lectures Grid */}
  <Grid container spacing={4}>
    {lectures.map((lecture) => (
      <Grid item xs={12} sm={6} md={4} key={lecture._id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
            "&:hover": {
              transform: "translateY(-8px) scale(1.03)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            },
          }}
        >
          {ReactPlayer.canPlay(lecture.video) ? (
            <ReactPlayer
              url={`https://lmsb-apt8.onrender.com/${lecture.video.replace(/\\/g, "/")}`}
              controls
              width="100%"
              height="200px"
            />
          ) : (
            <Box
              sx={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                🎬 Video not available
              </Typography>
            </Box>
          )}
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1e3a8a", mb: 1 }}
            >
              {lecture.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {lecture.description}
            </Typography>
            <Chip
              label={`👨‍🏫 By: ${lecture.createdBy?.name || "Unknown"}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: "bold", mb: 2 }}
            />
            {progress.completedLectures.some((pro) => pro._id === lecture._id) ? (
              <Button variant="contained" color="success" fullWidth disabled>
                ✅ Completed
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => markLectureComplete(lecture._id)}
              >
                📌 Mark as Complete
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>

  {/* Course Progress */}
  <Box sx={{ mt: 8, textAlign: "center" }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        color: "#1e3a8a",
        mb: 4,
        textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
      }}
    >
      📊 Course Progress
    </Typography>

    {/* Linear Progress */}
    <Box
      sx={{
        mb: 6,
        maxWidth: "600px",
        mx: "auto",
        p: 2,
        borderRadius: "16px",
        background: "rgba(255,255,255,0.7)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={isNaN(progress.progressPercentage) ? 0 : parseFloat(progress.progressPercentage)}
        sx={{
          height: 12,
          borderRadius: 6,
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg,#1e3a8a,#3f51b5)",
          },
        }}
      />
      <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
        {isNaN(progress.progressPercentage)
          ? 0
          : Math.round(parseFloat(progress.progressPercentage))}
        % Completed
      </Typography>
    </Box>

    {/* Stats Cards */}
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} sm={4}>
        <ProgressCard
          sx={{
            background: "linear-gradient(135deg,#ede7f6,#d1c4e9)",
            boxShadow: "0 8px 25px rgba(103,58,183,0.2)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#673AB7" }}>
            ✅ Completed Lectures
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#673AB7" }}>
            {progress.completedCount}
          </Typography>
        </ProgressCard>
      </Grid>

      <Grid item xs={12} sm={4}>
        <ProgressCard
          sx={{
            background: "linear-gradient(135deg,#fff8e1,#ffe082)",
            boxShadow: "0 8px 25px rgba(255,193,7,0.2)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff8f00" }}>
            📚 Total Lectures
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#ff8f00" }}>
            {progress.totalLectures}
          </Typography>
        </ProgressCard>
      </Grid>

      <Grid item xs={12} sm={4}>
        <ProgressCard
          sx={{
            background: "linear-gradient(135deg,#e0f7fa,#80deea)",
            boxShadow: "0 8px 25px rgba(0,188,212,0.2)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0097a7" }}>
            🚀 Progress
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg,#0097a7,#00bcd4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {progress.progressPercentage}%
          </Typography>
        </ProgressCard>
      </Grid>
    </Grid>
  </Box>
</Box>

  

  );
};

export default Lect;
