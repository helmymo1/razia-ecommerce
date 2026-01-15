const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verifyAuth() {
  try {
    // 1. Login
    console.log('Attempting login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@ebazer.com',
      password: '123456' 
    });

    console.log('Login successful');
    const token = loginRes.data.token;

    // 2. Access Protected Route
    console.log('Accessing protected route /auth/me...');
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Protected route accessed successfully!');
    console.log('User:', meRes.data.email, meRes.data.role);
    console.log('TEST PASSED: Auth Middleware is working.');

  } catch (error) {
    console.error('TEST FAILED');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received due to:', error.code || error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

verifyAuth();
