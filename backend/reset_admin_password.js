const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function resetAdmin() {
    try {
        console.log("🔒 Generating password hash...");
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const email = 'admin@example.com';
        const firstName = 'Admin';
        const lastName = 'User';
        const role = 'admin';

        console.log(`🔍 Checking for existing user: ${email}`);
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length > 0) {
            console.log("👤 User exists. Updating password and role...");
            await db.query(
                'UPDATE users SET password_hash = ?, role = ?, is_deleted = 0 WHERE email = ?',
                [passwordHash, role, email]
            );
            console.log("✅ Admin updated successfully.");
        } else {
            console.log("👤 User does not exist. Creating new admin...");
            await db.query(
                'INSERT INTO users (id, first_name, last_name, email, password_hash, role) VALUES (UUID(), ?, ?, ?, ?, ?)',
                [firstName, lastName, email, passwordHash, role]
            );
            console.log("✅ Admin created successfully.");
        }
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to reset admin:", error);
        process.exit(1);
    }
}

resetAdmin();
