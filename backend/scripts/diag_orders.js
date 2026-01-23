const db = require('../config/db');

async function runTest() {
    try {
        console.log("Testing getAllOrders SQL Query...");
        const query = `
        SELECT 
          o.id, o.order_number, o.total, o.status, o.created_at,
          CONCAT(u.first_name, ' ', u.last_name) as user_name, u.email as user_email,
          JSON_ARRAYAGG(
            JSON_OBJECT('product_name', p.name_en, 'quantity', oi.quantity, 'price', oi.unit_price)
          ) as items
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY o.id
        ORDER BY o.created_at DESC;
    `;
        const [orders] = await db.query(query);
        console.log(`✅ Success! Fetched ${orders.length} orders.`);
        if (orders.length > 0) {
            console.log("Sample Order:", JSON.stringify(orders[0], null, 2));
        }
    } catch (error) {
        console.error("❌ Query Failed:", error.message);
        console.error("Stack:", error);
    } finally {
        process.exit();
    }
}

runTest();
