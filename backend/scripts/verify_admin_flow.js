const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAdminFlow() {
    try {
        console.log("1. Attempting Login as admin@ebazer.com...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@ebazer.com',
            password: 'password123' // Assuming default password, will fail if changed, but lets try
        });

        console.log("✅ Login Success!");
        const token = loginRes.data.token;
        console.log("   Token:", token.substring(0, 20) + "...");

        console.log("\n2. Fetching Admin Orders...");
        const ordersRes = await axios.get(`${API_URL}/orders/admin`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`✅ Fetch Success! Retrieved ${ordersRes.data.length} orders.`);
        if (ordersRes.data.length > 0) {
            console.log("   Sample Order ID:", ordersRes.data[0].id);
            console.log("   User Name:", ordersRes.data[0].user_name);
        }

    } catch (error) {
        console.error("❌ Test Failed:");
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("   Message:", error.message);
        }
    }
}

testAdminFlow();
