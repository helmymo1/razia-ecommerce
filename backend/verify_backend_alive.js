const axios = require('axios');

async function checkBackend() {
    console.log("Checking Backend Status...");
    try {
        const root = await axios.get('http://localhost:5000/');
        console.log("✅ Root Status:", root.data);
    } catch (e) {
        console.log("❌ Root Status Failed:", e.message);
    }

    try {
        // Just checking if route exists (expecting 401 or 200)
        await axios.get('http://localhost:5000/api/orders/shipments');
    } catch (e) {
        if (e.response) {
            console.log(`✅ API /shipments responded with Status: ${e.response.status} (Expected 401/403 if unauthenticated)`);
        } else {
             console.log("❌ API /shipments Connection Error:", e.message);
        }
    }
}

checkBackend();
