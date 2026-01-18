const db = require('./backend/config/db');

const checkRefunds = async () => {
    try {
        console.log('Checking refund_requests table...');
        const [rows] = await db.query('SELECT * FROM refund_requests');
        console.log(`Found ${rows.length} refund requests.`);
        if (rows.length > 0) {
            console.log('Sample Row:', rows[0]);
        }

        // Also check if the JOINs would work (integrity check)
        if (rows.length > 0) {
            const userId = rows[0].user_id;
            const orderId = rows[0].order_id;
            
            console.log(`Checking User ID: ${userId}`);
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
            console.log(`User found: ${users.length > 0}`);

            console.log(`Checking Order ID: ${orderId}`);
            const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            console.log(`Order found: ${orders.length > 0}`);
        }

        process.exit();
    } catch (error) {
        console.error('Database Error:', error);
        process.exit(1);
    }
};

checkRefunds();
