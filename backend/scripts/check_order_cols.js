const db = require('../config/db');

async function checkColumns() {
    try {
        const [rows] = await db.query("SHOW COLUMNS FROM order_items");
        console.log('Columns in order_items:', rows.map(r => r.Field));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkColumns();
