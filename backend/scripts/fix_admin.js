const bcrypt = require('bcryptjs');
const db = require('../config/db');

(async () => {
    try {
        console.log("Checking for admin user...");
        const email = 'admin@example.com';
        const password = '123456';
        
        // Generate hash using the EXACT library the app uses
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        console.log(`Generated Hash for '${password}': ${hash}`);

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length > 0) {
            console.log("Admin user exists. Updating password...");
            await db.query(
                'UPDATE users SET password_hash = ?, role = ?, is_deleted = 0 WHERE email = ?',
                [hash, 'admin', email]
            );
        } else {
            console.log("Admin user does not exist. Creating...");
            await db.query(
                `INSERT INTO users (id, first_name, last_name, email, password_hash, role, is_deleted) 
                 VALUES (UUID(), 'Admin', 'User', ?, ?, 'admin', 0)`,
                [email, hash]
            );
        }
        
        console.log("✅ Admin password reset successfully to '123456'");
        process.exit(0);
    } catch (e) {
        console.error("❌ Error:", e);
        process.exit(1);
    }
})();
