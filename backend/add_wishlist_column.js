const db = require('./config/db');

async function addWishlistColumn() {
  console.log("🛠 Starting Schema Migration for Wishlist...");
  
  const connection = await db.getConnection();
  try {
    // Check users table
    console.log("👉 Checking users table...");
    const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'wishlist'");
    
    if (columns.length === 0) {
      console.log("   Adding wishlist JSON column to users...");
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN wishlist JSON DEFAULT NULL
      `);
      console.log("   ✅ Wishlist added to users.");
    } else {
      console.log("   Info: Wishlist already exists in users.");
    }
    
    // Also check for google_auth fields if missing (since User/Social login mentioned)
    // Just a sanity check if needed, but sticking to Task 1
    
    console.log("🎉 Migration Complete!");

  } catch (error) {
    console.error("❌ Migration Failed:", error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

addWishlistColumn();
