require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'razia_store'
};

async function addAiTags() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if column exists first
        const [rows] = await connection.execute("SHOW COLUMNS FROM products LIKE 'ai_tags'");
        if (rows.length === 0) {
            console.log('Adding ai_tags column...');
            await connection.execute("ALTER TABLE products ADD COLUMN ai_tags JSON DEFAULT NULL");
            console.log('ai_tags column added successfully.');
        } else {
            console.log('ai_tags column already exists.');
        }

        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

addAiTags();
