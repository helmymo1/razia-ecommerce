const db = require('../config/db');

async function applyRobustnessSchema() {
    console.log('🔧 Applying Robustness Schema Changes...');

    // 1. Add is_deleted to coupons
    try {
        await db.query(`ALTER TABLE coupons ADD COLUMN is_deleted BOOLEAN DEFAULT 0`);
        console.log('✅ Added is_deleted to coupons table.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️ Column is_deleted already exists in coupons (skipped).');
        } else {
            console.error('❌ Failed to update coupons table:', err.message);
        }
    }

    // 2. Create audit_logs table
    const auditLogSql = `
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT,
            action VARCHAR(255) NOT NULL,
            target_id INT,
            details JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB;
    `;

    try {
        await db.query(auditLogSql);
        console.log('✅ Audit Logs table created/verified.');
    } catch (err) {
        console.error('❌ Failed to create audit_logs table:', err.message);
    }
    
    console.log('🏁 Schema Update Process Completed.');
    process.exit(0);
}

applyRobustnessSchema();
