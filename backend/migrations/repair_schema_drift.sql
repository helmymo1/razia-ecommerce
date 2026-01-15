-- Emergency Repair Kit (Robust Version)
-- Split into individual statements to handle older MySQL versions where IF NOT EXISTS might fail or block the whole ALTER

-- 1. Fix Users Table
ALTER TABLE users ADD COLUMN name VARCHAR(255) AFTER id;
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN address TEXT;

-- 2. Fix Products Table
ALTER TABLE products ADD COLUMN quantity INT DEFAULT 0;
ALTER TABLE products ADD COLUMN shipping_width DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE products ADD COLUMN image_url VARCHAR(500);
ALTER TABLE products ADD COLUMN discount_type VARCHAR(50) DEFAULT 'none';
ALTER TABLE products ADD COLUMN tags JSON;
ALTER TABLE products MODIFY COLUMN slug VARCHAR(255) DEFAULT NULL;

-- 3. Fix Orders Table
ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN unit_price DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN product_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE orders MODIFY COLUMN order_number VARCHAR(50) DEFAULT 'ORD-TEMP';

-- 4. Create Missing Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255),
  address_line1 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Fix Categories
ALTER TABLE categories MODIFY name_ar VARCHAR(255) NULL;

-- 6. Final Soft Delete Patch
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_deleted TINYINT(1) DEFAULT 0;
