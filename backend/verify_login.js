
const axios = require('axios');

async function verifyLogin() {
    const loginUrl = 'http://127.0.0.1:5000/api/auth/login';
    const credentials = {
        email: 'admin@example.com',
        password: 'password123'
    };

    console.log(`🔍 Attempting login at ${loginUrl}...`);
    console.log(`👤 Credentials: ${credentials.email} / ${credentials.password}`);

    try {
        const response = await axios.post(loginUrl, credentials);
        console.log("✅ LOGIN SUCCESS!");
        console.log("Token:", response.data.token ? "Present" : "Missing");
        console.log("Role:", response.data.role);
    } catch (error) {
        console.error("❌ LOGIN FAILED");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Message:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

verifyLogin();
