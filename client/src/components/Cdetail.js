import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Chip,
  Grid,
  CircularProgress,
  Stack
} from '@mui/material';

const Cdetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const Fetchdetails = async () => {
    try {
      const res = await axios.get(`https://lmsb-apt8.onrender.com/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Fetchdetails();
  }, []);
console.log(data);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return <Typography>Course not found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardMedia
          component="img"
          height="300"
                  image={`https://lmsb-apt8.onrender.com/${data.courseThumbnail.replace(/\\/g, '/')}`}

          alt={data.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {data.title}
          </Typography>
          <Stack direction="row" spacing={1} mb={2}>
            <Chip label={`Category: ${data.category}`} />
            <Chip label={`Level: ${data.courseLevel}`} color="primary" />
            <Chip label={`Language: ${data.language}`} />
          </Stack>
          <Typography variant="body1" mb={2}>
            {data.description}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Price:</Typography>
              <Typography variant="h6">${data.coursePrice}</Typography>
              <Typography variant="body2" color="green">Discount: ${data.discount}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Analytics:</Typography>
              <Typography>Enrollments: {data.analytics?.enrollments || 0}</Typography>
              <Typography>Rating: {data.analytics?.averageRating || 0} ⭐</Typography>
              <Typography>Completion Rate: {data.analytics?.completionRate || 0}%</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Cdetail;
