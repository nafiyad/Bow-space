// This component displays a list of all registered students for admin users

import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const users = await userService.getAllUsers();
        // Filter users to get only students
        const studentUsers = users.filter(user => user.role === 'student');
        setStudents(studentUsers);
        setError('');
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Registered Students</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Paper elevation={3}>
        {students.length > 0 ? (
          <List>
            {students.map((student) => (
              <ListItem key={student.id}>
                <ListItemText
                  primary={`${student.firstName} ${student.lastName}`}
                  secondary={
                    <>
                      Email: {student.email}
                      {student.program && ` | Program: ${student.program}`}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ p: 2 }}>
            {error ? 'Unable to load students' : 'No students registered yet.'}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default StudentList;
