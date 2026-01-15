const db = require('./config/db');

async function migrate() {
  try {
    const connection = await db.getConnection();
    console.log('Connected.');

    // Add colors and sizes columns
    try {
      await connection.query('ALTER TABLE products ADD COLUMN colors JSON');
      console.log('Added colors column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('colors column exists');
      else console.error(e.message);
    }

    try {
      await connection.query('ALTER TABLE products ADD COLUMN sizes JSON');
      console.log('Added sizes column');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') console.log('sizes column exists');
        else console.error(e.message);
    }
    
    // Add image_url if missing (it was in CREATE TABLE, but let's be sure)
    
    console.log('Migration done.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
