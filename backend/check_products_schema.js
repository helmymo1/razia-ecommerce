require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'razia_store'
};

async function checkSchema() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('DESCRIBE products');
        console.log('--- Products Table Schema ---');
        console.table(rows);
        await connection.end();
    } catch (error) {
        console.error('Schema check failed:', error);
    }
}

checkSchema();
