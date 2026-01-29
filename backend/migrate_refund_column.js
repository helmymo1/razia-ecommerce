const db = require('./config/db');

async function migrate() {
  try {
    console.log("Checking orders table schema...");
    const [columns] = await db.query("SHOW COLUMNS FROM orders LIKE 'refund_requests'");
    
    if (columns.length === 0) {
      console.log("⚠️ Column 'refund_requests' missing. Adding it...");
      await db.query("ALTER TABLE orders ADD COLUMN refund_requests JSON DEFAULT NULL");
      console.log("✅ Column 'refund_requests' added successfully.");
    } else {
      console.log("✅ Column 'refund_requests' already exists.");
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration Failed:", err.message);
    process.exit(1);
  }
}

migrate();
