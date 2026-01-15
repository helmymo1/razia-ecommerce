const axios = require('axios');
const db = require('./config/db');

const API_URL = 'http://localhost:5000/api';
// Use a real existing user or create one
const TEST_EMAIL = 'admin@ebazer.com';
const TEST_PASSWORD = 'password123';

async function verifyAuthStatus() {
    console.log('--- Starting Auth Status Check Verification ---');

    let token;
    let userId;

    // 1. Login to get valid token
    try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        token = loginRes.data.token;
        // Decode token to get ID roughly or fetch me
        // Let's rely on /auth/me to get ID if needed, or query db by email
        userId = loginRes.data.id; // Login response likely returns user id
        if (!userId) {
             // Fallback
             const [u] = await db.query('SELECT id FROM users WHERE email = ?', [TEST_EMAIL]);
             userId = u[0].id;
        }

        console.log(`✅ Logged in as User ID: ${userId}`);
    } catch (error) {
        console.error('❌ Login Failed:', error.message);
        process.exit(1);
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Verify Access Works (Before Deactivation)
    try {
        await axios.get(`${API_URL}/dashboard/stats`, config);
        console.log('✅ Access allowed for active user');
    } catch (error) {
        console.error('❌ Access Failed unexpectedly:', error.message);
    }

    // 3. Deactivate User directly in DB
    try {
        await db.query('UPDATE users SET is_deleted = 1 WHERE id = ?', [userId]);
        console.log('🔸 User marked as deleted (is_deleted = 1)');
    } catch (error) {
        console.error('❌ DB Update Failed:', error.message);
    }

    // 4. Verify Access Denied (After Deactivation)
    try {
        await axios.get(`${API_URL}/dashboard/stats`, config);
        console.error('❌ FAILURE: Deactivated user still has access!');
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log('✅ Access DENIED (403) for deactivated user');
            if (error.response.data.message === 'Account Deactivated') {
                console.log('✅ Correct Error Message received');
            }
        } else {
            console.error(`❌ Unexpected Error: ${error.response ? error.response.status : error.message}`);
        }
    }

    // 5. Restore User (Cleanup)
    try {
        await db.query('UPDATE users SET is_deleted = 0 WHERE id = ?', [userId]);
        console.log('🔸 User restored (is_deleted = 0)');
    } catch (error) {
        console.error('❌ DB Restore Failed:', error.message);
    }
    
    process.exit();
}

verifyAuthStatus();
