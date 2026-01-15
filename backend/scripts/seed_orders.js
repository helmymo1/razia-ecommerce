const db = require('../config/db');

async function seedOrders() {
    try {
        console.log('🌱 Seeding Dummy Orders...');

        // 1. Get a User ID (Admin or first user)
        const [users] = await db.query('SELECT id FROM users LIMIT 1');
        if (users.length === 0) {
            console.error('❌ No users found. Please register a user first.');
            process.exit(1);
        }
        const userId = users[0].id;

        // 2. Get Products
        const [products] = await db.query('SELECT id, price FROM products LIMIT 5');
        if (products.length === 0) {
            console.error('❌ No products found. Please seed products first.');
            process.exit(1);
        }

        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        // 3. Create Orders
        for (let i = 0; i < 5; i++) {
            const status = statuses[i];
            // Select random product for this order
            const product = products[i % products.length]; 
            const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3
            const totalAmount = (product.price * quantity).toFixed(2);
            
            // Random date within last 30 days
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            const dateString = date.toISOString().slice(0, 19).replace('T', ' ');

            // Insert Order
            const [orderResult] = await db.query(
                `INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, ?, ?)`,
                [userId, totalAmount, status, dateString]
            );
            
            const orderId = orderResult.insertId;

            // Insert Order Item
            await db.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, product.id, quantity, product.price]
            );

            console.log(`✅ Created Order #${orderId} - Status: ${status} - Total: $${totalAmount}`);
        }

        console.log('🎉 Seed completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seedOrders();
