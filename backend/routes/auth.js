const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const { poolPromise } = require('../config/db');

// Debug logging
const DEBUG = true;
const debugLog = (...args) => {
    if (DEBUG) {
        console.log('[Auth Route]', ...args);
    }
};

// Register user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, role, program } = req.body;

    try {
        const pool = await poolPromise;

        // Check if user already exists
        const userCheck = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .query('SELECT id FROM Users WHERE username = @username OR email = @email');

        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Start transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const userResult = await transaction.request()
                .input('firstName', sql.VarChar, firstName)
                .input('lastName', sql.VarChar, lastName)
                .input('email', sql.VarChar, email)
                .input('username', sql.VarChar, username)
                .input('password', sql.VarChar, hashedPassword)
                .input('role', sql.VarChar, role)
                .query(`
                    INSERT INTO Users (firstName, lastName, email, username, password, role)
                    OUTPUT INSERTED.*
                    VALUES (@firstName, @lastName, @email, @username, @password, @role)
                `);

            const user = userResult.recordset[0];

            // If student role, create student details
            if (role === 'student' && program) {
                await transaction.request()
                    .input('userId', sql.Int, user.id)
                    .input('program', sql.VarChar, program)
                    .query(`
                        INSERT INTO StudentDetails (userId, program)
                        VALUES (@userId, @program)
                    `);
            }

            // Commit transaction
            await transaction.commit();

            // Create JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.SESSION_SECRET,
                { expiresIn: '24h' }
            );

            // Return success response
            res.json({
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server Error during registration' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    debugLog('Login attempt for username:', username);

    try {
        const pool = await poolPromise;
        debugLog('Database connection established');

        // Get user from Users table only
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');

        debugLog('User query completed. Records found:', result.recordset.length);

        if (result.recordset.length === 0) {
            debugLog('No user found with username:', username);
            return res.status(401).json({ msg: 'Invalid username or password' });
        }

        const user = result.recordset[0];
        debugLog('User found:', { id: user.id, username: user.username, role: user.role });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        debugLog('Password validation:', isMatch ? 'successful' : 'failed');

        if (!isMatch) {
            debugLog('Password mismatch for user:', username);
            return res.status(401).json({ msg: 'Invalid username or password' });
        }

        // Create JWT token with role included
        const tokenPayload = { 
            userId: user.id,
            role: user.role,
            username: user.username
        };
        debugLog('Creating token with payload:', tokenPayload);

        const token = jwt.sign(
            tokenPayload,
            process.env.SESSION_SECRET,
            { expiresIn: '24h' }
        );

        // Prepare user response object with only Users table data
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt
        };

        debugLog('Login successful. Sending response for user:', userResponse.username);

        // Return token and user info
        res.json({ 
            token,
            user: userResponse
        });
    } catch (err) {
        console.error('Login error:', err);
        debugLog('Login error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        res.status(500).json({ 
            msg: 'Server error during login',
            error: DEBUG ? err.message : undefined
        });
    }
});

// Register student
router.post('/register/student', async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        username, 
        password,
        phone,
        birthday,
        program 
    } = req.body;

    try {
        // Check if user already exists
        const pool = await poolPromise;
        const userCheck = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .query('SELECT id FROM Users WHERE username = @username OR email = @email');

        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert into Users table
            const userResult = await transaction.request()
                .input('firstName', sql.VarChar(50), firstName)
                .input('lastName', sql.VarChar(50), lastName)
                .input('email', sql.VarChar(100), email)
                .input('username', sql.VarChar(50), username)
                .input('password', sql.VarChar(255), hashedPassword)
                .input('role', sql.VarChar(10), 'student')
                .query(`
                    INSERT INTO Users (firstName, lastName, email, username, password, role)
                    OUTPUT INSERTED.id
                    VALUES (@firstName, @lastName, @email, @username, @password, @role)
                `);

            const userId = userResult.recordset[0].id;

            // Insert into StudentDetails table
            await transaction.request()
                .input('userId', sql.Int, userId)
                .input('phone', sql.VarChar(20), phone)
                .input('birthday', sql.Date, new Date(birthday))
                .input('program', sql.VarChar(10), program)
                .query(`
                    INSERT INTO StudentDetails (userId, phone, birthday, program)
                    VALUES (@userId, @phone, @birthday, @program)
                `);

            await transaction.commit();
            res.status(201).json({ msg: 'Student registered successfully' });
        } catch (err) {
            console.error('Transaction error:', err);
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            msg: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Register admin
router.post('/register/admin', async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        username, 
        password
    } = req.body;

    try {
        // Check if user already exists
        const pool = await poolPromise;
        const userCheck = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .query('SELECT id FROM Users WHERE username = @username OR email = @email');

        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin user
        const result = await pool.request()
            .input('firstName', sql.VarChar(50), firstName)
            .input('lastName', sql.VarChar(50), lastName)
            .input('email', sql.VarChar(100), email)
            .input('username', sql.VarChar(50), username)
            .input('password', sql.VarChar(255), hashedPassword)
            .input('role', sql.VarChar(10), 'admin')
            .query(`
                INSERT INTO Users (firstName, lastName, email, username, password, role)
                OUTPUT INSERTED.*
                VALUES (@firstName, @lastName, @email, @username, @password, @role)
            `);

        res.status(201).json({ 
            msg: 'Admin registered successfully',
            user: {
                id: result.recordset[0].id,
                username: result.recordset[0].username,
                role: result.recordset[0].role
            }
        });
    } catch (err) {
        console.error('Admin registration error:', err);
        res.status(500).json({ 
            msg: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router; 