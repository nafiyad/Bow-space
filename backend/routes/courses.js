const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { auth, adminAuth } = require('../middleware/auth');
const { poolPromise } = require('../config/db');

// Get all courses
router.get('/', auth, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    id,
                    code,
                    name,
                    term,
                    program,
                    description,
                    capacity,
                    createdAt,
                    (SELECT COUNT(*) FROM CourseRegistrations WHERE courseId = Courses.id) as enrolled
                FROM Courses
                ORDER BY term, code
            `);
        
        const courses = result.recordset.map(course => ({
            ...course,
            isFull: course.enrolled >= course.capacity,
            availableSeats: course.capacity - course.enrolled
        }));
        
        res.json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ msg: 'Server error while fetching courses' });
    }
});

// Get course by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT 
                    id,
                    code,
                    name,
                    term,
                    program,
                    description,
                    capacity,
                    createdAt,
                    (SELECT COUNT(*) FROM CourseRegistrations WHERE courseId = Courses.id) as enrolled
                FROM Courses
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const course = {
            ...result.recordset[0],
            isFull: result.recordset[0].enrolled >= result.recordset[0].capacity,
            availableSeats: result.recordset[0].capacity - result.recordset[0].enrolled
        };

        res.json(course);
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({ msg: 'Server error while fetching course' });
    }
});

// Create a new course (admin only)
router.post('/', adminAuth, async (req, res) => {
    const { code, name, term, program, description, capacity } = req.body;

    // Validate required fields
    if (!code || !name || !term || !program || !capacity) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        const pool = await poolPromise;

        // Check if course code already exists
        const checkResult = await pool.request()
            .input('code', sql.VarChar, code)
            .query('SELECT id FROM Courses WHERE code = @code');

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ msg: 'Course code already exists' });
        }

        // Insert new course using code as ID
        const result = await pool.request()
            .input('id', sql.VarChar(20), code)
            .input('code', sql.VarChar(20), code)
            .input('name', sql.VarChar(100), name)
            .input('term', sql.VarChar(10), term)
            .input('program', sql.VarChar(10), program)
            .input('description', sql.VarChar, description || '')
            .input('capacity', sql.Int, capacity)
            .query(`
                INSERT INTO Courses (id, code, name, term, program, description, capacity)
                OUTPUT INSERTED.*
                VALUES (@id, @code, @name, @term, @program, @description, @capacity)
            `);

        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ msg: 'Server error while creating course' });
    }
});

// Update course
router.put('/:id', adminAuth, async (req, res) => {
    const { name, term, program, description, capacity } = req.body;
    const { id } = req.params;

    try {
        const pool = await poolPromise;

        // Check if course exists
        const checkResult = await pool.request()
            .input('id', sql.VarChar(20), id)
            .query('SELECT id FROM Courses WHERE id = @id');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Update course
        const result = await pool.request()
            .input('id', sql.VarChar(20), id)
            .input('name', sql.VarChar(100), name)
            .input('term', sql.VarChar(10), term)
            .input('program', sql.VarChar(10), program)
            .input('description', sql.VarChar, description || '')
            .input('capacity', sql.Int, capacity)
            .query(`
                UPDATE Courses 
                SET name = @name,
                    term = @term,
                    program = @program,
                    description = @description,
                    capacity = @capacity
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ msg: 'Server error while updating course' });
    }
});

module.exports = router; 