const db = require('../config/db');

async function checkAdmin() {
    try {
        const [rows] = await db.query("SELECT id, name, email, role FROM users WHERE email = 'admin@ebazer.com'");
        console.log(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAdmin();
