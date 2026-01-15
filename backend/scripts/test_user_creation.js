const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testUserCreation() {
    try {
        // 1. Login as Admin
        console.log('Logging in as admin...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@ebazer.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('Login successful. Token received.');

        // 2. Create a new user
        console.log('Creating a new test user...');
        const newUser = {
            name: 'Test REST User',
            email: `test_rest_${Date.now()}@example.com`,
            password: 'password123',
            role: 'customer'
        };

        const createResponse = await axios.post(`${API_URL}/users`, newUser, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('User created successfully:', createResponse.data);

        // 3. Verify user exists in list
        console.log('Verifying user in list...');
        const listResponse = await axios.get(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const createdUser = listResponse.data.find(u => u.email === newUser.email);
        if (createdUser) {
            console.log('User found in list:', createdUser);
        } else {
            console.error('User NOT found in list!');
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testUserCreation();
