const axios = require('axios');
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true, baseURL: 'http://localhost:5000/api' }));

async function verifyUsersApi() {
    try {
        console.log('1. Logging in as admin...');
        const loginRes = await client.post('/auth/login', {
            email: 'admin@ebazer.com',
            password: '123456'
        });

        if (loginRes.status === 200) {
            console.log('✅ Login successful.');
        } else {
            console.error('❌ Login failed:', loginRes.status, loginRes.data);
            return;
        }

        console.log('2. Fetching /api/users...');
        const usersRes = await client.get('/users');

        if (usersRes.status === 200 && Array.isArray(usersRes.data)) {
            console.log(`✅ Success! Fetched ${usersRes.data.length} users.`);
            if (usersRes.data.length > 0) {
                console.log('Sample User:', usersRes.data[0]);
            } else {
                console.warn('⚠️ Warning: Users array is empty.');
            }
        } else {
            console.error('❌ Failed to fetch users:', usersRes.status, usersRes.data);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

verifyUsersApi();
