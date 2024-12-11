// This component handles course registration for students

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { hasValidToken } from '../../services/api';
import { courseService } from '../../services/courseService';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar
} from '@mui/material';

function CourseRegistration() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [registrationCount, setRegistrationCount] = useState(0);

  // Check auth state
  useEffect(() => {
    if (!hasValidToken()) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch courses and registrations
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id || !hasValidToken()) {
        setLoading(false);
        setError('Please log in to view courses');
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch all available courses
        const coursesData = await courseService.getAllCourses();
        setCourses(coursesData);

        // Fetch student's registered courses
        const registrationsData = await courseService.getStudentCourses(currentUser.id);
        setRegisteredCourses(registrationsData);
        setRegistrationCount(registrationsData.length);

      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMsg = err.response?.data?.msg || 'Failed to fetch course data';
        setError(errorMsg);
        setSnackbar({
          open: true,
          message: errorMsg,
          severity: 'error'
        });

        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id, navigate]);

  const handleRegister = async (course) => {
    if (!currentUser?.id || !hasValidToken()) {
      setSnackbar({
        open: true,
        message: 'Please log in to register for courses',
        severity: 'warning'
      });
      navigate('/login');
      return;
    }

    // Check registration limit
    if (registrationCount >= 5) {
      setSnackbar({
        open: true,
        message: 'You cannot register for more than 5 courses',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Validate course object
      if (!course?.id) {
        throw new Error('Invalid course information');
      }
      
      // Register for the course
      await courseService.registerForCourse(currentUser.id, course.id);
      
      // Refresh data
      await refreshData();
      
      setSnackbar({
        open: true,
        message: 'Successfully registered for the course',
        severity: 'success'
      });
      setError('');
      setRegistrationCount(prev => prev + 1);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Failed to register for course';
      setError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error'
      });

      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (courseId) => {
    if (!currentUser?.id || !hasValidToken()) {
      setSnackbar({
        open: true,
        message: 'Please log in to unregister from courses',
        severity: 'warning'
      });
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Validate courseId
      if (!courseId) {
        throw new Error('Invalid course ID');
      }
      
      // Unregister from the course
      await courseService.unregisterFromCourse(currentUser.id, courseId);
      
      // Refresh data
      await refreshData();
      
      setSnackbar({
        open: true,
        message: 'Successfully unregistered from the course',
        severity: 'success'
      });
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Failed to unregister from course';
      setError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error'
      });

      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a helper function to refresh data
  const refreshData = async () => {
    const [coursesData, registrationsData] = await Promise.all([
      courseService.getAllCourses(),
      courseService.getStudentCourses(currentUser.id)
    ]);
    setCourses(coursesData);
    setRegisteredCourses(registrationsData);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const availableCourses = courses.filter(course => 
    !registeredCourses.some(rc => rc.id === course.id) &&
    (selectedTerm === '' || course.term === selectedTerm)
  );

  if (!currentUser || !hasValidToken()) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="warning">
          Please log in to access course registration
        </Alert>
      </Box>
    );
  }

  if (loading && courses.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Course Registration</Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Registered Courses: {registrationCount}/5
      </Typography>
      
      {registrationCount >= 5 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You have reached the maximum limit of 5 courses
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Term</InputLabel>
              <Select
                value={selectedTerm}
                label="Select Term"
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <MenuItem value="">All Terms</MenuItem>
                <MenuItem value="Winter">Winter</MenuItem>
                <MenuItem value="Spring">Spring</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
                <MenuItem value="Fall">Fall</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Available Courses</Typography>
            {availableCourses.length === 0 ? (
              <Typography>No courses available for the selected term.</Typography>
            ) : (
              <List>
                {availableCourses.map((course) => (
                  <ListItem key={course.id} divider>
                    <ListItemText
                      primary={course.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textSecondary">
                            {course.code} - {course.term}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textSecondary">
                            Available Seats: {course.capacity - (course.enrolled || 0)}
                          </Typography>
                          {course.description && (
                            <>
                              <br />
                              <Typography component="span" variant="body2" color="textSecondary">
                                {course.description}
                              </Typography>
                            </>
                          )}
                        </>
                      }
                    />
                    <Button 
                      onClick={() => handleRegister(course)}
                      disabled={loading || course.enrolled >= course.capacity || registrationCount >= 5}
                      variant="contained"
                      color="primary"
                      sx={{ ml: 2 }}
                    >
                      {course.enrolled >= course.capacity ? 'Full' : 
                       registrationCount >= 5 ? 'Max Courses' : 'Register'}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Registered Courses</Typography>
            {registeredCourses.length === 0 ? (
              <Typography>You haven't registered for any courses yet.</Typography>
            ) : (
              <List>
                {registeredCourses.map((course) => (
                  <ListItem key={course.id} divider>
                    <ListItemText
                      primary={course.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textSecondary">
                            {course.code} - {course.term}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textSecondary">
                            Registered: {new Date(course.registrationDate).toLocaleDateString()}
                          </Typography>
                          {course.description && (
                            <>
                              <br />
                              <Typography component="span" variant="body2" color="textSecondary">
                                {course.description}
                              </Typography>
                            </>
                          )}
                        </>
                      }
                    />
                    <Button 
                      onClick={() => handleUnregister(course.id)}
                      disabled={loading}
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 2 }}
                    >
                      Unregister
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CourseRegistration;
