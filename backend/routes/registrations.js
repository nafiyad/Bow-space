const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { auth } = require('../middleware/auth');
const { poolPromise } = require('../config/db');

// Get student's registered courses
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('studentId', sql.Int, req.params.studentId)
            .query(`
                SELECT 
                    c.id,
                    c.code,
                    c.name,
                    c.term,
                    c.program,
                    c.description,
                    c.capacity,
                    cr.registrationDate,
                    (SELECT COUNT(*) FROM CourseRegistrations WHERE courseId = c.id) as enrolled
                FROM Courses c
                JOIN CourseRegistrations cr ON c.id = cr.courseId
                WHERE cr.studentId = @studentId
                ORDER BY cr.registrationDate DESC
            `);
        
        const courses = result.recordset.map(course => ({
            ...course,
            isFull: course.enrolled >= course.capacity,
            availableSeats: course.capacity - course.enrolled
        }));
        
        res.json(courses);
    } catch (err) {
        console.error('Error fetching student courses:', err);
        res.status(500).json({ msg: 'Server error while fetching registered courses' });
    }
});

// Register for a course
router.post('/', auth, async (req, res) => {
    const { studentId, courseId } = req.body;

    // Validate input
    if (!studentId || !courseId) {
        return res.status(400).json({ msg: 'Student ID and Course ID are required' });
    }

    // Convert studentId to integer, keep courseId as string
    const studentIdInt = parseInt(studentId, 10);
    const courseIdStr = courseId.toString().trim();

    if (isNaN(studentIdInt) || studentIdInt <= 0) {
        return res.status(400).json({ msg: 'Invalid student ID format' });
    }

    if (!courseIdStr) {
        return res.status(400).json({ msg: 'Invalid course ID format' });
    }

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Check if student exists and is a student
            const studentResult = await transaction.request()
                .input('studentId', sql.Int, studentIdInt)
                .query('SELECT id, role FROM Users WHERE id = @studentId AND role = \'student\'');

            if (studentResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ msg: 'Student not found or invalid role' });
            }

            // Check current number of registered courses
            const registrationCountResult = await transaction.request()
                .input('studentId', sql.Int, studentIdInt)
                .query(`
                    SELECT COUNT(*) as courseCount 
                    FROM CourseRegistrations 
                    WHERE studentId = @studentId AND status = 'Enrolled'
                `);

            const currentCourseCount = registrationCountResult.recordset[0].courseCount;
            if (currentCourseCount >= 5) {
                await transaction.rollback();
                return res.status(400).json({ 
                    msg: 'Cannot register for more than 5 courses',
                    currentCount: currentCourseCount
                });
            }

            // Check if course exists and has capacity
            const courseResult = await transaction.request()
                .input('courseId', sql.VarChar(20), courseIdStr)
                .query(`
                    SELECT 
                        id, 
                        code,
                        capacity,
                        (SELECT COUNT(*) FROM CourseRegistrations WHERE courseId = Courses.id) as enrolled
                    FROM Courses
                    WHERE id = @courseId
                `);

            if (courseResult.recordset.length === 0) {
                console.log('Course not found');
                await transaction.rollback();
                return res.status(404).json({ msg: 'Course not found' });
            }

            const course = courseResult.recordset[0];
            console.log('Course details:', course);

            // Check if course is full
            if (course.enrolled >= course.capacity) {
                console.log('Course is full');
                await transaction.rollback();
                return res.status(400).json({ msg: 'Course is full' });
            }

            // Check if already registered
            console.log('Checking existing registration...');
            const checkResult = await transaction.request()
                .input('studentId', sql.Int, studentIdInt)
                .input('courseId', sql.VarChar(20), courseIdStr)
                .query('SELECT id FROM CourseRegistrations WHERE studentId = @studentId AND courseId = @courseId');

            if (checkResult.recordset.length > 0) {
                console.log('Already registered');
                await transaction.rollback();
                return res.status(400).json({ msg: 'Already registered for this course' });
            }

            // Register for the course
            console.log('Inserting registration...');
            const insertResult = await transaction.request()
                .input('studentId', sql.Int, studentIdInt)
                .input('courseId', sql.VarChar(20), courseIdStr)
                .input('status', sql.VarChar(50), 'Enrolled')
                .input('registrationDate', sql.DateTime, new Date())
                .query(`
                    INSERT INTO CourseRegistrations (studentId, courseId, status, registrationDate)
                    OUTPUT INSERTED.*
                    VALUES (@studentId, @courseId, @status, @registrationDate)
                `);

            console.log('Registration inserted:', insertResult.recordset[0]);
            await transaction.commit();
            console.log('Transaction committed');

            res.json({ 
                msg: 'Successfully registered for the course',
                courseId: courseIdStr,
                registration: insertResult.recordset[0]
            });
        } catch (err) {
            console.error('Transaction error:', err);
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error while registering for course' });
    }
});

// Unregister from a course
router.delete('/:studentId/:courseId', auth, async (req, res) => {
    const studentIdInt = parseInt(req.params.studentId, 10);
    const courseIdStr = decodeURIComponent(req.params.courseId).trim();

    if (isNaN(studentIdInt) || studentIdInt <= 0) {
        return res.status(400).json({ msg: 'Invalid student ID format' });
    }

    if (!courseIdStr) {
        return res.status(400).json({ msg: 'Invalid course ID format' });
    }

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Check if registration exists
            const checkResult = await transaction.request()
                .input('studentId', sql.Int, studentIdInt)
                .input('courseId', sql.VarChar(20), courseIdStr)
                .query('SELECT id FROM CourseRegistrations WHERE studentId = @studentId AND courseId = @courseId');

            if (checkResult.recordset.length === 0) {
                console.log('Registration not found');
                await transaction.rollback();
                return res.status(404).json({ msg: 'Course registration not found' });
            }

            // Delete the registration
            console.log('Deleting registration...');
            await transaction.request()
                .input('studentId', sql.Int, studentIdInt)
                .input('courseId', sql.VarChar(20), courseIdStr)
                .query('DELETE FROM CourseRegistrations WHERE studentId = @studentId AND courseId = @courseId');

            await transaction.commit();
            console.log('Transaction committed');
            
            res.json({ 
                msg: 'Successfully unregistered from the course',
                courseId: courseIdStr
            });
        } catch (err) {
            console.error('Transaction error:', err);
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error('Unregistration error:', err);
        res.status(500).json({ msg: 'Server error while unregistering from course' });
    }
});

module.exports = router; 