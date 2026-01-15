const db = require('../config/db');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
  try {
    const email = 'admin@ebazer.com';
    const newPassword = '123456';
    
    console.log(`Resetting password for ${email}...`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const [result] = await db.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows > 0) {
      console.log('Password updated successfully.');
    } else {
      console.log('User not found.');
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
