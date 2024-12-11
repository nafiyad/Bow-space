// This is the main dashboard for admin users
// It displays different tabs for various admin activities

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
import AdminProfile from './AdminProfile';
import CourseManagement from './CourseManagement';
import StudentList from './StudentList';
import MessageInbox from './MessageInbox';
import LogoutIcon from '@mui/icons-material/Logout';

function AdminDashboard() {
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

  // If user is not authenticated, show error message
  if (!currentUser) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Error: User not authenticated
        </Typography>
        <Typography>
          Please log in to access the admin dashboard.
        </Typography>
      </Container>
    );
  }

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
          <Tab label="Course Management" />
          <Tab label="Student List" />
          <Tab label="Messages" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <AdminProfile user={currentUser} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <CourseManagement />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <StudentList />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <MessageInbox />
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default AdminDashboard;
