
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET;
const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

(async () => {
    let connection;
    try {
        console.log('--- STARTING PROFILE & ADDRESS VERIFICATION ---');
        
        // 1. Setup DB Connection & Test User
        connection = await mysql.createConnection(DB_CONFIG);
        const [users] = await connection.query('SELECT * FROM users LIMIT 1');
        
        if (users.length === 0) { console.log('No users.'); process.exit(1); }
        const user = users[0];
        console.log(`User: ${user.email}`);

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Test Edit Profile (Name)
        console.log('\n[TEST] Edit Profile');
        const updatePayload = { first_name: 'UpdatedName', last_name: 'UpdatedLast', phone: '999888777' };
        const resProfile = await axios.put(`${API_URL}/users/profile`, updatePayload, { headers });
        if (resProfile.data.first_name === 'UpdatedName') console.log('✅ Profile Name Updated');
        else console.error('❌ Profile Name Update Failed');

        // 3. Test Add Address
        console.log('\n[TEST] Add Address');
        const addrPayload = {
            name: 'Home', address_line1: '123 Test St', city: 'TestCity', 
            zip: '12345', country: 'TestLand', phone: '111222333'
        };
        const resAddrAdd = await axios.post(`${API_URL}/addresses`, addrPayload, { headers });
        console.log(`✅ Address Added: ${resAddrAdd.data.id}`);
        if(resAddrAdd.data.title === 'Home') console.log('✅ Title mapped correctly from name');
        else console.error('❌ Title mapping failed:', resAddrAdd.data);
        const addrId = resAddrAdd.data.id;

        // 4. Test Get Addresses
        console.log('\n[TEST] Get Addresses');
        const resAddrGet = await axios.get(`${API_URL}/addresses`, { headers });
        const found = resAddrGet.data.find(a => a.id === addrId);
        if (found) console.log(`✅ Address Found (Total: ${resAddrGet.data.length})`);
        else console.error('❌ Address NOT Found');

        // 5. Test Update Address
        console.log('\n[TEST] Update Address');
        const resAddrUpd = await axios.put(`${API_URL}/addresses/${addrId}`, { ...addrPayload, city: 'UpdatedCity' }, { headers });
        if (resAddrUpd.data.city === 'UpdatedCity') console.log('✅ Address City Updated');
        else console.error('❌ Address Update Failed');

        // 6. Test Delete Address
        console.log('\n[TEST] Delete Address');
        await axios.delete(`${API_URL}/addresses/${addrId}`, { headers });
        const resAddrCheck = await axios.get(`${API_URL}/addresses`, { headers });
        if (!resAddrCheck.data.find(a => a.id === addrId)) console.log('✅ Address Deleted');
        else console.error('❌ Address Deletion Failed');

    } catch (error) {
        console.error('FATAL ERROR:', error.response?.data || error.message);
    } finally {
        if (connection) await connection.end();
        console.log('--- VERIFICATION COMPLETE ---');
    }
})();
