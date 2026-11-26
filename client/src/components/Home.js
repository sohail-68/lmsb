import React from "react";
import Slider from "react-slick";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import { ArrowForward, PlayCircleOutline, Star } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";

const HomeCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,           // ✅ Smooth premium fade
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    arrows: false,        // Custom arrows optional
    pauseOnHover: true,
  };

  const carouselData = [
    {
      id: 1,
      image: img,
      tag: "New Batch Starting",
      title: "Learn Anytime, Anywhere",
      description:
        "Access high-quality learning content from anywhere in the world. Trusted by 50,000+ learners.",
      rating: 4.9,
      cta: "Explore Courses",
    },
    {
      id: 2,
      image: img2,
      tag: "Live Sessions",
      title: "Interactive Live Classes",
      description:
        "Engage in real-time video lectures, ask questions, and get instant feedback from experts.",
      rating: 4.8,
      cta: "Join Live Class",
    },
    {
      id: 3,
      image: img3,
      tag: "Community Learning",
      title: "Learn Together, Grow Faster",
      description:
        "Collaborate with peers, join study groups, and build your network while you learn.",
      rating: 4.9,
      cta: "Start Learning",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        background: "#f8fafc",
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          borderRadius: { xs: "16px", md: "24px" },
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",

          // Slick styling
          "& .slick-list": { borderRadius: "inherit", overflow: "hidden" },
          "& .slick-slide > div": { display: "flex" },
          "& .slick-dots": {
            bottom: { xs: 12, md: 24 },
            "& li button:before": {
              color: "#fff",
              fontSize: 10,
              opacity: 0.5,
            },
            "& li.slick-active button:before": {
              opacity: 1,
              color: "#fff",
            },
          },
        }}
      >
        <Slider {...settings}>
          {carouselData.map((slide) => (
            <Box key={slide.id}>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: "70vh", sm: "65vh", md: "80vh" },
                  minHeight: { xs: 500, md: 580 },
                  display: "flex",
                  alignItems: "flex-end",
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.2) 100%)",
                  }}
                />

                {/* Content */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    p: { xs: 3, sm: 5, md: 8 },
                    maxWidth: { xs: "100%", md: "60%" },
                  }}
                >
                  {/* Tag Chip */}
                  <Chip
                    label={slide.tag}
                    size="small"
                    sx={{
                      mb: 2,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      border: "1px solid rgba(255,255,255,0.25)",
                      letterSpacing: 0.5,
                    }}
                  />

                  {/* Title */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
                      lineHeight: 1.15,
                      letterSpacing: "-1px",
                      mb: 2,
                      textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    {slide.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: { xs: "0.9rem", md: "1.1rem" },
                      lineHeight: 1.6,
                      mb: 3,
                      maxWidth: 520,
                    }}
                  >
                    {slide.description}
                  </Typography>

                  {/* Rating */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Star sx={{ color: "#fbbf24", fontSize: 20 }} />
                    <Typography
                      sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}
                    >
                      {slide.rating}
                    </Typography>
                    <Typography
                      sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}
                    >
                      · 50,000+ learners
                    </Typography>
                  </Stack>

                  {/* CTA Buttons */}
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "1rem",
                        px: 4,
                        py: 1.4,
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(79, 70, 229, 0.4)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 32px rgba(79, 70, 229, 0.5)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {slide.cta}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<PlayCircleOutline />}
                      sx={{
                        color: "#fff",
                        borderColor: "rgba(255,255,255,0.4)",
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        py: 1.4,
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "&:hover": {
                          borderColor: "#fff",
                          backgroundColor: "rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default HomeCarousel;
