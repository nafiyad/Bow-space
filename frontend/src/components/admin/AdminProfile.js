import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

function AdminProfile({ user }) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Admin Profile</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>
        <Typography><strong>Admin ID:</strong> {user.id}</Typography>
      </Box>
    </Paper>
  );
}

export default AdminProfile;
