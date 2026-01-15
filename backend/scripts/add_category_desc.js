const db = require('../config/db');

async function addDescriptionColumn() {
  try {
    await db.query('ALTER TABLE categories ADD COLUMN description TEXT');
    console.log('Added description column to categories');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('Column already exists');
    } else {
        console.error(error);
    }
    process.exit(0); // Exit success even if dup
  }
}

addDescriptionColumn();
