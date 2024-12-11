const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../config/db');

// Get all programs
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    code,
                    name,
                    duration,
                    description,
                    feesDomestic,
                    feesInternational
                FROM Programs
                ORDER BY name
            `);
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching programs:', err);
        res.status(500).json({ msg: 'Server error while fetching programs' });
    }
});

module.exports = router; 