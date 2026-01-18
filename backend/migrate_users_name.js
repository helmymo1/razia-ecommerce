const db = require('./config/db');

const migrateUsers = async () => {
    try {
        console.log('Starting migration...');
        
        // Add columns if they don't exist
        try {
            await db.query("ALTER TABLE users ADD COLUMN first_name VARCHAR(255) AFTER id");
            await db.query("ALTER TABLE users ADD COLUMN last_name VARCHAR(255) AFTER first_name");
            console.log('Columns added.');
        } catch (e) {
            console.log('Columns likely exist, skipping ADD COLUMN.');
        }

        // Fetch all users
        const [users] = await db.query("SELECT id, name FROM users");
        console.log(`Found ${users.length} users to migrate.`);

        for (const user of users) {
             const parts = (user.name || '').trim().split(' ');
             const first = parts[0] || '';
             const last = parts.slice(1).join(' ') || '';
             
             await db.query("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?", [first, last, user.id]);
        }
        
        console.log('Migration complete.');
        process.exit();

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateUsers();
