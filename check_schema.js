const db = require('./backend/config/db');

async function checkSchema() {
    try {
        console.log("Checking products table schema...");
        const [rows] = await db.query("DESCRIBE products");
        console.log(rows);
        
        console.log("\nChecking users table schema...");
        const [users] = await db.query("DESCRIBE users");
        console.log(users);

        console.log("\nChecking orders table schema...");
        const [orders] = await db.query("DESCRIBE orders");
        console.log(orders);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
