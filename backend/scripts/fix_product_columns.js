const db = require('../config/db');

const columnsToAdd = [
    "ADD COLUMN tags TEXT",
    "ADD COLUMN discount_type ENUM('no_discount', 'percentage', 'fixed') DEFAULT 'no_discount'",
    "ADD COLUMN discount_value DECIMAL(10, 2) DEFAULT 0",
    "ADD COLUMN shipping_width DECIMAL(10, 2)",
    "ADD COLUMN shipping_height DECIMAL(10, 2)",
    "ADD COLUMN shipping_weight DECIMAL(10, 2)",
    "ADD COLUMN shipping_cost DECIMAL(10, 2)",
    "ADD COLUMN colors TEXT",
    "ADD COLUMN sizes TEXT"
];

async function fixColumns() {
    console.log('🔧 Fixing product columns...');
    
    for (const colDef of columnsToAdd) {
        try {
            await db.query(`ALTER TABLE products ${colDef}`);
            console.log(`✅ Added: ${colDef}`);
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log(`⚠️ Column already exists (skipped): ${colDef}`);
            } else {
                console.error(`❌ Failed to add column: ${colDef}`, err.message);
            }
        }
    }
    
    console.log('🏁 Column fix process completed.');
    process.exit(0);
}

fixColumns();
