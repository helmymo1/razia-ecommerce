
const db = require('./config/db');

async function migrate() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to database.');

    try {
      // Add item_status column if it doesn't exist
      // We use JSON type just in case, or VARCHAR. Based on controller usage 'active', 'cancelled', 'returned', VARCHAR(50) or ENUM is appropriate.
      // Looking at controller: item_status = ?, it expects a string.
      await connection.query("ALTER TABLE order_items ADD COLUMN item_status VARCHAR(50) DEFAULT 'active'");
      console.log('✅ Added item_status column successfully.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ item_status column already exists.');
      } else {
        console.error('❌ Error adding column:', e.message);
        throw e;
      }
    }

    try {
        // Add cancel_reason column as well since likely needed for full feature support
        await connection.query("ALTER TABLE order_items ADD COLUMN cancel_reason TEXT DEFAULT NULL");
        console.log('✅ Added cancel_reason column successfully.');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️ cancel_reason column already exists.');
        } else {
             // Not critical if this fails, but good to have
            console.warn('⚠️ Could not add cancel_reason:', e.message);
        }
    }

    console.log('Migration completed.');
    process.exit(0);
  } catch (err) {
    console.error('💥 Migration Failed:', err);
    process.exit(1);
  }
}

migrate();
