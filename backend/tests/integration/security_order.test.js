const request = require('supertest');
const app = require('../../server');
const db = require('../../config/db');
const redisWrapper = require('../../config/redis');

// Mock Redis to prevent actual connection issues during simple test
jest.mock('../../config/redis', () => ({
  decrby: jest.fn().mockResolvedValue(10), // Assume sufficient stock
  incrby: jest.fn().mockResolvedValue(11)
}));

// Mock Auth Middleware to bypass login
jest.mock('../../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
  },
  admin: (req, res, next) => next()
}));

describe('Security: Secure Order Creation', () => {
  let productId;
  let categoryId;
  let userId;
  let realPrice;

  beforeAll(async () => {
    // 0a. Create a Test User
    const [userResult] = await db.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ('Test User', 'security@test.com', 'hash', 'customer')`
    );
    userId = userResult.insertId;

    // 0b. Create a Category
    const [catResult] = await db.query(
        `INSERT INTO categories (name, slug) VALUES ('Security Cat', 'sec-cat')`
    );
    categoryId = catResult.insertId;

    // 1. Create a product with a known price
    const [result] = await db.query(
      `INSERT INTO products (name, sku, price, stock, category_id) 
       VALUES ('Security Test Product', 'SEC-001', 100.00, 50, ?)`,
       [categoryId]
    );
    productId = result.insertId;
    realPrice = 100.00;
  });

  afterAll(async () => {
    // Cleanup
    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    await db.query('DELETE FROM categories WHERE id = ?', [categoryId]);
    await db.query('DELETE FROM orders WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    
    // Close DB Connection to prevent Jest from hanging
    await db.end(); 
  });

  it('should IGNORE client-provided price and use DB price', async () => {
    const maliciousPrice = 0.01;
    const quantity = 2;
    
    const payload = {
      user_id: userId,
      address_id: 1,
      total_amount: maliciousPrice * quantity, // 0.02 (Malicious Total)
      order_items: [
        {
          product_id: productId,
          quantity: quantity,
          price: maliciousPrice // Malicious Item Price
        }
      ]
    };

    const res = await request(app)
      .post('/api/orders')
      .send(payload)
      .expect(201);

    // Verify Response Total
    const expectedTotal = realPrice * quantity; // 200.00
    expect(res.body.total_amount).toBe(expectedTotal);
    expect(res.body.total_amount).not.toBe(payload.total_amount);

    // Verify DB Record
    const [orders] = await db.query('SELECT total_amount FROM orders WHERE id = ?', [res.body.id]);
    expect(parseFloat(orders[0].total_amount)).toBe(expectedTotal);
  }, 30000);
});
