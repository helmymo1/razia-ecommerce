const axios = require('axios');
const db = require('./config/db');

async function triggerWebhook() {
    try {
        console.log("🔍 Finding a recent order to mark as PAID...");
        const [orders] = await db.query('SELECT id, is_paid FROM orders ORDER BY created_at DESC LIMIT 1');
        
        if (orders.length === 0) {
            console.log("❌ No orders found to test.");
            process.exit(1);
        }

        const orderId = orders[0].id;
        console.log(`🎯 Testing with Order ID: ${orderId} (Currently Paid: ${orders[0].is_paid})`);

        const payload = {
            orderId: orderId,
            success: true, // Simulate success
            transactionId: 'txn_test_' + Date.now()
        };

        console.log("🚀 Sending Webhook Request...");
        const response = await axios.post('http://localhost:5006/api/payments/webhook', payload);
        
        console.log("✅ Response:", response.data);

    } catch (error) {
        console.error("❌ Link Error:", error.response ? error.response.data : error.message);
    }
}

triggerWebhook();
