const db = require('./config/db');
require('dotenv').config();

const applyIndexes = async () => {
    try {
        console.log('🔄 Checking and applying database indexes...');

        // 1. Orders: Sort by Created At (Admin Dashboard Optimization)
        // Check if index exists is tricky in MySQL one-liner, so we use try-catch or just try to add.
        // We'll try to add and ignore "Duplicate key name" error.
        try {
            await db.query(`CREATE INDEX idx_orders_created_at ON orders(created_at DESC)`);
            console.log('✅ Index added: orders(created_at DESC)');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') console.log('ℹ️ Index already exists: orders(created_at)');
            else console.error('❌ Failed to add orders index:', err.message);
        }

        // 2. Products: Full Text Search (Name & Description)
        // Controller uses name_en and description_en
        try {
            await db.query(`ALTER TABLE products ADD FULLTEXT INDEX idx_fulltext_search (name_en, description_en)`);
            console.log('✅ Fulltext Index added: products(name_en, description_en)');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') console.log('ℹ️ Index already exists: products(name_en, description_en)');
            else console.error('❌ Failed to add products fulltext index:', err.message);
        }
        
        // 3. Products: Category Filter (Already exists in schema as idx_category_id, but verifying)
        try {
            await db.query(`CREATE INDEX idx_products_category ON products(category_id)`);
             console.log('✅ Index added: products(category_id)');
        } catch (err) {
             if (err.code === 'ER_DUP_KEYNAME') console.log('ℹ️ Index already exists: products(category_id)');
             else console.error('❌ Failed to add products category index:', err.message);
        }

        console.log('✨ Index optimizations completed.');
        process.exit();
    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
};

applyIndexes();
