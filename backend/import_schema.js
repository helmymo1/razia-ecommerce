const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true // Enable multiple statements query
});

const schemaPath = path.join(__dirname, 'unified_schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to database.');

  connection.query(schemaSql, (err, results) => {
    if (err) {
      console.error('Error importing schema:', err.message);
      if (err.sqlMessage) console.error('SQL Message:', err.sqlMessage);
      
      connection.query('SHOW ENGINE INNODB STATUS', (err2, results2) => {
        if (!err2 && results2.length > 0) {
           console.log('--- INNODB STATUS ---');
           console.log(results2[0].Status);
           console.log('---------------------');
        }
        process.exit(1);
      });
    }
    console.log('Schema imported successfully.');
    connection.end();
  });
});
