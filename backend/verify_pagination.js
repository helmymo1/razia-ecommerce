const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const STATIC_URL = 'http://localhost:5000/uploads';
// Using a file we saw in the directory listing
const TEST_IMAGE = 'productImage-1768134639958.gif'; 

async function verify() {
    console.log('--- Starting Pagination & Static File Verification ---');

    // 1. Pagination Test
    try {
        console.log('\n[TEST 1] Testing Pagination (Limit 2)...');
        const res = await axios.get(`${API_URL}/products?page=1&limit=2`);
        
        if (res.data.data && Array.isArray(res.data.data) && res.data.pagination) {
            console.log(`✅ Response Structure Valid (Data: ${res.data.data.length} items)`);
            
            if (res.data.data.length === 2) {
                 console.log('✅ Limit respected (2 items returned)');
            } else {
                 console.error(`❌ Limit Failed: Expected 2, got ${res.data.data.length}`);
            }

            console.log('Pagination Meta:', res.data.pagination);
        } else {
            console.error('❌ Invalid Response Structure:', Object.keys(res.data));
        }

    } catch (error) {
        console.error('❌ Pagination Test Error:', error.message);
    }

    // 2. Static File Test
    try {
        console.log(`\n[TEST 2] Testing Static File Access (${TEST_IMAGE})...`);
        const res = await axios.get(`${STATIC_URL}/${TEST_IMAGE}`);
        
        if (res.status === 200) {
            console.log('✅ Static File Accessed Successfully');
            console.log(`   Type: ${res.headers['content-type']}`);
            console.log(`   Size: ${res.headers['content-length']} bytes`);
        }
    } catch (error) {
        console.error(`❌ Static File Failed: ${error.message} (Is the file really there?)`);
        // Fallback test
        console.log('   Trying to create a test file to verify uploads mapping...');
    }
}

verify();
