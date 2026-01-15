const db = require('./config/db');

const runMigration = async () => {
  try {
    console.log('Starting migration...');

    // 1. Add Profile Fields to Users Table
    // Check if columns exist first to avoid errors on re-run (or just use ADD COLUMN IF NOT EXISTS if MySQL version supports it, usually MySQL 8.0.29+)
    // For safety in older MySQL, we just try/catch or specific query. 
    // Given the prompt implies these are new, I will run the ALTERS.
    
    // Attempting Users Table Update
    try {
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN phone VARCHAR(20),
            ADD COLUMN address TEXT,
            ADD COLUMN city VARCHAR(100),
            ADD COLUMN zip VARCHAR(20),
            ADD COLUMN country VARCHAR(100) DEFAULT 'Egypt';
        `);
        console.log('Users table updated.');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Users table already has these columns (skipping).');
        } else {
            console.error('Error updating users table:', e.message);
        }
    }

    // 2. Add Shipping Snapshot to Orders Table
    try {
        await db.query(`
            ALTER TABLE orders 
            ADD COLUMN shipping_name VARCHAR(255),
            ADD COLUMN shipping_phone VARCHAR(20),
            ADD COLUMN shipping_address TEXT,
            ADD COLUMN shipping_city VARCHAR(100),
            ADD COLUMN shipping_zip VARCHAR(20);
        `);
        console.log('Orders table updated.');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Orders table already has these columns (skipping).');
        } else {
            console.error('Error updating orders table:', e.message);
        }
    }

    console.log('Migration completed.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
