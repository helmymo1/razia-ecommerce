const db = require('./config/db');

async function fixSchema() {
    try {
        console.log('Restoring missing columns to products table...');
        
        const queries = [
            `ALTER TABLE products ADD COLUMN discount_type VARCHAR(50) DEFAULT 'no_discount'`,
            `ALTER TABLE products ADD COLUMN discount_value DECIMAL(10,2) DEFAULT 0`,
            `ALTER TABLE products ADD COLUMN shipping_width DECIMAL(10,2) DEFAULT 0`,
            `ALTER TABLE products ADD COLUMN shipping_height DECIMAL(10,2) DEFAULT 0`,
            `ALTER TABLE products ADD COLUMN shipping_weight DECIMAL(10,2) DEFAULT 0`,
            `ALTER TABLE products ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0`,
            `ALTER TABLE products ADD COLUMN colors JSON`,
            `ALTER TABLE products ADD COLUMN sizes JSON`
        ];

        for (const query of queries) {
            try {
                await db.query(query);
                console.log(`Executed: ${query}`);
            } catch (error) {
                if (error.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Skipped (Exists): ${query}`);
                } else {
                    throw error;
                }
            }
        }

        console.log('All columns restored successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error altering table:', error);
        process.exit(1);
    }
}

fixSchema();
