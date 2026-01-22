
const db = require('./config/db');

async function checkSchema() {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM order_items");
    console.log("COLUMNS_START");
    console.log(JSON.stringify(columns.map(c => c.Field)));
    console.log("COLUMNS_END");
    process.exit(0);
  } catch (err) {
    console.error("ERROR_OCCURRED", err);
    process.exit(1);
  }
}

checkSchema();
