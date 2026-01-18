const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');
const { generateReferralCode } = require('../utils/codeGenerator');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer_shop'
};

const migrate = async () => {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected.');

        // 1. Check/Add `personal_referral_code` to `users`
        console.log('🔍 Checking `users` table for `personal_referral_code`...');
        const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'personal_referral_code'`);
        
        if (columns.length === 0) {
            console.log('➕ Adding `personal_referral_code` column...');
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN personal_referral_code VARCHAR(20) UNIQUE,
                ADD INDEX idx_referral_code (personal_referral_code)
            `);
            console.log('✅ Column added.');

            // Backfill existing users
            console.log('🔄 Backfilling referral codes for existing users...');
            const [users] = await connection.query('SELECT id, name FROM users');
            
            for (const user of users) {
                const code = generateReferralCode(user.name || 'User');
                // Use UPDATE with IGNORE or try/catch in loop to handle rare collisions if needed
                // But simple UPDATE is fine for this script
                await connection.query('UPDATE users SET personal_referral_code = ? WHERE id = ?', [code, user.id]);
                console.log(`   > Assigned ${code} to User ID ${user.id}`);
            }
            console.log('✅ Backfill complete.');
        } else {
            console.log('ℹ️ `personal_referral_code` already exists. Skipping add/backfill.');
        }

        // 2. Create `referrals` table
        console.log('🔍 Checking/Creating `referrals` table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS referrals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                referrer_id CHAR(36) NOT NULL,
                referee_id CHAR(36), 
                referee_order_id CHAR(36),
                status ENUM('pending', 'completed', 'fraud_suspected') DEFAULT 'pending',
                reward_coupon_code VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (referee_id) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (referee_order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ `referrals` table ready.');

        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

migrate();
