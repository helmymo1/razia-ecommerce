const db = require('./backend/config/db');

async function checkOrders() {
    try {
        const [rows] = await db.query("DESCRIBE orders");
        console.log(JSON.stringify(rows, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkOrders();
