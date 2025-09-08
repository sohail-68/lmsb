import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';

const VideoContainer = styled('video')({
  width: '100%',
  height: '50vh',
  borderRadius: '8px',
  marginTop: '10px',
});

const LectureAll = () => {
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses/a', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setLectures(response.data.lectures);
      } catch (err) {
        console.error('Error fetching lectures:', err);
        setError('Unable to fetch lectures');
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}
      >
        All Lectures
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {lectures.map((lecture) => (
          <Grid item xs={12} sm={6} md={4} key={lecture._id}>
            <Card
              sx={{
                border: '1px solid #ddd',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 5,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {lecture.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {lecture.description}
                </Typography>
                <VideoContainer
                
                  controls
                  src={`http://localhost:5000/${lecture.video.replace(/\\/g, '/')}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 2 }}
                  href={`http://localhost:5000/${lecture.video.replace(/\\/g, '/')}`}
                  target="_blank"
                >
                  Watch Full Video
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LectureAll;
