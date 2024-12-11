const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { auth } = require('../middleware/auth');
const { poolPromise } = require('../config/db');

// Get user's messages
router.get('/', auth, async (req, res) => {
    try {
        console.log('Getting messages for user:', req.user.id);
        console.log('User role:', req.user.role);
        
        const pool = await poolPromise;

        // Different query based on user role
        let query = `
            SELECT m.*, 
                senderUser.firstName as senderFirstName, 
                senderUser.lastName as senderLastName,
                senderUser.role as senderRole,
                receiverUser.firstName as receiverFirstName, 
                receiverUser.lastName as receiverLastName,
                receiverUser.role as receiverRole
            FROM Messages m
            JOIN Users senderUser ON m.senderId = senderUser.id
            JOIN Users receiverUser ON m.receiverId = receiverUser.id
            WHERE `;

        // If admin, show all messages between admin and students
        if (req.user.role === 'admin') {
            query += `
                (m.senderId = @userId OR m.receiverId = @userId)
                OR (EXISTS (
                    SELECT 1 FROM Users u1 
                    WHERE u1.id IN (m.senderId, m.receiverId) 
                    AND u1.role = 'student'
                ))`;
        } else {
            // If student, show only their messages
            query += `m.senderId = @userId OR m.receiverId = @userId`;
        }

        query += ` ORDER BY m.createdAt DESC`;

        const result = await pool.request()
            .input('userId', sql.Int, req.user.id)
            .query(query);
        
        console.log(`Found ${result.recordset.length} messages`);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error in GET /messages:', err);
        res.status(500).json({ msg: 'Server error while fetching messages' });
    }
});

// Send a message
router.post('/', auth, async (req, res) => {
    try {
        console.log('Message POST request received');
        console.log('User:', req.user);
        console.log('Request body:', req.body);

        const { receiverId, subject, content } = req.body;

        // Input validation
        if (!receiverId) {
            console.error('Missing receiverId');
            return res.status(400).json({ msg: 'Receiver ID is required' });
        }

        if (!subject?.trim()) {
            console.error('Missing subject');
            return res.status(400).json({ msg: 'Subject is required' });
        }

        if (!content?.trim()) {
            console.error('Missing content');
            return res.status(400).json({ msg: 'Content is required' });
        }

        // Get database pool
        const pool = await poolPromise;
        if (!pool) {
            console.error('Database pool is null');
            return res.status(500).json({ msg: 'Database connection failed' });
        }

        // Check if receiver exists and validate roles
        console.log('Checking receiver:', receiverId);
        const receiverCheck = await pool.request()
            .input('receiverId', sql.Int, receiverId)
            .query('SELECT id, role FROM Users WHERE id = @receiverId');

        if (receiverCheck.recordset.length === 0) {
            console.error('Receiver not found:', receiverId);
            return res.status(404).json({ msg: 'Receiver not found' });
        }

        const receiverRole = receiverCheck.recordset[0].role;

        // Validate messaging permissions
        if (req.user.role === 'student' && receiverRole !== 'admin') {
            return res.status(403).json({ msg: 'Students can only send messages to admin' });
        }

        if (req.user.role === 'admin' && receiverRole !== 'student') {
            return res.status(403).json({ msg: 'Admin can only send messages to students' });
        }

        // Insert the message
        console.log('Inserting message');
        const result = await pool.request()
            .input('senderId', sql.Int, req.user.id)
            .input('receiverId', sql.Int, receiverId)
            .input('subject', sql.NVarChar, subject.trim())
            .input('content', sql.NVarChar, content.trim())
            .query(`
                INSERT INTO Messages (senderId, receiverId, subject, content, createdAt)
                OUTPUT INSERTED.*
                VALUES (@senderId, @receiverId, @subject, @content, GETDATE())
            `);

        if (!result.recordset || result.recordset.length === 0) {
            console.error('No message inserted');
            return res.status(500).json({ msg: 'Failed to insert message' });
        }

        // Get the complete message with user details
        const messageWithDetails = await pool.request()
            .input('messageId', sql.Int, result.recordset[0].id)
            .query(`
                SELECT m.*, 
                    senderUser.firstName as senderFirstName, 
                    senderUser.lastName as senderLastName,
                    senderUser.role as senderRole,
                    receiverUser.firstName as receiverFirstName, 
                    receiverUser.lastName as receiverLastName,
                    receiverUser.role as receiverRole
                FROM Messages m
                JOIN Users senderUser ON m.senderId = senderUser.id
                JOIN Users receiverUser ON m.receiverId = receiverUser.id
                WHERE m.id = @messageId
            `);

        console.log('Message sent successfully');
        res.json(messageWithDetails.recordset[0]);
    } catch (err) {
        console.error('Error in POST /messages:', err);
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            state: err.state,
            stack: err.stack
        });
        res.status(500).json({ 
            msg: 'Server error while sending message',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Delete a message
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Delete message request:', { messageId: req.params.id, userId: req.user.id });
        const pool = await poolPromise;
        
        // Verify message exists and belongs to user
        const checkResult = await pool.request()
            .input('messageId', sql.Int, req.params.id)
            .input('userId', sql.Int, req.user.id)
            .query('SELECT * FROM Messages WHERE id = @messageId AND (senderId = @userId OR receiverId = @userId)');
            
        if (checkResult.recordset.length === 0) {
            console.log('Message not found or unauthorized');
            return res.status(404).json({ msg: 'Message not found or unauthorized' });
        }

        // Delete message
        await pool.request()
            .input('messageId', sql.Int, req.params.id)
            .input('userId', sql.Int, req.user.id)
            .query('DELETE FROM Messages WHERE id = @messageId AND (senderId = @userId OR receiverId = @userId)');

        console.log('Message deleted successfully');
        res.json({ msg: 'Message deleted successfully' });
    } catch (err) {
        console.error('Error in DELETE /messages/:id:', err);
        res.status(500).json({ msg: 'Server error while deleting message' });
    }
});

module.exports = router; 