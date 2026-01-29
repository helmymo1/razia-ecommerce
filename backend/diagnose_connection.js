
const axios = require('axios');

async function diagnose() {
    console.log("🔍 Diagnosing Order Fetch...");
    
    // 1. Login to get token
    let token;
    try {
        const auth = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com', // Try admin or create new
            password: 'password123'
        });
        token = auth.data.token;
        console.log("✅ Authenticated. Token acquired.");
    } catch (e) {
        // Try registering if login fails
        try {
             const randomEmail = `test_${Date.now()}@example.com`;
             const register = await axios.post('http://localhost:5000/api/auth/register', {
                 name: 'Test', email: randomEmail, password: 'password123'
             });
             token = register.data.token;
             console.log("✅ Registered new user. Token acquired.");
        } catch (regErr) {
             console.error("❌ Auth Failed completely:", regErr.message);
             return;
        }
    }

    // 2. Simulate Frontend Request (HEADERS + ORIGIN)
    // Profile.tsx: api.get('/orders/mine')
    // Origin: http://localhost:5173
    
    try {
        const res = await axios.get('http://localhost:5000/api/orders/mine', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Origin': 'http://localhost:5173', // Simulate Vite
                'Accept': 'application/json'
            }
        });
        console.log("✅ REQUEST SUCCESS!");
        console.log("Status:", res.status);
        console.log("Data:", typeof res.data, Array.isArray(res.data) ? res.data.length : res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log("First Order Items:", res.data[0].items);
        }
    } catch (error) {
        console.error("❌ REQUEST FAILED");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else if (error.request) {
            console.error("No Response Received (Network Error?)");
            console.error("Error Code:", error.code);
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

diagnose();
