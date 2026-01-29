
const db = require('./config/db');

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM users');
        console.log("Users Table Columns:");
        columns.forEach(col => console.log(`- ${col.Field} (${col.Type})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
