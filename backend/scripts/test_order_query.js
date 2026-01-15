const db = require('../config/db');

async function testQuery() {
    try {
        let query = `
      SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name, u.email as user_email,
      (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as total_items
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    
        console.log('Running query:', query);
        const [orders] = await db.query(query);
        console.log('Orders found:', orders.length);
        if (orders.length > 0) {
            console.log('Sample order:', orders[0]);
        }
        process.exit(0);
    } catch (err) {
        console.error('Query failed:', err);
        process.exit(1);
    }
}

testQuery();
