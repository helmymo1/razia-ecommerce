require('dotenv').config();
const db = require('./config/db');

async function checkLatestOrder() {
  try {
    const [rows] = await db.query(`
      SELECT id, total, status, created_at, user_id 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    
    console.log('--- LATEST 3 ORDERS ---');
    rows.forEach(order => {
      console.log(`ID: ${order.id}`);
      console.log(`Total: ${order.total} (Type: ${typeof order.total})`);
      console.log(`Status: ${order.status}`);
      console.log(`Created: ${order.created_at}`);
      console.log('------------------------');
    });

    if (rows.length > 0) {
      const latestId = rows[0].id;
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [latestId]);
      console.log(`Latest Order Items (${latestId}):`);
      items.forEach(item => {
        console.log(` - Product: ${item.product_name}, Price: ${item.unit_price}, Qty: ${item.quantity}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkLatestOrder();
