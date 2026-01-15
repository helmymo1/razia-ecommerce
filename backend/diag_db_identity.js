const mysql = require('mysql2/promise');
const config = require('./config/db'); // Use the project's config logic

async function checkConnection() {
  console.log('Testing connection to:', process.env.DB_HOST, process.env.DB_PORT);
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'ebazer_shop',
      port: process.env.DB_PORT || 3306
    });
    console.log('Successfully connected to database!');
    const [rows] = await connection.execute('SELECT @@hostname as hostname, @@port as port');
    console.log('Connected to MySQL Container:', rows[0]);
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

checkConnection();
