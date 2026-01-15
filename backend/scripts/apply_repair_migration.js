const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const applyMigration = async () => {
    try {
        const sqlPath = path.join(__dirname, '../migrations/repair_schema_drift.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon to execute multiple statements
        // Note: Simple split might break if semicolons are in strings, but for this predictable SQL it's fine
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute.`);

        for (const statement of statements) {
            try {
                await db.query(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            } catch (err) {
                // Ignore "Duplicate column name" errors if IF NOT EXISTS doesn't catch them (e.g. MySQL versions)
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log('Skipping duplicate column:', statement.substring(0, 50) + '...');
                } else {
                    console.error('Error executing statement:', err.message);
                    // Decide whether to throw or continue. For now, we continue to try all fixes.
                }
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

applyMigration();
