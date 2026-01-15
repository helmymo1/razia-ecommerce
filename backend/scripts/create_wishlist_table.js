const db = require('../config/db');

async function createWishlistTable() {
    console.log('🔧 Creating Wishlist table...');
    console.log(`Debug: User=${process.env.DB_USER}, Host=${process.env.DB_HOST}, DB=${process.env.DB_NAME}`);
    
    const sql = `
        CREATE TABLE IF NOT EXISTS wishlist (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_wishlist (user_id, product_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    `;

    try {
        await db.query(sql);
        console.log('✅ Wishlist table created successfully.');
    } catch (err) {
        console.error('❌ Failed to create wishlist table:', err.message);
    }
    
    console.log('🏁 Process completed.');
    process.exit(0);
}

createWishlistTable();
