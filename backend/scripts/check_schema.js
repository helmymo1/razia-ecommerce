const db = require('../config/db');

async function checkSchema() {
  try {
    const [columns] = await db.query('DESCRIBE products');
    console.log('Products Table:', columns.map(c => `${c.Field} (${c.Type})`));

    try {
      const [catColumns] = await db.query('DESCRIBE categories');
      console.log('Categories Table:', catColumns.map(c => `${c.Field} (${c.Type})`));
    } catch (e) {
      console.log('No categories table?');
    }

    try {
      const [varColumns] = await db.query('DESCRIBE product_variants');
      console.log('Product Variants Table:', varColumns.map(c => `${c.Field} (${c.Type})`));
    } catch (e) {
      console.log('No product_variants table');
    }

    try {
      const [imgColumns] = await db.query('DESCRIBE product_images');
      console.log('Product Images Table:', imgColumns.map(c => `${c.Field} (${c.Type})`));
    } catch (e) {
      console.log('No product_images table');
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkSchema();
