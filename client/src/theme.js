// src/darkTheme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2A5298', // Vibrant blue for primary actions
      contrastText: '#ffffff', // Ensures good readability
    },
    secondary: {
      main: '#f48fb1', // Soft pink for secondary actions
      contrastText: '#ffffff', // Consistent white text
    },
    background: {
      default: '#121212', // Deep dark background for the app
      paper: '#1e1e1e', // Slightly lighter for elevated components
    },
    text: {
      primary: '#E0E0E0', // Softer white for better readability
      secondary: '#B0BEC5', // Muted gray for secondary text
      disabled: '#616161', // Darker gray for disabled elements
    },
    action: {
      hover: '#2A5298', // Unified hover color for interactive elements
      disabled: '#616161', // Dimmed state for disabled actions
      active: '#1D3C75', // Highlight active elements
    },
    divider: '#424242', // Subtle dividers for separation
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif', // Clean and professional font
    h1: {
      fontSize: '2.125rem',
      fontWeight: 700,
      color: '#ffffff', // Large heading color
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#E0E0E0',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#fff', // Medium heading
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      color: '#E0E0E0',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#B0BEC5',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 700,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#9E9E9E',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', // Consistent with background paper
          color: '#E0E0E0', // Text color
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2A3E52', // Sidebar background
          color: '#ffffff', // Text color
          borderRadius: '8px', // Rounded corners for modern design
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Stronger shadow for depth
          padding: '20px', // Padding for comfortable spacing
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '12px 16px', // Balanced padding for items
          '&.Mui-selected': {
            backgroundColor: '#2A5298', // Highlight selected items
            color: '#ffffff', // Text remains readable
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#1D3C75', // Subtle hover for selected items
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500, // Distinct yet light typography
        },
        secondary: {
          fontSize: '0.75rem', // Smaller secondary text
          color: '#B0BEC5', // Muted for distinction
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#2A5298', // Primary action color
          color: '#ffffff', // Contrast text
          fontWeight: 700, // Strong text weight
          borderRadius: '8px', // Modern button shape
          textTransform: 'none', // Keep text case consistent
          padding: '8px 16px', // Comfortable padding
          '&:hover': {
            backgroundColor: '#1D3C75', // Hover effect
          },
          '&:disabled': {
            backgroundColor: '#424242', // Disabled state
            color: '#616161',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', // Consistent dark background
          color: '#E0E0E0', // Text color
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#E0E0E0', // Input text color
            backgroundColor: '#1e1e1e', // Input background
            borderRadius: '4px',
          },
          '& .MuiInputLabel-root': {
            color: '#B0BEC5', // Label color
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242', // Border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2A5298', // Hover border
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2A5298', // Focus border
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', // Card background
          color: '#E0E0E0', // Card text color
          borderRadius: '12px', // Modern rounded corners
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Soft shadow for depth
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2A3E52', // Tooltip background
          color: '#ffffff', // Tooltip text
        },
      },
    },
  },
});

export default darkTheme;
