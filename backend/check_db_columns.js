
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer_db' 
};

async function checkSchema() {
    console.log("Connecting to DB...", dbConfig.host);
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("✅ Connected.");

        const [orderItemsCols] = await connection.query(`DESCRIBE order_items`);
        console.log("\n📦 ORDER_ITEMS Table Columns:");
        orderItemsCols.forEach(col => console.log(` - ${col.Field} (${col.Type})`));

        const [productCols] = await connection.query(`DESCRIBE products`);
        console.log("\n🛍️ PRODUCTS Table Columns:");
        productCols.forEach(col => console.log(` - ${col.Field} (${col.Type})`));
        
        await connection.end();
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

checkSchema();
