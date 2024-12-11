const sql = require('mssql');
const { poolPromise } = require('../config/db');

class Course {
    static async findAll() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    id,
                    code,
                    name,
                    term,
                    program,
                    description
                FROM Courses
            `);
        return result.recordset;
    }

    static async findById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .query(`
                SELECT 
                    id,
                    code,
                    name,
                    term,
                    program,
                    description
                FROM Courses
                WHERE id = @id
            `);
        return result.recordset[0];
    }

    static async create(courseData) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('code', sql.VarChar, courseData.code)
            .input('name', sql.VarChar, courseData.name)
            .input('term', sql.VarChar, courseData.term)
            .input('program', sql.VarChar, courseData.program)
            .input('description', sql.Text, courseData.description)
            .query(`
                INSERT INTO Courses (id, code, name, term, program, description)
                OUTPUT INSERTED.*
                VALUES (@code, @code, @name, @term, @program, @description);
            `);
        return result.recordset[0];
    }
}

module.exports = Course; 