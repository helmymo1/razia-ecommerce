const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer_shop'
};

const checkSchema = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🔍 Products Table Schema (ID):');
        const [columns] = await connection.query("SHOW COLUMNS FROM products LIKE 'id'");
        console.table(columns.map(c => ({ Field: c.Field, Type: c.Type, Key: c.Key })));
    } catch (error) {
        console.error('Failed:', error);
    } finally {
        if (connection) await connection.end();
    }
};

checkSchema();
