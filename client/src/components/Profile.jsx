import React, { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { gsap } from 'gsap';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changeError, setChangeError] = useState(null);
  const [changeSuccess, setChangeSuccess] = useState(null);

  const cardRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch user profile
  async function fetchProfile() {
    try {
      const response = await fetch('https://lmsb-apt8.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProfile();

    // Card animation on mount
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 3, ease: 'power2.out' }
    );
  }, []);

  // Change Password Handler
  const handleChangePassword = async () => {
    setChangeError(null);
    setChangeSuccess(null);

    try {
      const response = await fetch('https://lmsb-apt8.onrender.com/api/auth/change-password', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      setChangeSuccess('Password changed successfully!');
      setModalOpen(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setChangeError(err.message);
    }
  };

  // Animate modal when it opens
  useEffect(() => {
    if (modalOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [modalOpen]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#eaeaea',
        padding: 2,
        perspective: '1000px',
      }}
    >
      <Card
        ref={cardRef}
        sx={{
          width: '80%',
          boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.3)',
          borderRadius: 3,
          padding: 2,
          transform: 'rotateX(5deg) rotateY(-3deg)',
          background: 'linear-gradient(145deg, #ffffff, #d7d7d7)',
          border: '1px solid #ccc',
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
          >
            Profile Details
          </Typography>

          {error ? (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          ) : profile ? (
            <Box>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Name:</strong> {profile.name}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Email:</strong> {profile.email}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Role:</strong> {profile.role}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Created At:</strong> {new Date(profile.createdAt).toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  marginBottom: 2,
                  background: 'linear-gradient(145deg, #6ac3ff, #0073e6)',
                  color: '#fff',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(145deg, #0073e6, #005bb5)',
                  },
                }}
                onClick={() => setModalOpen(true)}
              >
                Change Password
              </Button>

              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Enrolled Courses:
              </Typography>
              <List>
                {profile.enrolledCourses && profile.enrolledCourses.length > 0 ? (
                  profile.enrolledCourses.map((course) => (
                    <ListItem
                      key={course._id}
                      sx={{
                        borderBottom: '1px solid #ddd',
                        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        marginBottom: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}
                          >
                            {course.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">
                              <strong>Category:</strong> {course.category}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Language:</strong> {course.language}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Price:</strong> ${course.coursePrice}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Created At:</strong>{' '}
                              {new Date(course.createdAt).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                      <CardMedia
                        component="img"
                        alt={course.title}
                        image={`https://lmsb-apt8.onrender.com/${course.courseThumbnail}`}
                        sx={{
                          objectFit: 'cover',
                          width: 100,
                          height: 100,
                          borderRadius: '8px',
                          boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    No courses enrolled.
                  </Typography>
                )}
              </List>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
        ref={modalRef}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {changeError && <Alert severity="error">{changeError}</Alert>}
          {changeSuccess && <Alert severity="success">{changeSuccess}</Alert>}
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
