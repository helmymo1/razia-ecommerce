const http = require('http');

console.log('Testing /api/products...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/products',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response length:', data.length);
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        console.log('Data count:', Array.isArray(json) ? json.length : 'Not array');
        if (Array.isArray(json) && json.length > 0) {
            console.log('First Item:', JSON.stringify(json[0]).substring(0, 100));
        }
      } catch (e) {
        console.log('Invalid JSON response');
        console.log('Body start:', data.substring(0, 100));
      }
    } else {
        console.log('Body start:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
