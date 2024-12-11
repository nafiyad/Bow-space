// This is the main dashboard for students
// It shows different tabs for various student activities

import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Button
} from '@mui/material';
import StudentProfile from './StudentProfile';
import CourseRegistration from './CourseRegistration';
import ContactForm from './ContactForm';
import StudentMessages from './StudentMessages';
import LogoutIcon from '@mui/icons-material/Logout';

function StudentDashboard() {
  const { currentUser, logout } = useUserContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Function to change tabs
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Function to handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // This component shows the content for each tab
  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Welcome, {currentUser.firstName} {currentUser.lastName}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <Paper elevation={3}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Profile" />
          <Tab label="Course Registration" />
          <Tab label="Contact Admin" />
          <Tab label="Messages" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <StudentProfile user={currentUser} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <CourseRegistration />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ContactForm />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <StudentMessages />
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default StudentDashboard;
