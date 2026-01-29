const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer',
};

async function addDeliveryErrorColumn() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const [columns] = await connection.execute("SHOW COLUMNS FROM orders LIKE 'delivery_error'");
        
        if (columns.length === 0) {
            console.log('Adding delivery_error column...');
            await connection.execute("ALTER TABLE orders ADD COLUMN delivery_error TEXT NULL DEFAULT NULL");
            console.log('delivery_error column added.');
        } else {
            console.log('delivery_error column already exists.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addDeliveryErrorColumn();
