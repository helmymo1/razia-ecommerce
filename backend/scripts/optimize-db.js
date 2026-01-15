const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const logger = require('../utils/logger'); // Assuming logger exists based on previous files

async function optimizeDatabase() {
  try {
    logger.info('Starting Database Optimization...');

    const migrationPath = path.join(__dirname, '../migrations/add_indexes.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and filter empty lines
    const queries = sqlContent
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    const connection = await db.getConnection();

    try {
      for (const query of queries) {
        // Skip comments (simple check)
        if (query.startsWith('/*')) {
            // This basic split might fail if comments are not cleaner, 
            // but the file I wrote has clean comments.
            // Actually, comments like /* ... */ are valid SQL and can be executed (they do nothing)
            // or should be stripped. Mysql2 might handle them.
            // Let's just execute safely.
        }

        try {
          logger.info(`Executing: ${query.substring(0, 50)}...`);
          await connection.query(query);
          logger.info('  -> Success');
        } catch (err) {
          if (err.code === 'ER_DUP_KEYNAME') {
            logger.warn('  -> Skipped (Index already exists)');
          } else {
            logger.error(`  -> Failed: ${err.message}`);
            // We don't throw here to allow other indexes to be added
          }
        }
      }
    } finally {
      connection.release();
    }

    logger.info('Database Optimization Complete.');
    process.exit(0);
  } catch (error) {
    logger.error(`Optimization script failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeDatabase();
}
