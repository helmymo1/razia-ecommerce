
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer',
};


async function checkSchema() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');
        
        const [columns] = await connection.execute("SHOW COLUMNS FROM orders");
        const columnNames = columns.map(c => c.Field);
        
        console.log('Existing columns in orders table:', columnNames.join(', '));
        
        const missing = ['shipping_name', 'shipping_address', 'shipping_city', 'shipping_zip', 'shipping_phone'].filter(
            col => !columnNames.includes(col)
        );
        
        if (missing.length > 0) {
            console.log('MISSING COLUMNS:', missing.join(', '));
        } else {
            console.log('All shipping columns are present.');
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkSchema();
