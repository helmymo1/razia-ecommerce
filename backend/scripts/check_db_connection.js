const db = require('../config/db');
const logger = require('../utils/logger'); // Assuming logger setup exists

async function checkConnection() {
    try {
        console.log('Attempting to connect to MySQL...');
        const [rows] = await db.query('SELECT 1 as val');
        console.log('✅ Connection Successful! Query Result:', rows);
        
        console.log('Checking database tables...');
        const [tables] = await db.query('SHOW TABLES');
        console.log('✅ Found', tables.length, 'tables.');
        tables.forEach(t => console.log(' -', Object.values(t)[0]));

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        process.exit(1);
    }
}

checkConnection();
