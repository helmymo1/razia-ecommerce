
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Robustly load .env from backend root
dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
};

async function addColumns() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const alterQuery = `
            ALTER TABLE orders
            ADD COLUMN delivery_id VARCHAR(100) DEFAULT NULL,
            ADD COLUMN delivery_status VARCHAR(50) DEFAULT 'pending',
            ADD COLUMN tracking_number VARCHAR(100) DEFAULT NULL;
        `;

        console.log('Running ALTER TABLE...');
        await connection.query(alterQuery);
        console.log('Columns added successfully.');

    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
             console.log('Columns already exist (ER_DUP_FIELDNAME).');
        } else {
            console.error('Error adding columns:', error);
        }
    } finally {
        if (connection) await connection.end();
    }
}

addColumns();
