import React from "react";
import Slider from "react-slick";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";

const HomeCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const carouselData = [
    {
      id: 1,
      image: img,
      title: "Learn Anytime, Anywhere",
      description: "Access high-quality learning content from anywhere in the world.",
    },
    {
      id: 2,
      image: img2,
      title: "Interactive Classes",
      description: "Engage in interactive video lectures and live classes.",
    },
    {
      id: 3,
      image: img3,
      title: "Collaborative Learning",
      description: "Learn and grow together with peers and instructors.",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7fafc",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          width: "100%",
          overflow: "hidden",
          "& .slick-list": {
            overflow: "hidden",
            borderRadius: "1.5rem",
          },
          "& .slick-slide > div": {
            display: "flex",
            justifyContent: "center",
          },
          "& .slick-dots": {
            bottom: "10px",
            "& li button:before": {
              color: "#1e3a8a",
              fontSize: "12px",
            },
          },
        }}
      >
        <Slider {...settings}>
          {carouselData.map((slide) => (
            <Card
              key={slide.id}
              sx={{
                position: "relative",
                borderRadius: "1.5rem",
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardMedia
                component="img"
                image={slide.image}
                alt={slide.title}
                sx={{
                  objectFit: "cover",
                  height: {
                    xs: "50vh", // Mobile
                    sm: "60vh", // Tablet
                    md: "70vh", // Desktop
                  },
                }}
              />
              <CardContent
                sx={{
                  position: "absolute",
                  bottom: {
                    xs: "1rem", // Mobile
                    sm: "2rem", // Tablet
                    md: "4rem", // Desktop
                  },
                  left: {
                    xs: "1rem",
                    sm: "2rem",
                    md: "4rem",
                  },
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "#000",
                  padding: {
                    xs: "1rem",
                    sm: "1.5rem",
                    md: "2rem",
                  },
                  borderRadius: "1rem",
                  maxWidth: {
                    xs: "80%",
                    sm: "70%",
                    md: "50%",
                  },
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                {slide.title && (
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      fontSize: {
                        xs: "1.2rem", // Mobile
                        sm: "1.5rem", // Tablet
                        md: "2rem", // Desktop
                      },
                      lineHeight: 1.3,
                    }}
                  >
                    {slide.title}
                  </Typography>
                )}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: {
                      xs: "0.8rem", // Mobile
                      sm: "1rem", // Tablet
                      md: "1.2rem", // Desktop
                    },
                    lineHeight: 1.5,
                  }}
                >
                  {slide.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default HomeCarousel;
