
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer',
};

async function addColumns() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const alterQuery = `
            ALTER TABLE orders
            ADD COLUMN shipping_name VARCHAR(255) AFTER shipping_address,
            ADD COLUMN shipping_phone VARCHAR(50) AFTER shipping_name,
            ADD COLUMN shipping_city VARCHAR(100) AFTER shipping_phone,
            ADD COLUMN shipping_zip VARCHAR(20) AFTER shipping_city;
        `;

        console.log('Running ALTER TABLE...');
        await connection.query(alterQuery);
        console.log('Columns added successfully.');

    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
             console.log('Columns already exist.');
        } else {
            console.error('Error adding columns:', error);
        }
    } finally {
        if (connection) await connection.end();
    }
}

addColumns();
