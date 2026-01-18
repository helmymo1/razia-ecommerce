const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ebazer_shop'
};

const verify = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        console.log('🔍 Checking for referral codes in `users` table:');
        const [users] = await connection.query('SELECT id, name, personal_referral_code FROM users LIMIT 5');
        console.table(users);

        console.log('\n🔍 Checking for `referrals` table structure:');
        const [columns] = await connection.query('DESCRIBE referrals');
        console.table(columns.map(c => ({ Field: c.Field, Type: c.Type })));

    } catch (error) {
        console.error('Verify failed:', error);
    } finally {
        if (connection) await connection.end();
    }
};

verify();
