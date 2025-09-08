import React, { useEffect, useState } from 'react';
import { getLectureById } from '../services/lectureService.js';
import {
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Container,
  Chip,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const LectureDetail = () => {
  const { id } = useParams(); // Get lecture ID from the route params
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming auth token is required
        setLoading(true);
        const data = await getLectureById(id, token);
        setLecture(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load lecture details');
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );

  if (!lecture)
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Typography variant="h6">Lecture details not available.</Typography>
      </div>
    );

  const isVideo = /\.(mp4|webm|ogg)$/i.test(lecture.video || '');

  return (
    <Container maxWidth="md" sx={{ padding: '2rem' }}>
      <Card
        sx={{
          boxShadow: 3,
          '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
          transition: 'all 0.3s ease',
        }}
      >
        {isVideo ? (
          <CardMedia
            component="video"
            src={`http://localhost:5000/${lecture.video.replace(/\\/g, '/')}`}
            controls
            title={lecture.title}
            style={{
              maxHeight: '400px',
              width: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              height: '400px',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Video not available
            </Typography>
          </div>
        )}

        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {lecture.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {lecture.description}
          </Typography>
          <Chip
            label={`Created By: ${lecture.createdBy?.name || 'Unknown'}`}
            size="medium"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`Email: ${lecture.createdBy?.email || 'Unknown'}`}
            size="medium"
            sx={{ mr: 1, mt: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate(-1)} // Navigate back to the previous page
          >
            Back to Lectures
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LectureDetail;
