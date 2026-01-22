
require('dotenv').config();
const db = require('./config/db');

const checkSchema = async () => {
  try {
    const [columns] = await db.query('SHOW COLUMNS FROM products');
    const columnNames = columns.map(c => c.Field);
    console.log('Current columns in products table:', columnNames.join(', '));
    
    if (columnNames.includes('ai_tags')) {
        console.log('✅ ai_tags column EXISTS.');
    } else {
        console.log('❌ ai_tags column MISSING.');
    }
  } catch (error) {
    console.error('Error checking schema:', error);
  } else {
    process.exit();
  }
};

checkSchema();
