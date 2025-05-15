import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TablePagination,
  Box,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewListIcon from '@mui/icons-material/ViewList';
import AppsIcon from '@mui/icons-material/Apps';
import { useNavigate } from 'react-router-dom';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('learningm-production.up.railway.app/api/courses/admin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
console.log(courses);

  const handleEdit = (course) => {
    navigate('/admin/create-course', { state: course });
  };
  const handelQuize = (course) => {
    navigate(`/admin/createQuiz/${course}`);
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`learningm-production.up.railway.app/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCourses(courses.filter((course) => course._id !== id));
        alert('Course deleted successfully');
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  const handleViewLectures = (id) => {
    navigate(`/admin/lectures/${id}`);
  };

  const handleAddLecture = (id) => {
    navigate(`/admin/create-lecture/${id}`);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );

  return (
    <div style={{ padding: '2rem' }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}
      >
        Courses Management
      </Typography>

      {/* Toggle View Mode */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Tooltip title="Card View">
          <Button
            variant="contained"
            startIcon={<AppsIcon />}
            onClick={() => setViewMode('card')}
            color={viewMode === 'card' ? 'primary' : 'inherit'}
            sx={{ mr: 2 }}
          >
            Card View
          </Button>
        </Tooltip>
        <Tooltip title="Table View">
          <Button
            variant="contained"
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode('table')}
            color={viewMode === 'table' ? 'secondary' : 'inherit'}
          >
            Table View
          </Button>
        </Tooltip>
      </Box>

      {/* If there are no courses */}
      {courses.length === 0 && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 3 }}>
          No courses available.
        </Typography>
      )}

      {/* Card View */}
      {viewMode === 'card' ? (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: 2,
                  '&:hover': { boxShadow: 6, transform: 'scale(1.03)' },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`learningm-production.up.railway.app/${course.courseThumbnail.replace(/\\/g, '/')}`}
                  alt={`${course.title} Thumbnail`}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description?.length > 100
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={course.category || 'N/A'} color="primary" size="small" />
                    <Chip label={`Level: ${course.courseLevel}`} color="secondary" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={` ${course.language}`} color="secondary" size="small" />
                    <Chip label={`${course.discount}`} color="primary" size="small" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Price: ${course.coursePrice?.toFixed(2) || 'Free'}
                  </Typography>
                  <Badge badgeContent={course.enrolledStudents?.length || 0} color="primary">
                    <Typography variant="caption">Students Enrolled</Typography>
                  </Badge>
                </CardContent>
                <Box sx={{ p: 2, textAlign: 'center', mt: 'auto' }}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleViewLectures(course._id)}
                    sx={{ mr: 1 }}
                  >
                    View Lectures
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAddLecture(course._id)}
                  >
                    Add Lecture
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handelQuize(course._id)}
                  >
                  quize
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Table View
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Students Enrolled</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((course) => (
                  <TableRow key={course._id} hover>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      {course.description?.length > 50
                        ? `${course.description.substring(0, 50)}...`
                        : course.description}
                    </TableCell>
                    <TableCell>{course.category || 'N/A'}</TableCell>
                    <TableCell>{course.courseLevel}</TableCell>
                    <TableCell>${course.coursePrice?.toFixed(2) || 'Free'}</TableCell>
                    <TableCell>{course.enrolledStudents?.length || 0}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(course)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(course._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={courses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default CoursesList;
