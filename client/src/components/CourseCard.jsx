import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const CardContentStyled = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const CourseTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const CourseDescription = styled(Typography)({
  flexGrow: 1,
});

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.secondary.main,
  marginTop: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 'bold',
  borderRadius: theme.shape.borderRadius * 3,
}));

const CourseCard = ({ course, onEnroll, onShowLectures, isEnrolled }) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="200"
        image={`learningm-production.up.railway.app/${course.courseThumbnail}`}
        alt={course.title}
      />
      <CardContentStyled>
        <CourseTitle variant="h6" gutterBottom>
          {course.title}
        </CourseTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip label={course.category} color="primary" size="small" />
          <Typography variant="body2" color="textSecondary">
            Level: {course.courseLevel}
          </Typography>
        </Box>
        <CourseDescription variant="body2" color="textSecondary">
          {course.description}
        </CourseDescription>
        <Typography variant="caption" color="textSecondary" mt={2}>
          Created by: {course.createdBy.name}
        </Typography>
        <PriceTypography variant="subtitle1">
          {course.coursePrice > 0 ? `₹${course.coursePrice}` : 'Free'}
        </PriceTypography>
        <ActionButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onEnroll(course)}
        >
          {course.coursePrice > 0 ? 'Buy Now' : 'Enroll Now'}
        </ActionButton>
        {isEnrolled && (
          <ActionButton
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => onShowLectures(course._id)}
          >
            Show Lectures
          </ActionButton>
        )}
      </CardContentStyled>
    </StyledCard>
  );
};

export default CourseCard;

