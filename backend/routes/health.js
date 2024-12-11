const express = require('express');
const router = express.Router();
const { poolPromise } = require('../utils/db');

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request().query('SELECT 1');
        res.json({ status: 'healthy', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
    }
});

module.exports = router; 