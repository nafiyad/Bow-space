const sql = require('mssql');
const { poolPromise } = require('../utils/db');

class Message {
    static async findByReceiverId(receiverId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('receiverId', sql.Int, receiverId)
            .query(`
                SELECT m.*, 
                    u.firstName as senderFirstName, 
                    u.lastName as senderLastName
                FROM Messages m
                JOIN Users u ON m.senderId = u.id
                WHERE m.receiverId = @receiverId
                ORDER BY m.createdAt DESC
            `);
        return result.recordset;
    }

    static async create(messageData) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('senderId', sql.Int, messageData.senderId)
            .input('receiverId', sql.Int, messageData.receiverId)
            .input('subject', sql.VarChar, messageData.subject)
            .input('content', sql.Text, messageData.content)
            .query(`
                INSERT INTO Messages (senderId, receiverId, subject, content)
                VALUES (@senderId, @receiverId, @subject, @content);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        return result.recordset[0];
    }

    static async markAsRead(messageId, receiverId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, messageId)
            .input('receiverId', sql.Int, receiverId)
            .query(`
                UPDATE Messages 
                SET isRead = 1
                WHERE id = @id AND receiverId = @receiverId;
                SELECT * FROM Messages WHERE id = @id;
            `);
        
        return result.recordset[0];
    }

    static async delete(messageId, userId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, messageId)
            .input('userId', sql.Int, userId)
            .query(`
                DELETE FROM Messages 
                WHERE id = @id AND (senderId = @userId OR receiverId = @userId)
            `);
        
        return result.rowsAffected[0] > 0;
    }
}

module.exports = Message; 