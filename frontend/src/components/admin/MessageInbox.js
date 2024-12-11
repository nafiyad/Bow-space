import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { messageService } from '../../services/messageService';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { AccountCircle, Send } from '@mui/icons-material';

function MessageInbox() {
  const { currentUser } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const fetchedMessages = await messageService.getMessages();
      // Sort messages by date, newest first
      const sortedMessages = fetchedMessages.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sortedMessages);
      setError('');
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open a message
  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
  };

  // Close the message dialog
  const handleCloseMessage = () => {
    setSelectedMessage(null);
    setReply('');
  };

  // Send a reply to a message
  const handleSendReply = async () => {
    if (!reply.trim()) return;

    try {
      await messageService.sendMessage(
        selectedMessage.senderId,
        `Re: ${selectedMessage.subject}`,
        reply.trim()
      );
      setSnackbar({
        open: true,
        message: 'Reply sent successfully',
        severity: 'success'
      });
      handleCloseMessage();
      // Refresh messages to show the new reply
      fetchMessages();
    } catch (err) {
      console.error('Error sending reply:', err);
      setSnackbar({
        open: true,
        message: 'Failed to send reply. Please try again.',
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
      <Typography variant="h5" gutterBottom>Message Inbox</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Paper elevation={3} sx={{ p: 2 }}>
        {messages.length > 0 ? (
          <List>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem button onClick={() => handleOpenMessage(message)}>
                  <ListItemAvatar>
                    <Avatar><AccountCircle /></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.subject}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          From: {message.senderFirstName} {message.senderLastName}
                        </Typography>
                        {" — " + message.content.substring(0, 50) + (message.content.length > 50 ? "..." : "")}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>No messages to display.</Typography>
        )}
      </Paper>

      <Dialog open={!!selectedMessage} onClose={handleCloseMessage} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedMessage?.subject}
          <Typography variant="subtitle2" color="text.secondary">
            From: {selectedMessage?.senderFirstName} {selectedMessage?.senderLastName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedMessage?.content}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="reply"
              label="Reply"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessage}>Cancel</Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained" 
            startIcon={<Send />}
            disabled={!reply.trim()}
          >
            Send Reply
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

export default MessageInbox;
