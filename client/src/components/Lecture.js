import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CreateLecture = () => {
  const params = useParams();
  console.log(params);
  
  const location = useLocation();
  const states = location.state?.lecture || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (states) {
      setTitle(states.title || '');
      setDescription(states.description || '');
      setVideoPreview(
        states.video ? `http://localhost:5000/${states.video.replace(/\\/g, '/')}` : null
      );
    }
  }, [states]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('The selected file is not a valid video format.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('The video file size exceeds the 100MB limit.');
      return;
    }

    setVideoFile(file);
    setError('');
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (videoFile) {
      formData.append('video', videoFile);
    }

    try {
      if (!states) {
        formData.append('courseId', params.id);
        formData.append('type', 'lectureVideo');

        await axios.post('http://localhost:5000/lecture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((data)=>{
          console.log(data);
          
        })

        alert('Lecture created successfully');
      } else {
        await axios.put(`http://localhost:5000/lecture/lecture/${states._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        alert('Lecture updated successfully');
      }

      setSuccess(true);
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setVideoPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lecture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          boxShadow: 5,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 3,
              color: 'primary.main',
            }}
          >
            {states ? 'Update Lecture' : 'Create Lecture'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
              Lecture saved successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px dashed #ddd',
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                disabled={loading}
                style={{ flex: 1 }}
              />
            </Box>

            {videoPreview && (
              <Box
                sx={{
                  mt: 2,
                  textAlign: 'center',
                  borderRadius: 1,
                  p: 2,
                  border: '1px solid #ddd',
                  bgcolor: '#fafafa',
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Video Preview:
                </Typography>
                <video
                  src={videoPreview}
                  controls
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.2s ease',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : states ? 'Update Lecture' : 'Create Lecture'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateLecture;
