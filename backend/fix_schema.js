const db = require('./config/db');

const fixSchema = async () => {
    try {
        console.log("🛠️ Starting Schema Fix...");

        // 1. Fix ORDERS table
        console.log("... Fixing 'orders' table (Adding missing columns)");
        const orderColumns = [
            "ADD COLUMN order_number VARCHAR(100) AFTER id",
            "ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0 AFTER total_amount", 
            "ADD COLUMN shipping_name VARCHAR(255)", 
            "ADD COLUMN shipping_phone VARCHAR(50)", 
            "ADD COLUMN shipping_address TEXT", 
            "ADD COLUMN shipping_city VARCHAR(100)", 
            "ADD COLUMN shipping_zip VARCHAR(20)",
            "ADD COLUMN total DECIMAL(10,2) DEFAULT 0",
            "ADD COLUMN is_paid BOOLEAN DEFAULT 0",
            "ADD COLUMN paid_at DATETIME",
            "ADD COLUMN is_delivered BOOLEAN DEFAULT 0",
            "ADD COLUMN delivered_at DATETIME",
            "ADD COLUMN payment_result JSON",
             "ADD COLUMN refund_requests JSON"
        ];

        for (const col of orderColumns) {
            try {
                await db.query(`ALTER TABLE orders ${col}`);
                console.log(`   -> Executed: ${col}`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log(`   -> Skipped (Exists): ${col.split(' ')[2]}`);
                } else {
                    console.warn(`   ⚠️ Error adding column: ${e.message}`);
                }
            }
        }


        // 2. Fix ORDER_ITEMS table
        console.log("... Fixing 'order_items' table");
        const itemColumns = [
            "ADD COLUMN total_price DECIMAL(10,2) DEFAULT 0",
            "ADD COLUMN product_name VARCHAR(255)",
             "ADD COLUMN item_status ENUM('active','cancelled','returned','refunded','processing','delivered') DEFAULT 'active'",
             "ADD COLUMN refund_status ENUM('idle','requested','approved','rejected') DEFAULT 'idle'",
             "ADD COLUMN refund_reason TEXT",
            "ADD COLUMN refund_quantity INT DEFAULT 0",
            "ADD COLUMN cancel_reason TEXT"
        ];

        for (const col of itemColumns) {
             try {
                await db.query(`ALTER TABLE order_items ${col}`);
                console.log(`   -> Executed: ${col}`);
            } catch (e) {
                 if (e.code === 'ER_DUP_FIELDNAME') {
                    // Ignore
                } else {
                    console.warn(`   ⚠️ Error adding column: ${e.message}`);
                }
            }
        }

        console.log("✅ Schema Fix Complete. Please restart backend if needed.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Schema Fix Failed:", error);
        process.exit(1);
    }
};

fixSchema();
