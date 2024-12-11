const sql = require('mssql');
const { poolPromise } = require('../config/db');

class Registration {
    static async create(studentId, courseId) {
        const pool = await poolPromise;
        
        // Simple duplicate check
        const existing = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('courseId', sql.Int, courseId)
            .query('SELECT COUNT(*) as count FROM CourseRegistrations WHERE studentId = @studentId AND courseId = @courseId');
            
        if (existing.recordset[0].count > 0) {
            throw new Error('Already registered for this course');
        }

        // Insert with status and registrationDate
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('courseId', sql.Int, courseId)
            .input('status', sql.VarChar(50), 'Enrolled')
            .input('registrationDate', sql.DateTime, new Date())
            .query(`
                INSERT INTO CourseRegistrations (studentId, courseId, status, registrationDate)
                OUTPUT INSERTED.*
                VALUES (@studentId, @courseId, @status, @registrationDate)
            `);
            
        return result.recordset[0];
    }

    static async findByStudent(studentId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    cr.id,
                    cr.studentId,
                    cr.courseId,
                    cr.status,
                    cr.grade,
                    cr.registrationDate,
                    c.code as courseCode,
                    c.name as courseName,
                    c.term,
                    c.program,
                    c.description,
                    c.capacity,
                    (SELECT COUNT(*) FROM CourseRegistrations WHERE courseId = c.id) as enrolled
                FROM CourseRegistrations cr
                JOIN Courses c ON cr.courseId = c.id
                WHERE cr.studentId = @studentId
                ORDER BY cr.registrationDate DESC
            `);
        
        return result.recordset.map(record => ({
            ...record,
            isFull: record.enrolled >= record.capacity,
            availableSeats: record.capacity - record.enrolled
        }));
    }

    static async delete(studentId, courseId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('courseId', sql.Int, courseId)
            .query('DELETE FROM CourseRegistrations WHERE studentId = @studentId AND courseId = @courseId');
        return result.rowsAffected[0] > 0;
    }

    static async updateStatus(studentId, courseId, status) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('courseId', sql.Int, courseId)
            .input('status', sql.VarChar(50), status)
            .query(`
                UPDATE CourseRegistrations 
                SET status = @status
                WHERE studentId = @studentId AND courseId = @courseId
            `);
        return result.rowsAffected[0] > 0;
    }

    static async updateGrade(studentId, courseId, grade) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('courseId', sql.Int, courseId)
            .input('grade', sql.VarChar(10), grade)
            .query(`
                UPDATE CourseRegistrations 
                SET grade = @grade
                WHERE studentId = @studentId AND courseId = @courseId
            `);
        return result.rowsAffected[0] > 0;
    }
}

module.exports = Registration; 