const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const db = require('../config/db');
const assert = require('assert');

async function runTest() {
    console.log('Starting standalone coupon verification...');
    
    let userId;
    let productId;
    let token;
    let adminToken;
    let couponId;
    const COUPON_CODE = 'SAVE50TEST-' + Date.now();

    try {
        // Setup User
        console.log('Creating test user...');
        const uniqueId = Date.now();
        const [userResult] = await db.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'hashedpassword', 'customer')",
            [`Coupon User ${uniqueId}`, `coupon_${uniqueId}@test.com`]
        );
        userId = userResult.insertId;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Setup Admin (for creating coupons)
        console.log('Creating test admin...');
        const [adminResult] = await db.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'hashedpassword', 'admin')",
            [`Coupon Admin ${uniqueId}`, `admin_coupon_${uniqueId}@test.com`]
        );
        adminToken = jwt.sign({ id: adminResult.insertId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Setup Product
        console.log('Creating test product...');
        const [prodResult] = await db.query(
            "INSERT INTO products (name, sku, price, stock, description) VALUES (?, ?, 100.00, 1000, 'For coupon testing')",
            [`Coupon Item ${uniqueId}`, `COUPON-${uniqueId}`]
        );
        productId = prodResult.insertId;

        // 1. Create Coupon
        console.log('Testing Coupon Creation...');
        const res1 = await request(app)
            .post('/api/coupons')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                code: COUPON_CODE,
                discount_type: 'fixed',
                discount_value: 50.00,
                start_date: new Date(),
                end_date: new Date(Date.now() + 86400000), // Tomorrow
                usage_limit: 10
            });
        
        assert.strictEqual(res1.statusCode, 201, `Failed to create coupon: ${JSON.stringify(res1.body)}`);
        couponId = res1.body.couponId;
        console.log('Coupon created:', COUPON_CODE);

        // 2. Create Order with Coupon
        console.log('Testing Order Creation with Coupon...');
        const res2 = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                total_amount: 50.00, // 100 - 50
                coupon_code: COUPON_CODE,
                order_items: [{ product_id: productId, quantity: 1, price: 100.00 }]
            });

        assert.strictEqual(res2.statusCode, 201, `Failed to create order: ${JSON.stringify(res2.body)}`);
        const orderId = res2.body.id;
        console.log('Order created:', orderId);

        // 3. Verify DB State
        console.log('Verifying DB Linkages...');
        const [coupons] = await db.query('SELECT usage_count FROM coupons WHERE id = ?', [couponId]);
        assert.strictEqual(coupons[0].usage_count, 1, 'Coupon usage count should be 1');

        const [orders] = await db.query('SELECT coupon_id FROM orders WHERE id = ?', [orderId]);
        assert.strictEqual(orders[0].coupon_id, couponId, 'Order should be linked to coupon');

        console.log('SUCCESS: All coupon tests passed!');

    } catch (err) {
        console.error('TEST FAILED:', err);
        process.exit(1);
    } finally {
        console.log('Cleaning up...');
        if (userId) await db.query("DELETE FROM users WHERE id = ?", [userId]);
        if (productId) await db.query("DELETE FROM products WHERE id = ?", [productId]);
        if (couponId) await db.query("DELETE FROM coupons WHERE id = ?", [couponId]);
        // Clean up admin
        // await db.end(); // Don't end if using pool in server? 
        // Force exit
        process.exit(0);
    }
}

runTest();
