const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: 'SQLEXPRESS'
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Create a new connection pool
const pool = new sql.ConnectionPool(config);

// Create a connection pool promise
const poolPromise = pool.connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed!', err);
        throw err;
    });

// Handle pool errors
pool.on('error', err => {
    console.error('Database pool error:', err);
});

// Function to test database connection
const testConnection = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT 1 as test');
        console.log('Database connection test successful');
        return true;
    } catch (err) {
        console.error('Database connection test failed:', err);
        return false;
    }
};

module.exports = {
    sql,
    poolPromise,
    testConnection
}; 