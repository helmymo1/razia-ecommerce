require('dotenv').config({ path: '../.env' });
const db = require('../config/db');

async function checkSchema() {
    try {
        const [columns] = await db.query("SHOW COLUMNS FROM orders LIKE 'payment_status'");
        console.log("Column Info:", columns);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
