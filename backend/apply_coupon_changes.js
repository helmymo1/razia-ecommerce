const db = require('./config/db');

async function applyChanges() {
  try {
    const connection = await db.getConnection();
    console.log("Connected to database.");
    
    // Create coupons table
    await connection.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log("Coupons table created or already exists.");

    // Check if coupon_id column exists in orders
    const [columns] = await connection.query("SHOW COLUMNS FROM orders LIKE 'coupon_id'");
    if (columns.length === 0) {
        // Add column and FK
        await connection.query(`
            ALTER TABLE orders 
            ADD COLUMN coupon_id INT DEFAULT NULL,
            ADD CONSTRAINT fk_order_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
        `);
        console.log("Added coupon_id to orders table.");
    } else {
        console.log("coupon_id already exists in orders table.");
    }

    connection.release();
    console.log("Schema update complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error applying changes:", error);
    process.exit(1);
  }
}

applyChanges();
