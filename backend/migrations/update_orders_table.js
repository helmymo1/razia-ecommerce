
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer_db' 
};

async function updateSchema() {
    console.log("Connecting to DB...", dbConfig.host);
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("✅ Connected.");

        const columnsToAdd = [
            "ADD COLUMN order_number VARCHAR(50) NULL AFTER id",
            "ADD COLUMN delivery_id VARCHAR(100) NULL",
            "ADD COLUMN delivery_status VARCHAR(50) DEFAULT 'pending'",
            "ADD COLUMN tracking_number VARCHAR(100) NULL",
            "ADD COLUMN delivery_error TEXT NULL"
        ];

        console.log("🔄 Checking 'orders' table...");
        
        // Get existing columns
        const [existingCols] = await connection.query("DESCRIBE orders");
        const existingColNames = existingCols.map(c => c.Field);

        for (const colDef of columnsToAdd) {
             // Extract column name from definition (e.g., "ADD COLUMN delivery_id ...")
             const colName = colDef.split(' ')[2];
             
             if (!existingColNames.includes(colName)) {
                 console.log(`➕ Adding column: ${colName}...`);
                 try {
                    await connection.query(`ALTER TABLE orders ${colDef}`);
                    console.log(`   ✅ Added ${colName}`);
                 } catch (e) {
                    console.error(`   ❌ Failed to add ${colName}: ${e.message}`);
                 }
             } else {
                 console.log(`   ℹ️ Column ${colName} already exists.`);
             }
        }

        console.log("\n✅ Schema verification complete.");

    } catch (error) {
        console.error("❌ Fatal Error:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
