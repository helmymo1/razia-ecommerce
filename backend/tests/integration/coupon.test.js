const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../server');
const db = require('../../config/db');

console.log('Test Environment DB Config Check:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);

describe('Coupon Integration Test', () => {
    let userId;
    let productId;
    let token;
    let adminToken;
    let couponId;
    const COUPON_CODE = 'SAVE50TEST-' + Date.now();

    beforeAll(async () => {
        // Setup User
        const uniqueId = Date.now();
        const [userResult] = await db.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'hashedpassword', 'customer')",
            [`Coupon User ${uniqueId}`, `coupon_${uniqueId}@test.com`]
        );
        userId = userResult.insertId;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Setup Admin (for creating coupons)
        const [adminResult] = await db.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'hashedpassword', 'admin')",
            [`Coupon Admin ${uniqueId}`, `admin_coupon_${uniqueId}@test.com`]
        );
        adminToken = jwt.sign({ id: adminResult.insertId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Setup Product
        const [prodResult] = await db.query(
            "INSERT INTO products (name, sku, price, stock, description) VALUES (?, ?, 100.00, 1000, 'For coupon testing')",
            [`Coupon Item ${uniqueId}`, `COUPON-${uniqueId}`]
        );
        productId = prodResult.insertId;
    });

    afterAll(async () => {
        if (userId) await db.query("DELETE FROM users WHERE id = ?", [userId]);
        // Also clean up admin if needed, though users table might get big
        if (productId) await db.query("DELETE FROM products WHERE id = ?", [productId]);
        if (couponId) await db.query("DELETE FROM coupons WHERE id = ?", [couponId]);
        await db.end();
    });

    it('should create a coupon as admin', async () => {
        const res = await request(app)
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

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('couponId');
        couponId = res.body.couponId;
    });

    it('should create an order with a valid coupon', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                total_amount: 50.00, // 100 - 50
                coupon_code: COUPON_CODE,
                order_items: [{ product_id: productId, quantity: 1, price: 100.00 }]
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        
        // Check DB for usage count and order link
        const [coupons] = await db.query('SELECT usage_count FROM coupons WHERE id = ?', [couponId]);
        expect(coupons[0].usage_count).toBe(1);

        const [orders] = await db.query('SELECT coupon_id FROM orders WHERE id = ?', [res.body.id]);
        expect(orders[0].coupon_id).toBe(couponId);
    });

    it('should fail to use an invalid coupon', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                total_amount: 100.00,
                coupon_code: 'INVALID-CODE',
                order_items: [{ product_id: productId, quantity: 1, price: 100.00 }]
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toContain('Invalid or inactive coupon');
    });
});
