import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Home from "../images/7.jpg";

const Feature = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: {
          lg: 'row',
          xl: 'row',
          xs: 'column',
        },
        gap: {
          md: '5rem',
          xs: '1rem',
        },
        height: {
          xl: '100vh',
        },
        padding: 4,
        background: 'linear-gradient(to bottom right, #eceff1, #ffffff)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorations */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(30,58,138,0.5) 0%, rgba(30,58,138,0) 70%)',
          borderRadius: '50%',
          zIndex: 1,
        }}
        animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,136,0,0.3) 0%, rgba(255,136,0,0) 70%)',
          borderRadius: '50%',
          zIndex: 1,
        }}
        animate={{ x: [0, 20, -20, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Left Section (Text and List) */}
      <motion.Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          maxWidth: '600px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: 4,
          borderRadius: '12px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          zIndex: 2,
        }}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: 2,
            fontSize: { xs: '1.8rem', sm: '2rem', lg: '2.5rem' },
          }}
        >
          Earn more with Graphy Assist
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#555',
            marginBottom: 3,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
          }}
        >
          Supercharge your business with automation tools and earn up to 10% more effortlessly.
        </Typography>

        {/* List of Features */}
        <motion.List
          sx={{ paddingLeft: 2 }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ListItem
            sx={{
              borderBottom: '1px solid #ddd',
              paddingBottom: 1,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <ListItemText primary="Drive more traffic with SEO-optimized websites" sx={{ color: '#555' }} />
          </ListItem>
          <ListItem
            sx={{
              borderBottom: '1px solid #ddd',
              paddingBottom: 1,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <ListItemText primary="Build trust & create urgency with social proof & offers" sx={{ color: '#555' }} />
          </ListItem>
          <ListItem
            sx={{
              borderBottom: '1px solid #ddd',
              paddingBottom: 1,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <ListItemText primary="Maximize conversions with automated funnels & reminders" sx={{ color: '#555' }} />
          </ListItem>
        </motion.List>
      </motion.Box>

      {/* Right Section (Image) */}
      <motion.Box
        sx={{
          textAlign: 'center',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 2,
        }}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={Home}
          loading="lazy" 
          alt="Graphy Assist Feature"
          style={{
            width: '100%',
            objectFit: 'cover',
            height: '70vh',
            borderRadius: '12px',
          }}
        />
      </motion.Box>
    </Box>
  );
};

export default Feature;
