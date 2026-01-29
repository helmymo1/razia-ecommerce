const db = require('./config/db');

async function addRefundColumns() {
  console.log("🛠 Starting Schema Migration for Partial Refunds...");
  
  const connection = await db.getConnection();
  try {
    // 1. Add columns to order_items
    console.log("👉 Checking order_items table...");
    
    // Check if column exists to avoid duplicate error
    const [columns] = await connection.query("SHOW COLUMNS FROM order_items LIKE 'refund_status'");
    
    if (columns.length === 0) {
      console.log("   Adding refund_status, refund_reason, refund_quantity to order_items...");
      await connection.query(`
        ALTER TABLE order_items
        ADD COLUMN refund_status ENUM('idle', 'requested', 'approved', 'rejected') DEFAULT 'idle',
        ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL,
        ADD COLUMN refund_quantity INT DEFAULT 0
      `);
      console.log("   ✅ Columns added to order_items.");
    } else {
      console.log("   Info: refund_status already exists in order_items.");
    }

    // 2. Add refund_requests to orders
    console.log("👉 Checking orders table...");
    const [orderCols] = await connection.query("SHOW COLUMNS FROM orders LIKE 'refund_requests'");
    
    if (orderCols.length === 0) {
      console.log("   Adding refund_requests JSON column to orders...");
      await connection.query(`
        ALTER TABLE orders
        ADD COLUMN refund_requests JSON DEFAULT NULL
      `);
      console.log("   ✅ refund_requests added to orders.");
    } else {
      console.log("   Info: refund_requests already exists in orders.");
    }

    console.log("🎉 Migration Complete!");

  } catch (error) {
    console.error("❌ Migration Failed:", error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

addRefundColumns();
