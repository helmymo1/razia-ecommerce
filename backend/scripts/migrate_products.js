const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigration() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../migrations/add_product_fields.sql'), 'utf8');
    
    // Split by comma if strictly needed, but ALTER TABLE can take multiple ADD COLUMN separated by comma in one statement.
    // The file content is one single statement.
    
    console.log('Executing migration...');
    await db.query(sql);
    console.log('✅ Migration executed successfully.');
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ Columns already exist. Skipping.');
      process.exit(0);
    }
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
