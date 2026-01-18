const db = require('./backend/config/db');
// Simple UUID replacement
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const createRefund = async () => {
    try {
        console.log('Seeding refund request...');

        // 1. Get a user
        const [users] = await db.query('SELECT * FROM users LIMIT 1');
        if (users.length === 0) throw new Error('No users found');
        const user = users[0];
        console.log(`User: ${user.email}`);

        // 2. Get or Create an Order for this user
        let [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? LIMIT 1', [user.id]);
        if (orders.length === 0) {
            console.log('Creating dummy order...');
            const newOrderId = uuidv4();
            // subtotal AND total are required (schema drift from database_schema.sql)
            await db.query(`INSERT INTO orders (id, user_id, subtotal, total_amount, total, status, payment_status) VALUES (?, ?, 99.99, 99.99, 99.99, 'delivered', 'refund_requested')`, [newOrderId, user.id]);
            [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [user.id]);
        }
        const order = orders[0];
        console.log(`Order ID: ${order.id}`);

        // 3. Create Refund Request
        const refundId = uuidv4();
        await db.query(
            `INSERT INTO refund_requests (id, order_id, user_id, reason, pickup_time, contact_phone, status, created_at) 
             VALUES (?, ?, ?, 'Defective item', 'Morning', '123-456-7890', 'pending', NOW())`,
            [refundId, order.id, user.id]
        );

        console.log('Refund seeded successfully.');
        process.exit();

    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

createRefund();
