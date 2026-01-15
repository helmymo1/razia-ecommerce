const axios = require('axios');
// Simple call without cookies/auth since we disabled middleware
const BASE_URL = 'http://localhost:5000/api';

async function verifyUsersApiPublic() {
    try {
        console.log('Fetching /api/users (Public Mode)...');
        const res = await axios.get(`${BASE_URL}/users`);

        if (res.status === 200 && Array.isArray(res.data)) {
            console.log(`✅ Success! Fetched ${res.data.length} users.`);
            console.log('Sample User:', res.data[0]);
        } else {
            console.error('❌ Failed:', res.status, res.data);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

verifyUsersApiPublic();
