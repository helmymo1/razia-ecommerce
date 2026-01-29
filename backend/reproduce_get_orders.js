
const axios = require('axios');

async function testGetOrders() {
    try {
        // 1. Authenticate (Register random user to get token)
        const randomEmail = `testuser_${Date.now()}@example.com`;
        console.log(`🔐 Authenticating as ${randomEmail}...`);
        
        let token;
        try {
            const authRes = await axios.post('http://localhost:5000/api/auth/register', {
                name: 'Test User',
                email: randomEmail,
                password: 'password123'
            });
            token = authRes.data.token;
            console.log("🔑 Got Token:", token.substring(0, 20) + "...");
        } catch (authErr) {
            console.error("Auth Failed:", authErr.message);
            return;
        }

        // 2. Fetch Orders (Should be empty initially)
        console.log("📂 Fetching Orders (Expect Empty)...");
        try {
            const res1 = await axios.get('http://localhost:5000/api/orders/mine', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("✅ Fetch Success via axios:", res1.data.length, "orders");
        } catch (err) {
            console.error("❌ Fetch Failed:", err.message);
            if (err.response) {
                 console.error("Status:", err.response.status);
                 console.error("Data:", err.response.data);
            }
        }

    } catch (error) {
        console.error("❌ Global Fail:", error.message);
    }
}

testGetOrders();
