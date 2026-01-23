const db = require('../config/db');

async function checkAdmins() {
    try {
        console.log("Checking for Admin Users...");
        const [users] = await db.query("SELECT id, email, role, first_name FROM users WHERE role = 'admin'");
        console.log(`Found ${users.length} admin(s).`);
        users.forEach(u => console.log(` - ${u.email} (${u.first_name}) [ID: ${u.id}]`));
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        process.exit();
    }
}

checkAdmins();
