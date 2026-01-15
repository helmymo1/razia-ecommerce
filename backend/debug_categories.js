const db = require('./config/db');

async function debugCategories() {
    console.log('--- Categories Table Columns ---');
    try {
        const [rows] = await db.query("SELECT * FROM categories LIMIT 1");
        if(rows.length > 0) console.log(Object.keys(rows[0]).join(', '));
        else {
             // If empty, use DESCRIBE
             const [cols] = await db.query("DESCRIBE categories");
             console.table(cols);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit();
}

debugCategories();
