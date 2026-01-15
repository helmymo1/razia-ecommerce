
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

(async () => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    // 1. Drop existing table
    await connection.query("DROP TABLE IF EXISTS addresses");
    console.log('Dropped existing addresses table.');

    // 2. Create new table (UUID based, but with 'title' and request fields)
    const createTableQuery = `
      CREATE TABLE addresses (
        id CHAR(36) NOT NULL PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        title VARCHAR(50) DEFAULT 'Home',
        address_line1 TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100),
        zip VARCHAR(20),
        country VARCHAR(100) DEFAULT 'Saudi Arabia',
        phone VARCHAR(20) NOT NULL,
        is_default TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.query(createTableQuery);
    console.log('✅ Created addresses table with title/label support.');

  } catch (error) {
    console.error('Error modifying table:', error);
  } finally {
    if (connection) await connection.end();
  }
})();
