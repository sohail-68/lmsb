import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card sx={{ maxWidth: 345, minWidth: 300 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Icon sx={{ fontSize: 48, mr: 2 }} />
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;