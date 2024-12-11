const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { auth } = require('../middleware/auth');
const { poolPromise } = require('../config/db');

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT id, username, firstName, lastName, email, role FROM Users');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error in GET /users:', err);
        res.status(500).json({ msg: 'Server error while fetching users' });
    }
});

// Get admin user
router.get('/admin', auth, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query("SELECT id, username, firstName, lastName FROM Users WHERE role = 'admin'");

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Admin user not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error in GET /users/admin:', err);
        res.status(500).json({ msg: 'Server error while fetching admin user' });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, req.user.id)
            .query('SELECT id, username, firstName, lastName, email, role FROM Users WHERE id = @userId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error in GET /users/profile:', err);
        res.status(500).json({ msg: 'Server error while fetching profile' });
    }
});

// Get student details
router.get('/:userId/student-details', auth, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, req.params.userId)
            .query(`
                SELECT u.id, u.username, u.firstName, u.lastName, u.email, u.role,
                       s.program, s.enrollmentDate
                FROM Users u
                LEFT JOIN StudentDetails s ON u.id = s.userId
                WHERE u.id = @userId AND u.role = 'student'
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error in GET /users/:userId/student-details:', err);
        res.status(500).json({ msg: 'Server error while fetching student details' });
    }
});

// Update user profile
router.put('/:userId/profile', auth, async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, req.params.userId)
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('email', sql.NVarChar, email)
            .query(`
                UPDATE Users
                SET firstName = @firstName,
                    lastName = @lastName,
                    email = @email
                OUTPUT INSERTED.*
                WHERE id = @userId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error in PUT /users/:userId/profile:', err);
        res.status(500).json({ msg: 'Server error while updating profile' });
    }
});

module.exports = router; 