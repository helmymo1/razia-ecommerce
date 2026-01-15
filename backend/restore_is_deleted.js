const db = require('./config/db');

async function fixSchema() {
    try {
        console.log('Adding is_deleted column to products table...');
        await db.query(`ALTER TABLE products ADD COLUMN is_deleted TINYINT(1) DEFAULT 0`);
        console.log('Column added successfully!');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
            process.exit(0);
        }
        console.error('Error altering table:', error);
        process.exit(1);
    }
}

fixSchema();
