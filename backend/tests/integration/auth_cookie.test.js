const request = require('supertest');
const app = require('../../server');
const db = require('../../config/db');

describe('Auth Cookie Integration', () => {
  let server;
  let testUser = {
    name: 'Cookie Test User',
    email: 'cookietest@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // Start server (if not already handled by require, but server.js exports app)
    // Clean up user if exists
    await db.query('DELETE FROM users WHERE email = ?', [testUser.email]);
    
    // Register user to get into DB
    await request(app).post('/api/auth/register').send(testUser);
  });

  afterAll(async () => {
    await db.query('DELETE FROM users WHERE email = ?', [testUser.email]);
    await db.end();
  });

  it('should set an HttpOnly cookie on login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toEqual(200);
    expect(res.headers['set-cookie']).toBeDefined();
    const cookie = res.headers['set-cookie'][0];
    expect(cookie).toMatch(/token=.*;/);
    expect(cookie).toMatch(/HttpOnly/);
  });

  it('should access protected route via cookie', async () => {
    // 1. Login to get cookie
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    
    const cookie = loginRes.headers['set-cookie'];

    // 2. Access /api/auth/me with cookie
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie);

    expect(meRes.statusCode).toEqual(200);
    expect(meRes.body.email).toEqual(testUser.email);
  });

  it('should clear cookie on logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/); // Expired/Empty
  });
});
