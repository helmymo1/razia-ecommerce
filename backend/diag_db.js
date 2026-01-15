const db = require('./config/db');

console.log('Attempting connection with db pool...');

db.query("SHOW VARIABLES LIKE 'character_set%'")
  .then(([rows]) => {
      console.log('Connected successfully!');
      console.table(rows);
      process.exit(0);
  })
  .catch(err => {
      console.error('Connection failed:', err);
      process.exit(1);
  });
