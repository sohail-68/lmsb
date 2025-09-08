import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import Home from "../images/7.jpg";

const Feature = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f9fafb",
        py: { xs: 6, md: 8 },
      }}
    >
      {/* Container with max-width */}
      <Box
        sx={{
          maxWidth: "1200px", // 👈 fixed max-width
          mx: "auto",         // center align (margin left + right auto)
          px: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {/* Left Section */}
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1e3a8a",
              mb: 2,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            }}
          >
            Earn more with Graphy Assist
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#444",
              mb: 3,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
            }}
          >
            Supercharge your business with automation tools and earn up to 10% more effortlessly.
          </Typography>

          <List>
            {[
              "Drive more traffic with SEO-optimized websites",
              "Build trust & create urgency with social proof & offers",
              "Maximize conversions with automated funnels & reminders",
            ].map((text, idx) => (
              <ListItem key={idx} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <CheckCircle sx={{ color: "#1e3a8a" }} />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    sx: { color: "#333", fontSize: "1rem" },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "500px" },
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <img
            src={Home}
            alt="Graphy Assist Feature"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Feature;
