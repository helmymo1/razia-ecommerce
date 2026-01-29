const db = require('./config/db');

async function migrateOrders() {
    try {
        console.log("Checking orders table schema...");
        const [columns] = await db.query("SHOW COLUMNS FROM orders");
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('delivery_id')) {
            console.log("➕ Adding delivery_id column...");
            await db.query("ALTER TABLE orders ADD COLUMN delivery_id VARCHAR(100) DEFAULT NULL AFTER status");
        } else {
            console.log("✅ delivery_id already exists.");
        }

        if (!columnNames.includes('delivery_status')) {
            console.log("➕ Adding delivery_status column...");
            await db.query("ALTER TABLE orders ADD COLUMN delivery_status VARCHAR(50) DEFAULT 'pending' AFTER delivery_id");
        } else {
            console.log("✅ delivery_status already exists.");
        }

        console.log("✅ Migration Complete.");
        process.exit(0);

    } catch (err) {
        console.error("❌ Migration Failed:", err.message);
        process.exit(1);
    }
}

migrateOrders();
