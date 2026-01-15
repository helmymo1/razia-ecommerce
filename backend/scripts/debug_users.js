const db = require('../config/db');

async function listUsers() {
    try {
        console.log('Fetching users from DB...');
        // Select critical fields to debug visibility
        const [rows] = await db.query('SELECT id, name, email, role, is_deleted, created_at FROM users');
        
        console.log(`Found ${rows.length} total users.`);
        if (rows.length > 0) {
            console.table(rows);
        } else {
            console.log('No users found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        process.exit(1);
    }
}

listUsers();
