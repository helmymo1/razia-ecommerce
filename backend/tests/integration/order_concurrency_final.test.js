const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../server');
const db = require('../../config/db');

describe('Order Concurrency Final Test', () => {
    let userId;
    let productId;
    let token;
    const INITIAL_STOCK = 5;
    const PRELOAD_REQUESTS = 10;

    beforeAll(async () => {
        const uniqueId = Date.now();
        console.log(`Setup concurrency test with suffix: ${uniqueId}`);
        const [userResult] = await db.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, 'hashedpassword', 'customer')",
            [`Concurrent Tester ${uniqueId}`, `race_${uniqueId}@test.com`]
        );
        userId = userResult.insertId;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const [prodResult] = await db.query(
            "INSERT INTO products (name, sku, price, stock, description) VALUES (?, ?, 100.00, ?, 'For concurrency testing')",
            [`Rare Item ${uniqueId}`, `RACE-${uniqueId}`, INITIAL_STOCK]
        );
        productId = prodResult.insertId;
        console.log(`Created Product ID: ${productId}, Stock: ${INITIAL_STOCK}`);
    });

    afterAll(async () => {
        if (userId) await db.query("DELETE FROM users WHERE id = ?", [userId]);
        if (productId) await db.query("DELETE FROM products WHERE id = ?", [productId]);
        await db.end();
    });

    it('should result in exactly 5 successes and 5 failures due to stock', async () => {
        const requests = Array.from({ length: PRELOAD_REQUESTS }).map((_, index) => {
            return request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_id: userId,
                    total_amount: 100.00,
                    order_items: [{ product_id: productId, quantity: 1, price: 100.00 }]
                });
        });

        const responses = await Promise.all(requests);
        
        const successCount = responses.filter(r => r.statusCode === 201).length;
        const failureCount = responses.filter(r => r.statusCode === 400).length;
        const otherCount = responses.filter(r => r.statusCode !== 201 && r.statusCode !== 400).length;

        console.log('--- TEST RESULTS ---');
        console.log(`Success (201): ${successCount}`);
        console.log(`Failures (400): ${failureCount}`);
        console.log(`Others (500/etc): ${otherCount}`);
        
        if (otherCount > 0) {
            console.log('Printing error bodies for "Other" responses:');
            responses.filter(r => r.statusCode !== 201 && r.statusCode !== 400).forEach(r => {
                console.log(`Status ${r.statusCode}:`, JSON.stringify(r.body));
            });
        }
        
        expect(otherCount).toBe(0);
        expect(successCount).toBe(INITIAL_STOCK);
        expect(failureCount).toBe(PRELOAD_REQUESTS - INITIAL_STOCK);
    });
});
