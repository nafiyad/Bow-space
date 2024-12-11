import api from './api';

export const messageService = {
    // Get all messages for the current user
    getMessages: async () => {
        try {
            const response = await api.get('/messages');
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to fetch messages';
        }
    },

    // Send a new message
    sendMessage: async (receiverId, subject, content) => {
        try {
            const response = await api.post('/messages', {
                receiverId,
                subject,
                content
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to send message';
        }
    },

    // Delete a message
    deleteMessage: async (messageId) => {
        try {
            const response = await api.delete(`/messages/${messageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to delete message';
        }
    }
};

export default messageService; 