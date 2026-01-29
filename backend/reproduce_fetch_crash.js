
const axios = require('axios');

async function testFetchWithOrders() {
    try {
        // 1. Authenticate
        const randomEmail = `crash_test_${Date.now()}@example.com`;
        console.log(`🔐 Authenticating as ${randomEmail}...`);
        
        let token;
        try {
            const authRes = await axios.post('http://localhost:5000/api/auth/register', {
                name: 'Crash Test',
                email: randomEmail,
                password: 'password123'
            });
            token = authRes.data.token;
        } catch (authErr) {
            console.error("Auth Failed:", authErr.message);
            return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        // 2. Create Order
        console.log("🛒 Creating Order...");
        try {
            await axios.post('http://localhost:5000/api/orders', {
                order_items: [
                    { product_id: "6f8d9c5e-856c-4b53-9366-079717154563", quantity: 1 } // Will use magic fix to find real product
                ],
                shipping_info: {
                    firstName: "Crash", lastName: "Test", email: randomEmail,
                    phone: "0555555555", address: "123 Test St", city: "Riyadh",
                    zipCode: "12345", country: "SA"
                },
                save_to_profile: false
            }, { headers });
            console.log("✅ Order Created");
        } catch (err) {
            console.log("⚠️ Create Order Failed (Might be expected if stock low):", err.message);
            // Proceed anyway to see if fetch fails (maybe previous orders exist?)
            // Actually if create fails, we might have 0 orders.
        }

        // 3. Fetch Orders (This is the crashing step?)
        console.log("📂 Fetching Orders...");
        try {
            const res = await axios.get('http://localhost:5000/api/orders/mine', { headers });
            console.log("✅ Fetch Success:", res.data.length, "orders");
            if (res.data.length > 0) {
               console.log("Sample Item:", JSON.stringify(res.data[0].items));
            }
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

testFetchWithOrders();
