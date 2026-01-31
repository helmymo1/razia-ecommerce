require('dotenv').config();
const db = require('./config/db');

const checkProduct = async () => {
  try {
    const [rows] = await db.query(
      'SELECT id, name_en, price, sku, sizes, colors FROM products WHERE id = ?', 
      ['dec3f433-8f76-47ad-9498-965e17b21cc4']
    );
    console.log('DB Result:');
    console.log('SKU:', rows[0]?.sku);
    console.log('Price:', rows[0]?.price);
    console.log('Sizes:', rows[0]?.sizes);
    console.log('Colors:', rows[0]?.colors);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
};

checkProduct();
