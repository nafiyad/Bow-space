// This component provides the overall layout structure for the application

import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
