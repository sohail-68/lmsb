import React, { useState, useEffect } from 'react';
import { 
  Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Box, Alert, Typography 
} from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const CreateCourse = () => {
  const location = useLocation();
  const existingCourse = location.state || {}; // Extract state from location for editing
  const isEditMode = Boolean(existingCourse._id); // Check if editing

  const [title, setTitle] = useState(existingCourse.title || '');
  const [description, setDescription] = useState(existingCourse.description || '');
  const [category, setCategory] = useState(existingCourse.category || '');
  const [courseLevel, setCourseLevel] = useState(existingCourse.courseLevel || '');
  const [coursePrice, setCoursePrice] = useState(existingCourse.coursePrice || '');
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    existingCourse.courseThumbnail
      ? `https://lmsb-apt8.onrender.com/${existingCourse.courseThumbnail.replace(/\\/g, '/')}`
      : null
  );

  // New fields
  const [discount, setDiscount] = useState(existingCourse.discount || 0);
  const [language, setLanguage] = useState(existingCourse.language || 'English');
  const [prerequisites, setPrerequisites] = useState(existingCourse.prerequisites || []);
  const [progressTracking, setProgressTracking] = useState(existingCourse.progressTracking || []);
  const [wishlistUsers, setWishlistUsers] = useState(existingCourse.wishlistUsers || []);
  const [certificates, setCertificates] = useState(existingCourse.certificates || []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setCourseThumbnail(null);
        setImagePreview(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        setCourseThumbnail(null);
        setImagePreview(null);
        return;
      }
      setCourseThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle prerequisites addition
  const handleAddPrerequisite = (prerequisite) => {
    if (prerequisite && !prerequisites.includes(prerequisite)) {
      setPrerequisites([...prerequisites, prerequisite]);
    }
  };

  // Handle prerequisites removal
  const handleRemovePrerequisite = (prerequisite) => {
    setPrerequisites(prerequisites.filter((item) => item !== prerequisite));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !courseLevel || !coursePrice) {
      setError('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('courseLevel', courseLevel);
    formData.append('coursePrice', coursePrice);
    formData.append('discount', discount);
    formData.append('language', language);
    formData.append('prerequisites', prerequisites.join(',')); // Ensure prerequisites are passed as a JSON string

    if (courseThumbnail) {
      formData.append('courseThumbnail', courseThumbnail);
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isEditMode) {
        // Update existing course
        await axios.put(`https://lmsb-apt8.onrender.com/api/courses/${existingCourse._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSuccess('Course updated successfully!');
      } else {
        // Create new course
        await axios.post('https://lmsb-apt8.onrender.com/api/courses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSuccess('Course created successfully!');
      }

      setLoading(false);
      // Reset form after submission
      setTitle('');
      setDescription('');
      setCategory('');
      setCourseLevel('');
      setCoursePrice('');
      setCourseThumbnail(null);
      setImagePreview(null);
      setDiscount(0);
      setLanguage('English');
      setPrerequisites([]);
      setProgressTracking([]);
      setWishlistUsers([]);
      setCertificates([]);
    } catch (err) {
      setLoading(false);
      setError('Error saving course. Please try again later.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            {isEditMode ? 'Edit Course' : 'Create Course'}
          </Typography>
        </Grid>

        {/* Course Title */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Course Title"
            variant="outlined"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={4}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category"
            variant="outlined"
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Grid>

        {/* Course Level */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Course Level</InputLabel>
            <Select
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value)}
              label="Course Level"
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Course Price */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Course Price"
            variant="outlined"
            margin="normal"
            type="number"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            required
          />
        </Grid>

        {/* Discount */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Discount (%)"
            variant="outlined"
            margin="normal"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Grid>

        {/* Language */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Language"
            variant="outlined"
            margin="normal"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </Grid>

        {/* Prerequisites */}
        <Grid item xs={12} sm={12}>
          <Box>
            <Typography variant="h6">Prerequisites</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                label="Add a prerequisite"
                variant="outlined"
                size="small"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPrerequisite(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </Box>
            <Box mt={1}>
              {prerequisites.map((prerequisite, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography>{prerequisite}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemovePrerequisite(prerequisite)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Image Upload */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Upload an Image
          </Typography>
          <Button variant="contained" component="label">
            Choose File
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </Button>
        </Grid>

        {imagePreview && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
        )}

        {/* Error or Success Messages */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {success && (
          <Grid item xs={12}>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}

        {/* Submit Button */}
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'Update Course' : 'Create Course'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateCourse;
