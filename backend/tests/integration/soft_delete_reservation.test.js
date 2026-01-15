const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../server'); // Ensure this points to your express app
const db = require('../../config/db');
const redisWrapper = require('../../config/redis');

describe('Refactor Verification: Soft Deletes & Redis', () => {
    let adminToken;
    let userToken;
    let userId;
    let productId;

    beforeAll(async () => {
        // Setup Admin
        const uniqueId = Date.now();
        const [admin] = await db.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'hash', 'admin')", [`Admin ${uniqueId}`, `admin_${uniqueId}@test.com`]);
        adminToken = jwt.sign({ id: admin.insertId, role: 'admin' }, process.env.JWT_SECRET);

        // Setup User
        const [user] = await db.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'hash', 'customer')", [`User ${uniqueId}`, `user_${uniqueId}@test.com`]);
        userId = user.insertId;
        userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);

        // Setup Product
        const [prod] = await db.query("INSERT INTO products (name, sku, price, stock, is_deleted) VALUES (?, ?, 100, 10, 0)", [`Prod ${uniqueId}`, `SKU-${uniqueId}`]);
        productId = prod.insertId;
        
        // Seed Redis manually to ensure test stability
        await redisWrapper.setex(`product:${productId}:stock`, 600, 10);
    });

    afterAll(async () => {
        // Cleanup
        await db.query("DELETE FROM users WHERE id IN (SELECT id FROM users WHERE email LIKE '%@test.com')");
        // await db.end(); // Keep connection alive if shared
    });

    describe('Soft Deletes', () => {
        it('should soft delete a product and hide it from list', async () => {
            // 1. Delete
            const delRes = await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(delRes.statusCode).toBe(200);
            expect(delRes.body.message).toContain('soft deleted');

            // 2. Verify DB status
            const [rows] = await db.query('SELECT is_deleted FROM products WHERE id = ?', [productId]);
            expect(rows[0].is_deleted).toBe(1);

            // 3. Verify List API
            const listRes = await request(app).get('/api/products');
            const found = listRes.body.find(p => p.id === productId);
            expect(found).toBeUndefined();
        });
    });

    describe('Redis Reservation', () => {
        it('should create order using redis reservation logic', async () => {
            // Re-activate product for this test or create new... easier to create new
             const [prod] = await db.query("INSERT INTO products (name, sku, price, stock) VALUES ('RedisTest', 'RT-1', 50, 5)");
             const pid = prod.insertId;
             await redisWrapper.setex(`product:${pid}:stock`, 600, 5);

             const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    user_id: userId,
                    total_amount: 50,
                    order_items: [{ product_id: pid, quantity: 2, price: 25 }]
                });

            if (res.statusCode !== 201) {
                console.log('Order Error:', res.body);
            }
            expect(res.statusCode).toBe(201);
            
            // Check Redis Stock
            const redisStock = await redisWrapper.get(`product:${pid}:stock`);
            expect(parseInt(redisStock)).toBe(3); // 5 - 2
        });
    });
});
