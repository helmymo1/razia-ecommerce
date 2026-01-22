const db = require('../config/db');

const addIndexes = async () => {
  try {
    console.log('🔄 Starting Database Index Optimization...');

    const indexes = [
      {
        name: 'idx_product_search',
        query: 'ALTER TABLE products ADD FULLTEXT INDEX idx_product_search (name_en, name_ar, description_en, description_ar)',
        check: "SHOW INDEX FROM products WHERE Key_name = 'idx_product_search'"
      },
      {
        name: 'idx_cat_price',
        query: 'ALTER TABLE products ADD INDEX idx_cat_price (category_id, price)',
        check: "SHOW INDEX FROM products WHERE Key_name = 'idx_cat_price'"
      },
      {
        name: 'idx_created_at',
        query: 'ALTER TABLE products ADD INDEX idx_created_at (created_at)',
        check: "SHOW INDEX FROM products WHERE Key_name = 'idx_created_at'"
      }
    ];

    for (const idx of indexes) {
      const [exists] = await db.query(idx.check);
      if (exists.length === 0) {
        console.log(`➕ Adding index: ${idx.name}`);
        await db.query(idx.query);
        console.log(`✅ Index ${idx.name} added successfully.`);
      } else {
        console.log(`ℹ️ Index ${idx.name} already exists. Skipping.`);
      }
    }

    console.log('🚀 Database Optimization Complete!');
    process.exit(0);
  } catch (error) {
    console.error('🛑 Error optimizing database:', error.message);
    process.exit(1);
  }
};

addIndexes();
