import React from "react";
import { Box, Typography, Button, Stack, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import {
  CheckCircle,
  TrendingUp,
  AutoAwesome,
  ArrowForward,
} from "@mui/icons-material";
import Home from "../images/7.jpg";

// ─── Theme Tokens (matches your Navbar) ───
const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  accent: "#8b5cf6",
  text: "#0f172a",
  textMuted: "#64748b",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  shadow: "rgba(79, 70, 229, 0.25)",
};

const features = [
  {
    icon: <TrendingUp />,
    title: "Drive more traffic",
    description: "SEO-optimized course pages that rank higher and attract quality learners.",
  },
  {
    icon: <AutoAwesome />,
    title: "Build trust & urgency",
    description: "Social proof, reviews, and offers that convert visitors into students.",
  },
  {
    icon: <CheckCircle />,
    title: "Maximize conversions",
    description: "Automated funnels, reminders, and upsells to boost your revenue.",
  },
];

const Feature = () => {
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
        animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: { xs: 250, md: 400 },
          height: { xs: 250, md: 400 },
          background:
            "radial-gradient(circle, rgba(79,70,229,0.35) 0%, rgba(79,70,229,0) 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Box
        component={motion.div}
        animate={{ x: [0, -25, 25, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          background:
            "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ─── Main Content Container ─── */}
      <Box
        sx={{
          maxWidth: 1300,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.1fr 1fr" },
          gap: { xs: 6, md: 8 },
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ═══ LEFT: Text Content ═══ */}
        <Box component={motion.div}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Small eyebrow tag */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.6,
              mb: 3,
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
                fontSize: "0.75rem",
                fontWeight: 700,
                color: COLORS.primary,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              LMS Growth Suite
            </Typography>
          </Box>

          {/* Heading */}
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
            Earn more with{" "}
            <Box
              component="span"
              sx={{
                background: COLORS.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LearnHub Assist
            </Box>
          </Typography>

          {/* Subheading */}
          <Typography
            sx={{
              color: COLORS.textMuted,
              fontSize: { xs: "1rem", md: "1.15rem" },
              lineHeight: 1.7,
              mb: 4,
              maxWidth: 540,
            }}
          >
            Supercharge your course business with automation tools, smart funnels, and
            earn up to <strong style={{ color: COLORS.primary }}>10% more</strong> effortlessly.
          </Typography>

          {/* ─── Feature List ─── */}
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            {features.map((f, i) => (
              <Box
                component={motion.div}
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    background: "#fff",
                    transform: "translateX(6px)",
                    boxShadow: `0 8px 24px ${COLORS.shadow}`,
                    borderColor: "rgba(79, 70, 229, 0.2)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    background: COLORS.gradient,
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${COLORS.shadow}`,
                  }}
                >
                  {f.icon}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: COLORS.text,
                      mb: 0.3,
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.88rem", color: COLORS.textMuted, lineHeight: 1.5 }}
                  >
                    {f.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* CTA */}
          <Button
            component={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              background: COLORS.gradient,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1rem",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              boxShadow: `0 8px 24px ${COLORS.shadow}`,
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                boxShadow: `0 12px 32px ${COLORS.shadow}`,
              },
            }}
          >
            Start Free Trial
          </Button>
        </Box>

        {/* ═══ RIGHT: Image with Premium Frame ═══ */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Glowing backdrop behind image */}
          <Box
            sx={{
              position: "absolute",
              inset: "-10%",
              background: COLORS.gradient,
              opacity: 0.15,
              borderRadius: "32px",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />

          {/* Image frame */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
              border: "6px solid #fff",
              zIndex: 1,
              width: "100%",
              maxWidth: 520,
            }}
          >
            <img
              src={Home}
              loading="lazy"
              alt="LearnHub Assist Feature"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Floating stat card (premium touch) */}
          <Box
            component={motion.div}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            sx={{
              position: "absolute",
              bottom: { xs: -20, md: 20 },
              left: { xs: "5%", md: -20 },
              background: "#fff",
              borderRadius: "16px",
              p: 2,
              boxShadow: "0 15px 40px rgba(15, 23, 42, 0.15)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              zIndex: 3,
            }}
          >
            <Avatar sx={{ background: COLORS.gradient, width: 40, height: 40 }}>
              <TrendingUp fontSize="small" />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: COLORS.text }}>
                +10%
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: COLORS.textMuted }}>
                Revenue growth
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Feature;
