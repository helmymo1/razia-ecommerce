const request = require('supertest');
const app = require('../../server');
const db = require('../../config/db');

describe('Auth Endpoints', () => {
  afterAll(async () => {
    // Clean up
    await db.end(); 
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register user with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test',
        // email missing
        password: '123' // too short
      });
    expect(res.statusCode).toEqual(400); // Validation error
  });

  it('should login an existing user', async () => {
    // Assuming admin exists from seed
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123' // Note: Ensure seed has this password or use a known one
      });
    // If seed password is hashed differently, this might fail. 
    // Ideally create a user first then login.
    // For this test, let's create one.
    
    // Register first
    const email = `login${Date.now()}@example.com`;
    const password = 'password123';
    await request(app).post('/api/auth/register').send({ name: 'Login User', email, password });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
      
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});
