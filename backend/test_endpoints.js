const http = require('http');

function checkEndpoint(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: data
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}

async function runTests() {
    console.log('Testing Endpoints...');
    
    try {
        // Test 1: Recent Orders
        console.log('1. Checking /api/dashboard/recent-orders...');
        const recentOrders = await checkEndpoint('/api/dashboard/recent-orders');
        console.log(`   Status: ${recentOrders.statusCode}`);
        if (recentOrders.statusCode === 200) {
            console.log('   Body Preview:', recentOrders.body.substring(0, 100));
            console.log('   PASS: Recent orders fetched.');
        } else {
            console.log('   FAIL: ' + recentOrders.body);
        }

        // Test 2: Products
        console.log('\n2. Checking /api/products...');
        const products = await checkEndpoint('/api/products');
        console.log(`   Status: ${products.statusCode}`);
        if (products.statusCode === 200) {
            console.log('   Body Preview:', products.body.substring(0, 100));
            console.log('   PASS: Products fetched.');
        } else {
            console.log('   FAIL: ' + products.body);
        }

    } catch (err) {
        console.error('Test Failed (Connection Error):', err.message);
    }
}

runTests();
