const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function resetAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const { v4: uuidv4 } = require('uuid');
  const email = 'admin@ebazer.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Resetting admin user (${email})...`);

  // Check if user exists
  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

  if (rows.length > 0) {
    // Update existing
    await connection.execute('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
    console.log('✅ Admin password updated to:', password);
  } else {
    // Create new
    const id = uuidv4();
    await connection.execute(
      'INSERT INTO users (id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, 'Admin', 'User', email, hashedPassword, 'admin']
    );
    console.log('✅ Admin user created with password:', password);
  }

  await connection.end();
}

resetAdmin().catch(err => {
  console.error('Failed to reset admin:', err);
  process.exit(1);
});
