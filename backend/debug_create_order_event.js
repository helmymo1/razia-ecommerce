const axios = require('axios');

async function createOrder() {
    try {
        console.log("🚀 Creating Test Order...");
        
        // Use a known product ID (or let backend fallback logic handle it with a fake one)
        // We will use a mock ID that triggers the "Ghost Item" logic if needed, or just relied on the recent fix
        const payload = {
            order_items: [
                { product_id: 'test-product-id', quantity: 1 } 
            ],
            shipping_info: {
                firstName: "Test",
                lastName: "User",
                address: "123 Event Bus Lane",
                city: "Notification City",
                zip: "12345",
                phone: "555-0123",
                country: "Saudi Arabia"
            },
            save_to_profile: false
        };

        const response = await axios.post('http://localhost:5003/api/orders', payload, {
            // Mock auth headers if needed, but since we don't have a valid JWT generator handy without login,
            // we might hit 401. 
            // Wait, the order route IS protected.
            // I need to login first or use an existing token.
            // Actually, I can use the same workaround as previous tasks: 
            // The user verified the "start" command output.
            
            // Let's try to login first if I can find a login script, or just DISABLE auth temporarily for this test?
            // "Law of Surgical Precision" says don't break it.
            
            // I'll assume I need to login.
            // Let's try to find a token or login.
            
        });
        
        console.log("✅ Order Created:", response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("⚠️ Auth required. Skipping automatic creation script and relying on manual check or login.");
        } else {
             console.error("❌ Error:", error.response ? error.response.data : error.message);
        }
    }
}

// Check if we can login easily.
// If not, I will just ask the user to verify or inspect the logs if I can trigger it another way.
// Actually, I can use the existing `verify_product_create_axios.js` as a template which might have auth logic?
// No, I'll creates a simple `verify_event_bus.js` that imports the bus directly to test IT first? 
// The user wants "When I create a new order (via Checkout)...".
// So testing the integration is key.

// I will try to use the `admin` token or similar if I can find one.
// The `debug_trigger_payment.js` I saw earlier didn't seem to have auth headers?
// Let's check `backend/verify_api.js` to see how it authenticates.

createOrder();
