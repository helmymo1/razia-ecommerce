const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const db = require('../config/db');

const migrate = async () => {
    try {
        console.log('🔌 Connected to database...');

        await db.query(`
            CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                discount_type ENUM('percentage', 'fixed') NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                start_date DATETIME,
                end_date DATETIME,
                usage_limit INT DEFAULT NULL,
                usage_count INT DEFAULT 0,
                status ENUM('active', 'inactive') DEFAULT 'active',
                is_deleted BOOLEAN DEFAULT 0,
                user_specific_id CHAR(36) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        // Note: added user_specific_id which might be useful for referral rewards limiting to referrer
        
        console.log('✅ Coupons table created/verified.');

    } catch (error) {
        console.error('❌ Migration Failed:', error);
    } finally {
        // Pool manages connections, we just exit
        process.exit();
    }
};

migrate();
