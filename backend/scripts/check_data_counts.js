const db = require('../config/db');

async function checkData() {
    try {
        console.log('Checking data counts...');
        
        const tables = ['users', 'products', 'categories', 'orders', 'order_items'];
        const counts = {};

        for (const table of tables) {
            const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
            counts[table] = rows[0].count;
        }

        console.log('📊 Table Row Counts:', counts);
        
        if (counts.users === 0 && counts.products === 0) {
            console.log('⚠️ Database appears to be effectively empty.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking data:', error.message);
        process.exit(1);
    }
}

checkData();
