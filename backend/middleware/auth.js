const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { poolPromise } = require('../config/db');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization') || req.header('x-auth-token');
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            console.log('No auth header found');
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Clean the token
        const token = authHeader.replace('Bearer ', '');
        console.log('Cleaned token:', token.substring(0, 20) + '...');

        if (!token) {
            console.log('No token after cleaning');
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        try {
            // Verify token
            console.log('Verifying token with secret:', process.env.SESSION_SECRET ? 'Secret exists' : 'No secret found');
            const decoded = jwt.verify(token, process.env.SESSION_SECRET);
            console.log('Decoded token:', { userId: decoded.userId });

            // Get user from database
            const pool = await poolPromise;
            if (!pool) {
                console.error('Database pool is null');
                return res.status(500).json({ msg: 'Database connection failed' });
            }

            const result = await pool.request()
                .input('userId', sql.Int, decoded.userId)
                .query(`
                    SELECT id, username, email, role, firstName, lastName 
                    FROM Users 
                    WHERE id = @userId
                `);

            console.log('User query result:', result.recordset);

            if (result.recordset.length === 0) {
                console.log('No user found for token');
                return res.status(401).json({ msg: 'User not found' });
            }

            // Set user info in request
            req.user = result.recordset[0];
            console.log('Auth successful for user:', { 
                id: req.user.id, 
                username: req.user.username,
                role: req.user.role 
            });

            next();
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ msg: 'Token is not valid' });
        }
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ msg: 'Server error in auth middleware' });
    }
};

const adminAuth = async (req, res, next) => {
    auth(req, res, (err) => {
        if (err) {
            console.error('Admin auth error:', err);
            return next(err);
        }
        
        if (!req.user || req.user.role !== 'admin') {
            console.log('Access denied - not admin. User role:', req.user?.role);
            return res.status(403).json({ msg: 'Access denied. Admin rights required.' });
        }
        
        console.log('Admin auth successful for user:', req.user.username);
        next();
    });
};

module.exports = { auth, adminAuth }; 