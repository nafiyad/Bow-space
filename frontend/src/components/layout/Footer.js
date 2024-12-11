import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

// Footer component for the application
function Footer() {
  // Access the current theme
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: theme.palette.primary.main, // Use the primary color from the theme
        color: theme.palette.primary.contrastText, // Use contrasting text color
        py: 3, // Padding top and bottom
        mt: 'auto'  // Push the footer to the bottom of the page
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          {'Copyright © '}
          <Link 
            color="inherit" 
            href="/"
            sx={{ 
              textDecoration: 'none', // Remove default underline
              '&:hover': {
                textDecoration: 'underline' // Add underline on hover
              }
            }}
          >
            Bow Registration
          </Link>{' '}
          {new Date().getFullYear()} {/* Display current year */}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
