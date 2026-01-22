const db = require('./backend/config/db');

async function checkProducts() {
    try {
        const [rows] = await db.query("DESCRIBE products");
        console.log(rows);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkProducts();
