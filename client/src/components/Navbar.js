import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
  IconButton,
  Drawer,
  TextField,
  Stack,
  Avatar,
  Divider,
  InputAdornment,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Login as LoginIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, fetchCourses } from "../store/features/searchSlice";
import { toast } from "react-toastify";
import Path from "../images/Path.png";

// ─────────── Design Tokens ───────────
const COLORS = {
  primary: "#1e3a8a",
  primaryDark: "#162e6a",
  accent: "#3b82f6",
  bg: "rgba(255, 255, 255, 0.85)",
  border: "#e5e7eb",
  text: "#0f172a",
  textMuted: "#64748b",
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, loading } = useSelector((state) => state.search);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.warn("Please enter a valid search term.");
      return;
    }
    navigate(`/user/search?term=${encodeURIComponent(searchTerm)}`);
    dispatch(fetchCourses(searchTerm));
    dispatch(setSearchTerm(""));
  };

  const logoutUser = async () => {
    try {
      const response = await fetch("https://lmsb-apt8.onrender.com/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem("token");
        toast.success("Logout successful");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Error logging out");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${COLORS.border}`,
        color: COLORS.text,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          gap: 2,
          minHeight: { xs: 64, md: 72 },
          px: { xs: 2, md: 4 },
        }}
      >
        {/* ─── Brand ─── */}
        <Box
          component={Link}
          to="/user"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(30, 58, 138, 0.25)",
              overflow: "hidden",
            }}
          >
            <img
              src={Path}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: COLORS.primary,
              fontSize: { xs: "1rem", md: "1.15rem" },
              letterSpacing: "-0.3px",
              display: { xs: "none", sm: "block" },
            }}
          >
            LearnHub
          </Typography>
        </Box>

        {/* ─── Desktop Search ─── */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            flex: 1,
            maxWidth: 620,
            gap: 1,
          }}
        >
          <TextField
            size="small"
            placeholder="Search for courses, topics, instructors..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: COLORS.textMuted, fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                fontSize: "0.9rem",
                transition: "all 0.2s",
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "#cbd5e1" },
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                  boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.15)`,
                },
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.accent,
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              textTransform: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
              px: 3,
              py: 1,
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(30, 58, 138, 0.25)",
              "&:hover": {
                background: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 100%)`,
                boxShadow: "0 6px 16px rgba(30, 58, 138, 0.35)",
              },
              "&:disabled": { opacity: 0.6 },
            }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Box>

        {/* ─── Desktop Nav Links ─── */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <NavLink
            icon={<SchoolIcon fontSize="small" />}
            label="Courses"
            to="/user/course"
            active={isActive("/user/course")}
          />
          <NavLink
            icon={<FavoriteIcon fontSize="small" />}
            label="Wishlist"
            to="/user/wish"
            active={isActive("/user/wish")}
          />

          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: COLORS.textMuted,
                ml: 0.5,
                "&:hover": { backgroundColor: "#f1f5f9" },
              }}
            >
              <Badge badgeContent={2} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Avatar Dropdown */}
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              textTransform: "none",
              color: COLORS.text,
              ml: 1,
              px: 1,
              py: 0.5,
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#f1f5f9" },
            }}
            endIcon={<ArrowDownIcon fontSize="small" />}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              U
            </Avatar>
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: "12px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                border: `1px solid ${COLORS.border}`,
                overflow: "hidden",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                navigate("/user/profile");
                setAnchorEl(null);
              }}
              sx={{ py: 1.2, fontSize: "0.9rem" }}
            >
              <AccountCircleIcon fontSize="small" sx={{ mr: 1.2, color: COLORS.textMuted }} />
              My Profile
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                logoutUser();
                setAnchorEl(null);
              }}
              sx={{ py: 1.2, fontSize: "0.9rem", color: "#dc2626" }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1.2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>

        {/* ─── Mobile Search ─── */}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            alignItems: "center",
            gap: 0.5,
            flex: 1,
            maxWidth: { xs: 260, sm: 320, md: 400 },
          }}
        >
          <TextField
            size="small"
            placeholder="Search..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8fafc",
                borderRadius: "10px",
                fontSize: "0.85rem",
                "& fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: COLORS.accent },
              },
            }}
          />
          <IconButton
            onClick={handleSearch}
            disabled={loading}
            sx={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              color: "#fff",
              borderRadius: "10px",
              width: 40,
              height: 40,
              "&:hover": {
                background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
              },
              "&:disabled": { opacity: 0.6 },
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ─── Mobile Hamburger ─── */}
        <IconButton
          sx={{
            display: { xs: "flex", lg: "none" },
            color: COLORS.primary,
            backgroundColor: "#f1f5f9",
            borderRadius: "10px",
            width: 40,
            height: 40,
            "&:hover": { backgroundColor: "#e2e8f0" },
          }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
      </Toolbar>

      {/* ─── Mobile Drawer ─── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: "#fff",
            borderRadius: "16px 0 0 16px",
            overflow: "hidden",
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
            p: 3,
            color: "#fff",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mb: 1.5,
              backgroundColor: "rgba(255,255,255,0.2)",
              fontWeight: 700,
              fontSize: "1.3rem",
            }}
          >
            U
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            Welcome back!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.8rem" }}>
            Continue your learning journey
          </Typography>
        </Box>

        {/* Drawer Nav */}
        <Stack spacing={0.5} sx={{ p: 2 }}>
          <DrawerNavLink
            icon={<SchoolIcon />}
            label="Courses"
            to="/user/course"
            onClick={() => setDrawerOpen(false)}
          />
          <DrawerNavLink
            icon={<FavoriteIcon />}
            label="Wishlist"
            to="/user/wish"
            onClick={() => setDrawerOpen(false)}
          />
          <DrawerNavLink
            icon={<AccountCircleIcon />}
            label="Profile"
            to="/user/profile"
            onClick={() => setDrawerOpen(false)}
          />
          <DrawerNavLink
            icon={<LoginIcon />}
            label="Login"
            to="/login"
            onClick={() => setDrawerOpen(false)}
          />

          <Divider sx={{ my: 1.5 }} />

          <Button
            startIcon={<LogoutIcon />}
            fullWidth
            onClick={() => {
              logoutUser();
              setDrawerOpen(false);
            }}
            sx={{
              textTransform: "none",
              color: "#dc2626",
              backgroundColor: "#fef2f2",
              fontWeight: 600,
              borderRadius: "10px",
              py: 1.2,
              justifyContent: "flex-start",
              "&:hover": { backgroundColor: "#fee2e2" },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
};

// ─── Reusable Nav Link (Desktop) ───
const NavLink = ({ icon, label, to, active }) => (
  <Button
    component={Link}
    to={to}
    startIcon={icon}
    sx={{
      textTransform: "none",
      color: active ? COLORS.primary : COLORS.textMuted,
      fontWeight: active ? 700 : 500,
      fontSize: "0.9rem",
      px: 1.5,
      py: 0.8,
      borderRadius: "10px",
      backgroundColor: active ? "#eff6ff" : "transparent",
      whiteSpace: "nowrap",
      "&:hover": {
        backgroundColor: "#f1f5f9",
        color: COLORS.primary,
      },
    }}
  >
    {label}
  </Button>
);

// ─── Reusable Nav Link (Drawer) ───
const DrawerNavLink = ({ icon, label, to, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Button
      component={Link}
      to={to}
      onClick={onClick}
      startIcon={icon}
      fullWidth
      sx={{
        textTransform: "none",
        color: active ? COLORS.primary : COLORS.text,
        fontWeight: active ? 700 : 500,
        justifyContent: "flex-start",
        px: 2,
        py: 1.2,
        borderRadius: "10px",
        backgroundColor: active ? "#eff6ff" : "transparent",
        "& .MuiButton-startIcon": {
          color: active ? COLORS.primary : COLORS.textMuted,
        },
        "&:hover": { backgroundColor: "#f1f5f9" },
      }}
    >
      {label}
    </Button>
  );
};

export default Navbar;
