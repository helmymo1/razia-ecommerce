const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/orders',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
    // Auth is disabled currently
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', data.substring(0, 500)); // First 500 chars
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
