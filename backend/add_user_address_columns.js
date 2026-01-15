
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const columns = [
  "ADD COLUMN address VARCHAR(255) DEFAULT NULL",
  "ADD COLUMN city VARCHAR(100) DEFAULT NULL",
  "ADD COLUMN zip VARCHAR(20) DEFAULT NULL",
  "ADD COLUMN country VARCHAR(100) DEFAULT NULL",
  "ADD COLUMN phone VARCHAR(20) DEFAULT NULL"
];

(async () => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    for (const colDef of columns) {
      try {
        await connection.query(`ALTER TABLE users ${colDef}`);
        console.log(`Successfully executed: ${colDef}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists (skipped): ${colDef}`);
        } else {
          console.error(`Error adding column ${colDef}:`, error.message);
        }
      }
    }

  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    if (connection) await connection.end();
  }
})();
