const axios = require('axios');

const testUsers = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/users');
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2).slice(0, 500));
    } catch (err) {
        console.log('Error:', err.response?.status, err.response?.data || err.message);
    }
};

testUsers();
