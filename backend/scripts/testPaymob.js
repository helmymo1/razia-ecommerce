require('dotenv').config(); // Defaults to .env in CWD
const axios = require('axios');

async function testPaymobConnection() {
    const apiKey = process.env.PAYMOB_SECRET_KEY;
    const url = process.env.PAYMOB_API_URL || 'https://ksa.paymob.com/v1/intention/';

    console.log(`🔍 Testing Intention API: ${url}`);
    console.log(`🔑 Using Secret Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'UNDEFINED'}`);

    if (!apiKey) {
        console.error("❌ ERROR: PAYMOB_SECRET_KEY is missing in .env");
        return;
    }

    try {
        // Minimal payload
        const intId = parseInt(process.env.PAYMOB_INTEGRATION_ID);
        const payload = {
            amount: 100, // 1 SAR
            currency: "SAR",
            payment_methods: [intId], // Use explicit ID
            items: [{ name: "Test", amount: 100, description: "Test", quantity: 1 }],
            billing_data: {
                first_name: "Test", last_name: "User", phone_number: "+966500000000", email: "test@test.com", country: "SA"
            },
            customer: { first_name: "Test", last_name: "User", email: "test@test.com" }
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("\n✅ Connection SUCCESS! Intention Created.");
        console.log("Response:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log("\n❌ Request Failed.");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            // 400 is GOOD (means Auth passed, validation failed). 401/403 is BAD.
            if (error.response.status === 401 || error.response.status === 403) {
                 console.error("❌ CRTICAL: Auth Failed. Key Rejected.");
                 console.error("Data:", JSON.stringify(error.response.data, null, 2));
            } else {
                 console.log("✅ Auth Success (Validation Error likely)");
                 console.log("Data:", JSON.stringify(error.response.data, null, 2));
            }
        } else {
            console.error("❌ Network Error:", error.message);
        }
    }
}

testPaymobConnection();
