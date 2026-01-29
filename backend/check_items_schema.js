const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: process.env.DB_PORT || 3306
};

async function checkSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        const [itemsCols] = await connection.query("SHOW COLUMNS FROM order_items");
        console.log("\n--- order_items Columns ---");
        itemsCols.forEach(col => console.log(col.Field));

        const [prodCols] = await connection.query("SHOW COLUMNS FROM products");
        console.log("\n--- products Columns ---");
        prodCols.forEach(col => console.log(col.Field));

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkSchema();
