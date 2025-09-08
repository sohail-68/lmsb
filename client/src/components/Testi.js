import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, Card, CardContent, CardMedia, Avatar, Rating } from '@mui/material';
import { styled } from '@mui/system';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import img1 from "../images/1.jpg";
import img2 from "../images/2.jpg";
import img3 from "../images/3.jpg";
import img4 from "../images/4.jpg";
import img5 from "../images/5.jpg";
import img6 from "../images/6.jpg";
import img7 from "../images/7.jpg";

const testimonials = [
  {
    image: img1,
    name: "John Doe",
    feedback: "This is an amazing product! Highly recommend it.",
    rating: 5,
  },
  {
    image: img2,
    name: "Jane Smith",
    feedback: "Excellent customer service and great quality.",
    rating: 4,
  },
  {
    image: img3,
    name: "Michael Johnson",
    feedback: "I'm very satisfied with the results. Will buy again.",
    rating: 5,
  },
  {
    image: img4,
    name: "Emily Davis",
    feedback: "Fantastic experience. Totally worth the investment.",
    rating: 4,
  },
  {
    image: img7,
    name: "David Lee",
    feedback: "The quality exceeded my expectations. Very happy!",
    rating: 5,
  },
  {
    image: img6,
    name: "Sarah Brown",
    feedback: "A great value for money. I'll definitely recommend it.",
    rating: 4,
  },
];

const TestimonialCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
  },
}));

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    infinite: true, // Ensure the slides loop infinitely
    speed: 3000, // Set transition speed for smooth effect
    autoplay: true,
    autoplaySpeed: 1000, // Slide change interval
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,

    // centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          centerPadding: '30px',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: '20px',
        },
      },
    ],
    cssEase: "linear", // Smooth transition effect

  };

  return (
    <Box sx={{ width: '100%', padding: '60px 0', bgcolor: '#f4f6f8' }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          mb: 6,
          color: "#1e3a8a",
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontStyle: "italic",
          fontFamily: 'Roboto, sans-serif',
          '@media (maxWidth: 600px)': {
            fontSize: '0.5rem',
            mb: 4,
          }
        }}
      >
        What Our Clients Say
      </Typography>

      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <Box key={index} sx={{ p: 2 }}>
            <TestimonialCard
            sx={{
              borderRadius:"2rem"
            }}
            >
              <CardMedia
                component="img"
                height="200"
                image={testimonial.image}
                alt={`Testimonial ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ position: 'relative', pt: 7 }}>
                <Avatar
                  src={testimonial.image}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '4px solid white',
                    position: 'absolute',
                    top: -40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
                <Typography variant="h6" align="center" gutterBottom>
                  {testimonial.name}
                </Typography>
<Box sx={{
  display:"flex",justifyContent:"center",alignItems:"center"
}}>

                  <Rating value={testimonial.rating} readOnly sx={{ display: 'flex', justifyContent: 'center', mb: 2,alignItems:"center" }} />
</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems:"center", mb: 2 }}>
                  <FormatQuoteIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  "{testimonial.feedback}"
                </Typography>
              </CardContent>
            </TestimonialCard>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TestimonialSlider;
