const db = require('./config/db');

async function checkSchema() {
  try {
    console.log('Checking categories table...');
    const [catCols] = await db.query('SHOW COLUMNS FROM categories');
    console.log('Categories Columns:', catCols.map(c => c.Field));

    console.log('Checking products table...');
    const [prodCols] = await db.query('SHOW COLUMNS FROM products');
    console.log('Products Columns:', prodCols.map(c => c.Field));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkSchema();
