const db = require('./config/db');

async function fixSchema() {
    try {
        console.log('Adding image_url column to products table...');
        await db.query(`ALTER TABLE products ADD COLUMN image_url TEXT`);
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
