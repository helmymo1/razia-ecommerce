
require('dotenv').config();
const db = require('./config/db');

const addColumn = async () => {
  try {
    console.log('Attempting to add ai_tags column to products table...');
    // MySQL 8.0 support
    await db.query('ALTER TABLE products ADD COLUMN ai_tags JSON DEFAULT NULL');
    console.log('✅ ai_tags column added successfully.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ ai_tags column already exists.');
    } else {
      console.error('❌ Error adding column:', error);
    }
  } finally {
    process.exit();
  }
};

addColumn();
