const sql = require('mssql');
const { poolPromise } = require('../config/db');

class Program {
    static async findAll() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Programs');
        return result.recordset;
    }

    static async findByCode(code) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('code', sql.VarChar, code)
            .query('SELECT * FROM Programs WHERE code = @code');
        return result.recordset[0];
    }

    static async create(programData) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('code', sql.VarChar, programData.code)
            .input('name', sql.VarChar, programData.name)
            .input('duration', sql.VarChar, programData.duration)
            .input('description', sql.Text, programData.description)
            .input('feesDomestic', sql.Decimal(10,2), programData.feesDomestic)
            .input('feesInternational', sql.Decimal(10,2), programData.feesInternational)
            .query(`
                INSERT INTO Programs (code, name, duration, description, feesDomestic, feesInternational)
                OUTPUT INSERTED.*
                VALUES (@code, @name, @duration, @description, @feesDomestic, @feesInternational)
            `);
        return result.recordset[0];
    }
}

module.exports = Program; 