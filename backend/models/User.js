const sql = require('mssql');
const { poolPromise } = require('../utils/db');
const bcrypt = require('bcryptjs');

class User {
    static async findAll() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT id, firstName, lastName, email, username, role, createdAt FROM Users');
        return result.recordset;
    }

    static async findById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT id, firstName, lastName, email, username, role, createdAt FROM Users WHERE id = @id');
        return result.recordset[0];
    }

    static async findByUsername(username) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');
        return result.recordset[0];
    }

    static async create(userData) {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const result = await pool.request()
            .input('firstName', sql.VarChar, userData.firstName)
            .input('lastName', sql.VarChar, userData.lastName)
            .input('email', sql.VarChar, userData.email)
            .input('username', sql.VarChar, userData.username)
            .input('password', sql.VarChar, hashedPassword)
            .input('role', sql.VarChar, userData.role || 'student')
            .query(`
                INSERT INTO Users (firstName, lastName, email, username, password, role)
                VALUES (@firstName, @lastName, @email, @username, @password, @role);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        return result.recordset[0];
    }

    static async update(id, userData) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('firstName', sql.VarChar, userData.firstName)
            .input('lastName', sql.VarChar, userData.lastName)
            .input('email', sql.VarChar, userData.email)
            .query(`
                UPDATE Users 
                SET firstName = @firstName, lastName = @lastName, email = @email
                WHERE id = @id;
                SELECT id, firstName, lastName, email, username, role, createdAt 
                FROM Users WHERE id = @id;
            `);
        
        return result.recordset[0];
    }
}

module.exports = User; 