const db = require('./config/db');

async function debugSchema() {
    try {
        const [rows] = await db.query("SELECT * FROM products LIMIT 1");
        if(rows.length > 0) console.log(Object.keys(rows[0]).join(', '));
        else console.log('No products found');
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit();
}

debugSchema();
