const mysql = require('mysql2/promise');

const isTestEnv = process.env.NODE_ENV === 'test';

let pool;

if (isTestEnv) {
    pool = mysql.createPool({
        host: process.env.TEST_DB_HOST || process.env.DB_HOST,
        user: process.env.TEST_DB_USER || process.env.DB_USER,
        password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD,
        database: process.env.TEST_DB_NAME || process.env.DB_NAME || 'test_db',
        connectionLimit: 10,
        queueLimit: 0
    });
    getDBName = () => process.env.TEST_DB_NAME || process.env.DB_NAME || 'test_db';
} else {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10,
        queueLimit: 0
    });
 
}

module.exports = pool;