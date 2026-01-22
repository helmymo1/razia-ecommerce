const axios = require('axios');
const db = require('./config/db');

async function triggerPayment() {
    try {
        console.log("Fetching latest order...");
        const [orders] = await db.query('SELECT id FROM orders ORDER BY created_at DESC LIMIT 1');
        
        if (orders.length === 0) {
            console.log("No orders found.");
            return;
        }

        const orderId = orders[0].id;
        console.log(`Latest Order ID: ${orderId}`);

        console.log("Triggering Payment Endpoint...");
        try {
            const response = await axios.post('http://localhost:5000/api/payment/initiate', {
                orderId: orderId
            });
            console.log("✅ Response:", response.data);
        } catch (err) {
            console.log("❌ Request Failed:");
            if (err.response) {
                console.log("   Status:", err.response.status);
                console.log("   Data:", JSON.stringify(err.response.data, null, 2));
            } else {
                console.log("   Error:", err.message);
            }
        }
        
        process.exit(0);

    } catch (error) {
        console.error("Script Error:", error);
        process.exit(1);
    }
}

triggerPayment();
