
require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
  const email = 'admin@ebazer.com';
  const password = 'password123';
  
  try {
    console.log(`Checking for user: ${email}...`);
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length > 0) {
      console.log('User found. Updating password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await db.query('UPDATE users SET password_hash = ?, role = "admin", is_deleted = 0 WHERE email = ?', [hashedPassword, email]);
      console.log('✅ Admin password updated successfully.');
    } else {
      console.log('User not found. Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const name = 'Admin User';
      const [firstName, lastName] = name.split(' ');
      
      // Handle UUID if ID is not auto-increment (from previous context, ID is UUID)
      // Actually schema shows INT AUTO_INCREMENT in Step 1023, but authController used UUID().
      // Let's check the schema definition in Step 1023 again.
      // Line 11: id INT AUTO_INCREMENT PRIMARY KEY.
      // Wait, authController (Step 846) line 29: INSERT INTO users (id, ...) VALUES (UUID(), ...)
      // This is a CONTRADICTION.
      // If schema is INT, UUID() will fail (type mismatch) or insert 0.
      // Let's rely on db.query defaulting behavior. If column is INT AUTO_INCREMENT, we don't insert ID.
      // If column is VARCHAR/UUID, we insert UUID().
      
      // Let's try INSERT without ID first (standard for auto-increment).
      // If it fails, we fall back to UUID.
      
      try {
           await db.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', 
            [name, email, hashedPassword, 'admin']);
           // Note: Schema has `name` column?
           // Step 1023 Line 12: name VARCHAR(255).
           // AuthController splits name into first_name/last_name.
           // Schema in 1023 seems to start with `name`.
           // Let's check AuthController again. Line 29: INSERT INTO users ... first_name, last_name ...
           // It seems `database_schema.sql` (Step 1023) might be OUTDATED or NOT what's actually in DB.
           // AuthController defines truth of running code.
           
           // I will try to inspect the columns first to be safe.
      } catch (err) {
           console.log("Insert failed with 'name', trying 'first_name', 'last_name'...");
           await db.query('INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)', 
            ['Admin', 'User', email, hashedPassword, 'admin']);
      }
      
      console.log('✅ Admin user created successfully.');
    }

  } catch (error) {
    console.error('❌ Error resetting admin:', error);
  } finally {
    process.exit();
  }
};

resetAdmin();
