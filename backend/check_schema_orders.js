
const db = require('./config/db');

async function checkSchema() {
    try {
        const [rows] = await db.query('DESCRIBE orders');
        console.log("SCHEMA:", rows.map(r => r.Field));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
