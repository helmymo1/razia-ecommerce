const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let AUTH_TOKEN = '';

async function login() {
    try {
        console.log('Testing Login...');
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@ebazer.com',
            password: 'password123' 
        });
        AUTH_TOKEN = res.data.token;
        console.log('✅ Logged in. Token received.');
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
        process.exit(1);
    }
}

async function testGetOrders() {
    await login();

    console.log('\n--- Testing GET /api/orders/mine ---');
    try {
        const res = await axios.get(`${API_URL}/orders/mine`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
        console.log(`✅ Success. Retrieved ${res.data.length} orders.`);
        if (res.data.length > 0) {
            console.log('Sample Order:', JSON.stringify(res.data[0], null, 2));
        }
    } catch (error) {
        console.error('❌ GET /orders/mine Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }

    console.log('\n--- Testing GET /api/orders (Admin) ---');
    try {
        const res = await axios.get(`${API_URL}/orders`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
        console.log(`✅ Success. Retrieved ${res.data.length} total orders.`);
    } catch (error) {
        console.error('❌ GET /orders Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

testGetOrders();
