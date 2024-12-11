import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

function SignUpChoicePage() {
  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <Button
            component={Link}
            to="/admin-register"
            variant="contained"
            startIcon={<PersonIcon />}
            sx={{ width: '45%', height: '100px' }}
          >
            Admin
          </Button>
          <Button
            component={Link}
            to="/student-register"
            variant="contained"
            startIcon={<SchoolIcon />}
            sx={{ width: '45%', height: '100px' }}
          >
            Student
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignUpChoicePage;
