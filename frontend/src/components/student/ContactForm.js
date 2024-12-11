// This component allows students to contact the admin

import React, { useState, useEffect } from 'react';
import { messageService } from '../../services/messageService';
import { userService } from '../../services/userService';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';

function ContactForm() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch admin user on component mount
  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const admin = await userService.getAdminUser();
        setAdminUser(admin);
      } catch (error) {
        console.error('Error fetching admin user:', error);
        setSnackbar({
          open: true,
          message: 'Failed to connect to admin. Please try again later.',
          severity: 'error'
        });
      }
    };

    fetchAdminUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in both subject and message',
        severity: 'error'
      });
      return;
    }

    if (!adminUser) {
      setSnackbar({
        open: true,
        message: 'Cannot send message: Admin not found',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Send message to admin using their actual ID
      await messageService.sendMessage(adminUser.id, subject.trim(), content.trim());
      
      // Clear form and show success message
      setSubject('');
      setContent('');
      setSnackbar({
        open: true,
        message: 'Message sent successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: error?.response?.data?.msg || 'Failed to send message. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Contact Admin</Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            margin="normal"
            required
            disabled={loading || !adminUser}
            inputProps={{ maxLength: 100 }}
            helperText={`${subject.length}/100 characters`}
            error={subject.length > 100}
          />
          <TextField
            fullWidth
            label="Message"
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
            disabled={loading || !adminUser}
            inputProps={{ maxLength: 1000 }}
            helperText={`${content.length}/1000 characters`}
            error={content.length > 1000}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{ mt: 2 }}
            disabled={loading || !adminUser || !subject.trim() || !content.trim() || 
                     subject.length > 100 || content.length > 1000}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactForm;
