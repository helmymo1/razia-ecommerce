
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const axios = require('axios');

async function debugAuth() {
    console.log("🕵️ STARTING DEEP AUTH DEBUG 🕵️");
    
    const attempts = [
        { email: 'admin@example.com', password: 'password123' },
        { email: 'min@example.com', password: 'password123' }
    ];

    for (const attempt of attempts) {
        console.log(`\n-----------------------------------`);
        console.log(`1. Checking DB for: ${attempt.email}`);
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [attempt.email]);
        
        if (users.length === 0) {
            console.log(`❌ User NOT FOUND in DB: ${attempt.email}`);
        } else {
            console.log(`✅ User FOUND: ID=${users[0].id}, Role=${users[0].role}`);
            console.log(`   Hash: ${users[0].password_hash.substring(0, 10)}...`);
            
            console.log(`2. Manually Verifying Password: '${attempt.password}'`);
            const isMatch = await bcrypt.compare(attempt.password, users[0].password_hash);
            console.log(isMatch ? "✅ BCrypt Match: YES" : "❌ BCrypt Match: NO (Password Reset Needed?)");

            console.log(`3. Testing API Login Endpoint (http://127.0.0.1:5000/api/auth/login)...`);
            try {
                const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
                    email: attempt.email,
                    password: attempt.password
                });
                console.log("✅ API Login: SUCCESS 200 OK");
                console.log("   Token received:", !!res.data.token);
            } catch (err) {
                console.log("❌ API Login: FAILED");
                console.log("   Status:", err.response ? err.response.status : "Network Error");
                console.log("   Msg:", err.response ? err.response.data : err.message);
            }
        }
    }
    console.log(`\n-----------------------------------`);
    process.exit(0);
}

debugAuth();
