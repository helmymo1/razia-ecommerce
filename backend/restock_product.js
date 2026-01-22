const db = require('./config/db');

async function checkAndRestock() {
  try {
    const productId = '57f943e9-f45f-11f0-9ec6-bafe02a6c085';
    
    // Check current stock
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (rows.length === 0) {
      console.log('Product not found!');
    } else {
      const product = rows[0];
      console.log(`Current Stock for ${product.name} (${product.id}): ${product.quantity}`);
      
      // Update stock
      if (product.stock_quantity < 10) {
        console.log('Restocking product...');
        // Update both columns to be safe
        await db.query('UPDATE products SET stock_quantity = 100, quantity = 100 WHERE id = ?', [productId]);
        console.log('Product restocked to 100 (stock_quantity & quantity).');
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkAndRestock();
