const db = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const importData = async () => {
  try {
    console.log('🔌 Connecting to MySQL...');

    // 1. Clear existing data (Robustly)
    console.log('🗑️  Clearing old data...');
    const tables = ['refund_requests', 'order_items', 'orders', 'wishlist', 'product_images', 'products', 'categories', 'users'];
    for (const table of tables) {
        try {
            await db.query(`DELETE FROM ${table}`);
        } catch (err) {
            console.log(`⚠️  Skipping delete for ${table}: ${err.message}`);
        }
    }

    // 2. Seed Users
    console.log('👤 Seeding Users...');
    
    // Explicitly hash '123456' to ensure 100% login success
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    // Schema: id (UUID), first_name, last_name, email, password_hash, role
    await db.query(`
      INSERT INTO users (id, first_name, last_name, email, password_hash, role) VALUES 
      (UUID(), 'Admin', 'User', 'admin@ebazer.com', ?, 'admin'),
      (UUID(), 'John', 'Doe', 'customer@example.com', ?, 'customer'),
      (UUID(), 'Start', 'Admin', 'admin@example.com', ?, 'admin'),
      (UUID(), 'Start', 'User', 'user@example.com', ?, 'customer')
    `, [passwordHash, passwordHash, passwordHash, passwordHash]);
    
    console.log('User Credentials Created:');
    console.log(' - Admin: admin@ebazer.com / 123456 (or admin@example.com)');
    console.log(' - Customer: customer@example.com / 123456 (or user@example.com)');

    // 3. Seed Categories
    console.log('wm  Seeding Categories...');
    // Schema: name_en, name_ar, slug, image_url
    await db.query(`
      INSERT INTO categories (id, name_en, name_ar, slug, image_url) VALUES
      (1, 'Electronics', 'Electronics', 'electronics', '/uploads/cat-electronics.jpg'),
      (2, 'Fashion', 'Fashion', 'fashion', '/uploads/cat-fashion.jpg'),
      (3, 'Home & Garden', 'Home & Garden', 'home-garden', '/uploads/cat-home.jpg')
    `);

    // 4. Seed Products
    console.log('📦 Seeding Products...');
    // Schema: id (UUID), name_en, sku, price, stock_quantity, category_id, description_en, image_url
    const products = [
      ['TS-001', 'Classic White T-Shirt', 29.99, 100, 2, 'Premium cotton t-shirt', '/uploads/tshirt.jpg'],
      ['DJ-001', 'Denim Jacket', 89.99, 50, 2, 'Vintage style denim jacket', '/uploads/jacket.jpg'],
      ['SD-001', 'Summer Dress', 49.99, 30, 2, 'Floral print summer dress', '/uploads/dress.jpg'],
      ['WE-001', 'Wireless Earbuds', 129.99, 200, 1, 'Noise cancelling earbuds', '/uploads/earbuds.jpg'],
      ['CM-001', 'Smart Coffee Maker', 199.99, 15, 3, 'Wifi enabled coffee maker', '/uploads/coffeemaker.jpg']
    ];

    for (const p of products) {
        // [sku, name_en, price, stock, cat_id, desc, img]
        await db.query(`
            INSERT INTO products (id, sku, name_en, name_ar, price, stock_quantity, category_id, description_en, description_ar, image_url) 
            VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [p[0], p[1], p[1], p[2], p[3], p[4], p[5], p[5], p[6]]);
    }

    console.log('✅ Data Imported Successfully!');
    process.exit();

  } catch (error) {
    console.error('❌ Error with data import:');
    console.error(error);
    process.exit(1);
  }
};

importData();
