
const axios = require('axios');

async function testCreateOrder() {
    try {

        // 1. Authenticate (Register random user to get token)
        const randomEmail = `testuser_${Date.now()}@example.com`;
        console.log(`🔐 Authenticating as ${randomEmail}...`);
        
        // Try Login or Register
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
            if (authErr.response) console.error(authErr.response.data);
            return;
        }

        console.log("🚀 Sending Order Request...");
        const response = await axios.post('http://localhost:5000/api/orders', {
            // Mock Cart Items (Use the ID from the "Ghost Fix" log or a known one)
            order_items: [
                {
                    product_id: "6f8d9c5e-856c-4b53-9366-079717154563", 
                    quantity: 1
                }
            ],
            // Mock Shipping Info
            shipping_info: {
                firstName: "Test",
                lastName: "User",
                email: randomEmail, // Match user
                phone: "0555555555",
                address: "123 Test St",
                city: "Riyadh",
                zipCode: "12345",
                country: "Saudi Arabia"
            },
            save_to_profile: false,
            paymentMethod: "card"
        }, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        console.log("✅ Success! Order Created:", response.data);
    } catch (error) {
        console.error("❌ Request Failed:", error.message);
        console.error("Full Error:", error);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

testCreateOrder();
