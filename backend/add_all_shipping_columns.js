
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

async function addMissingColumns() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // Check which columns exist
        const [columns] = await connection.execute("SHOW COLUMNS FROM orders");
        const existingColumns = columns.map(c => c.Field);
        console.log("Existing columns:", existingColumns);

        const columnsToAdd = [];

        if (!existingColumns.includes('shipping_address')) {
            columnsToAdd.push("ADD COLUMN shipping_address JSON");
        }
        if (!existingColumns.includes('shipping_name')) {
            columnsToAdd.push("ADD COLUMN shipping_name VARCHAR(255)");
        }
        if (!existingColumns.includes('shipping_phone')) {
            columnsToAdd.push("ADD COLUMN shipping_phone VARCHAR(50)");
        }
        if (!existingColumns.includes('shipping_city')) {
            columnsToAdd.push("ADD COLUMN shipping_city VARCHAR(100)");
        }
        if (!existingColumns.includes('shipping_zip')) {
            columnsToAdd.push("ADD COLUMN shipping_zip VARCHAR(20)");
        }
       
        if (columnsToAdd.length > 0) {
            console.log("Adding columns:", columnsToAdd.join(', '));
            const query = `ALTER TABLE orders ${columnsToAdd.join(', ')}`;
            await connection.query(query);
            console.log("Columns added successfully.");
        } else {
            console.log("All shipping columns already exist.");
        }

    } catch (error) {
        console.error('Error adding columns:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addMissingColumns();
