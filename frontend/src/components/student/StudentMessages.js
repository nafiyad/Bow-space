// This component displays messages for the student

import React, { useState, useEffect } from 'react';
import { messageService } from '../../services/messageService';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Delete
} from '@mui/icons-material';

function StudentMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await messageService.getMessages();
      // Sort messages by date, newest first
      const sortedMessages = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(typeof error === 'string' ? error : 'Failed to fetch messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
    setOpenDialog(false);
  };

  const handleDeleteMessage = async (messageId, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    try {
      await messageService.deleteMessage(messageId);
      setMessages(messages.filter(m => m.id !== messageId));
      setSnackbar({
        open: true,
        message: 'Message deleted successfully',
        severity: 'success'
      });
      if (openDialog) {
        handleCloseMessage();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setSnackbar({
        open: true,
        message: typeof error === 'string' ? error : 'Failed to delete message',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && messages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Your Messages</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Paper elevation={3} sx={{ p: 2 }}>
        {messages.length > 0 ? (
          <List>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem onClick={() => handleOpenMessage(message)} sx={{ cursor: 'pointer' }}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.subject}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {message.senderFirstName 
                            ? `From: ${message.senderFirstName} ${message.senderLastName}`
                            : 'From: System'}
                        </Typography>
                        {" — " + message.content.substring(0, 50) + (message.content.length > 50 ? "..." : "")}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={(e) => handleDeleteMessage(message.id, e)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography align="center" color="textSecondary">
            {error ? 'Unable to load messages' : 'You have no messages'}
          </Typography>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseMessage} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedMessage?.subject}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            From: {selectedMessage?.senderFirstName 
              ? `${selectedMessage.senderFirstName} ${selectedMessage.senderLastName}`
              : 'System'}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedMessage?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessage}>Close</Button>
          <Button 
            onClick={() => handleDeleteMessage(selectedMessage?.id)}
            color="error"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default StudentMessages;
