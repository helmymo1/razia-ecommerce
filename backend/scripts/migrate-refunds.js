require('dotenv').config({ path: '../.env' });
const db = require('../config/db');

async function migrate() {
    try {
        console.log("Running migration...");
        await db.query(`
            ALTER TABLE orders MODIFY COLUMN payment_status 
            ENUM('pending', 'paid', 'failed', 'refunded', 'refund_requested') 
            NOT NULL DEFAULT 'pending';
        `);
        console.log("✅ Migration successful: Added 'refund_requested' to payment_status ENUM.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrate();
