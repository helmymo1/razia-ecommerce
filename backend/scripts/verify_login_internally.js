const db = require('../config/db');
const bcrypt = require('bcryptjs');

const verifyLogin = async () => {
    try {
        const email = 'admin@ebazer.com';
        const passwordToCheck = 'password123';

        console.log(`Verifying login for ${email} with password '${passwordToCheck}'...`);

        // 1. Fetch User
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            console.error('❌ User not found in DB!');
            process.exit(1);
        }

        const user = users[0];
        console.log(`Found user: ID=${user.id}, Role=${user.role}, IsDeleted=${user.is_deleted}`);
        console.log(`Stored Hash: ${user.password_hash}`);

        if (user.is_deleted) {
             console.error('❌ User is marked as deleted!');
        }

        // 2. Compare Password
        const isMatch = await bcrypt.compare(passwordToCheck, user.password_hash);

        if (isMatch) {
            console.log('✅ SUCCESS: Password matches hash!');
        } else {
            console.error('❌ FAILURE: Password does NOT match hash.');
            
            // Debug: Generate what the hash SHOULD be roughly
            const testHash = await bcrypt.hash(passwordToCheck, 10);
            console.log(`Test new hash for '${passwordToCheck}': ${testHash}`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyLogin();
