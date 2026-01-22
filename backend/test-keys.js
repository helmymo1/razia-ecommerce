require('dotenv').config();
const axios = require('axios');

async function testKeys() {
    console.log("\n🔑 PAYMOB INTENTION API (V1) VERIFIER");
    console.log("-----------------------------------------");
    const secretKey = process.env.PAYMOB_SECRET_KEY;
    console.log(`Checking SECRET Key ending in: ...${secretKey ? secretKey.slice(-4) : 'NONE'}`);
    
    if (!secretKey) {
        console.error("❌ FAILED: PAYMOB_SECRET_KEY is missing in .env");
        return;
    }

    // Test Intention API Creation
    try {
        console.log("1. Sending Test Intention Request...");
        
        const payload = {
            amount: 100, // 100 SAR Major Units
            currency: "SAR",
            payment_methods: [
                parseInt(process.env.PAYMOB_INTEGRATION_ID) || 12345, 
                "card"
            ],
            items: [
                { name: "Test Item", amount: 100, description: "Test", quantity: 1 }
            ],
            billing_data: {
                apartment: "NA", first_name: "Test", last_name: "User", street: "Test St", 
                building: "NA", phone_number: "+966500000000", country: "SA", 
                email: "test@test.com", floor: "NA", state: "Riyadh"
            },
            customer: {
                first_name: "Test", last_name: "User", email: "test@test.com"
            },
            extras: {
                order_reference: "TEST_" + Date.now()
            }
        };

        const response = await axios.post('https://ksa.paymob.com/v1/intention/', payload, {
            headers: {
                'Authorization': `Token ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ SUCCESS: Intention Created!");
        console.log("   Full Response:", JSON.stringify(response.data, null, 2));
        console.log("🚀 CONCLUSION: Your PAYMOB_SECRET_KEY is correct and active.");

    } catch (error) {
        console.error("❌ FAILED: Intention Request Rejected.");
        console.error("   Status:", error.response?.status);
        console.error("   Reason:", JSON.stringify(error.response?.data || error.message, null, 2));
        console.error("👉 ACTION: Double check your Secret Key and Integration ID.");
    }
}

testKeys();
