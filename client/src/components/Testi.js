import React from "react";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  Chip,
} from "@mui/material";
import { FormatQuoteRounded, VerifiedUser } from "@mui/icons-material";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../images/1.jpg";
import img2 from "../images/2.jpg";
import img3 from "../images/3.jpg";
import img4 from "../images/4.jpg";
import img5 from "../images/5.jpg";
import img6 from "../images/6.jpg";
import img7 from "../images/7.jpg";

// ─── Theme Tokens ───
const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  accent: "#8b5cf6",
  text: "#0f172a",
  textMuted: "#64748b",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  shadow: "rgba(79, 70, 229, 0.15)",
};

const testimonials = [
  {
    image: img1,
    name: "John Doe",
    role: "Full Stack Developer",
    course: "React Masterclass",
    feedback:
      "The React Masterclass completely transformed how I build applications. The instructor's depth of knowledge and hands-on projects made complex concepts feel simple.",
    rating: 5,
  },
  {
    image: img2,
    name: "Jane Smith",
    role: "UI/UX Designer",
    course: "Design Systems",
    feedback:
      "Best investment in my career! The design systems course helped me land a senior role. The community support and mentor feedback are unmatched.",
    rating: 5,
  },
  {
    image: img3,
    name: "Michael Johnson",
    role: "Data Analyst",
    course: "Python for Data Science",
    feedback:
      "Clear explanations, real-world datasets, and practical assignments. I went from zero Python knowledge to building ML models in 3 months.",
    rating: 5,
  },
  {
    image: img4,
    name: "Emily Davis",
    role: "Product Manager",
    course: "Agile Fundamentals",
    feedback:
      "This course gave me the confidence to lead cross-functional teams. The case studies from real companies were incredibly valuable.",
    rating: 4,
  },
  {
    image: img7,
    name: "David Lee",
    role: "Marketing Lead",
    course: "Digital Marketing",
    feedback:
      "The quality of content exceeded my expectations. The live sessions with industry experts were the highlight of my learning journey.",
    rating: 5,
  },
  {
    image: img6,
    name: "Sarah Brown",
    role: "Frontend Developer",
    course: "JavaScript Deep Dive",
    feedback:
      "Finally, a course that doesn't just teach syntax but the 'why' behind it. My debugging skills improved dramatically within weeks.",
    rating: 5,
  },
];

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,                   // ✅ smooth transition
    autoplay: true,
    autoplaySpeed: 5000,          // ✅ 5 sec — readable
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    pauseOnFocus: false,          // ✅ important for autoplay
    pauseOnDotsHover: false,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    waitForAnimate: false,        // ✅ important
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #faf5ff 100%)",
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* ─── Decorative Blur Orbs ─── */}
      <Box
        component={motion.div}
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: "5%",
          left: "-5%",
          width: { xs: 220, md: 400 },
          height: { xs: 220, md: 400 },
          background:
            "radial-gradient(circle, rgba(79,70,229,0.25) 0%, rgba(79,70,229,0) 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <Box
        component={motion.div}
        animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          bottom: "0%",
          right: "-5%",
          width: { xs: 260, md: 450 },
          height: { xs: 260, md: 450 },
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* ═══ Header ═══ */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{ textAlign: "center", mb: { xs: 5, md: 8 }, position: "relative", zIndex: 2 }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.6,
            mb: 2,
            borderRadius: "50px",
            background: "rgba(79, 70, 229, 0.1)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: COLORS.primary,
              boxShadow: `0 0 8px ${COLORS.primary}`,
            }}
          />
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: COLORS.primary,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Testimonials
          </Typography>
        </Box>

        <Typography
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", sm: "2.6rem", md: "3.2rem" },
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: COLORS.text,
            mb: 2,
          }}
        >
          Loved by{" "}
          <Box
            component="span"
            sx={{
              background: COLORS.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            50,000+ Learners
          </Box>
        </Typography>

        <Typography
          sx={{
            color: COLORS.textMuted,
            fontSize: { xs: "0.95rem", md: "1.1rem" },
            maxWidth: 560,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Don't just take our word for it — hear from students who transformed their careers with LearnHub.
        </Typography>
      </Box>

      {/* ═══ Slider ═══ */}
      <Box
        sx={{
          maxWidth: 1300,
          mx: "auto",
          position: "relative",
          zIndex: 2,
          "& .slick-list": { overflow: "visible", py: 2 },
          "& .slick-slide > div": { px: 1.2 },
          "& .slick-dots": {
            bottom: { xs: -30, md: -40 },
            "& li button:before": {
              color: COLORS.primary,
              fontSize: 9,
              opacity: 0.3,
            },
            "& li.slick-active button:before": {
              opacity: 1,
              fontSize: 11,
            },
          },
        }}
      >
        {/* ✅ key prop fixes autoplay */}
        <Slider key={testimonials.length} {...settings}>
          {testimonials.map((t, index) => (
            <Box key={index} sx={{ height: "100%" }}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                sx={{
                  height: "100%",
                  minHeight: 340,
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "visible",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 25px 50px ${COLORS.shadow}`,
                    borderColor: "rgba(79, 70, 229, 0.2)",
                  },
                }}
              >
                {/* Quote icon (top-left) */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -18,
                    left: 24,
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: COLORS.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 20px ${COLORS.shadow}`,
                    zIndex: 2,
                  }}
                >
                  <FormatQuoteRounded sx={{ color: "#fff", fontSize: 24 }} />
                </Box>

                <CardContent
                  sx={{
                    p: 3,
                    pt: 4.5,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    "&:last-child": { pb: 3 },
                  }}
                >
                  {/* Rating */}
                  <Rating
                    value={t.rating}
                    readOnly
                    size="small"
                    sx={{
                      mb: 2,
                      "& .MuiRating-iconFilled": { color: "#fbbf24" },
                    }}
                  />

                  {/* Feedback */}
                  <Typography
                    sx={{
                      fontSize: "0.92rem",
                      color: COLORS.text,
                      lineHeight: 1.65,
                      mb: 3,
                      flex: 1,
                      fontStyle: "italic",
                    }}
                  >
                    "{t.feedback}"
                  </Typography>

                  {/* Course chip */}
                  <Chip
                    label={t.course}
                    size="small"
                    sx={{
                      alignSelf: "flex-start",
                      mb: 2.5,
                      background: "rgba(79, 70, 229, 0.08)",
                      color: COLORS.primary,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      borderRadius: "6px",
                      border: "1px solid rgba(79, 70, 229, 0.15)",
                    }}
                  />

                  {/* Divider */}
                  <Box
                    sx={{
                      height: 1,
                      background:
                        "linear-gradient(90deg, rgba(79,70,229,0.15) 0%, transparent 100%)",
                      mb: 2,
                    }}
                  />

                  {/* User Info */}
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      src={t.image}
                      alt={t.name}
                      sx={{
                        width: 46,
                        height: 46,
                        border: "2.5px solid #fff",
                        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: COLORS.text,
                          }}
                        >
                          {t.name}
                        </Typography>
                        <VerifiedUser
                          sx={{ fontSize: 15, color: COLORS.primary }}
                        />
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: COLORS.textMuted,
                          fontWeight: 500,
                        }}
                      >
                        {t.role}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* ═══ Bottom Stats ═══ */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        sx={{
          maxWidth: 800,
          mx: "auto",
          mt: { xs: 6, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: { xs: 3, md: 4 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {[
          { value: "4.9★", label: "Average Rating" },
          { value: "50K+", label: "Happy Students" },
          { value: "98%", label: "Completion Rate" },
        ].map((stat, i) => (
          <Box
            key={i}
            sx={{
              textAlign: "center",
              p: 2.5,
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                fontWeight: 800,
                background: COLORS.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: COLORS.textMuted,
                fontWeight: 600,
                letterSpacing: 0.3,
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TestimonialSlider;
