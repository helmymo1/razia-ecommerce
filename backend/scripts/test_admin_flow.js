// backend/scripts/test_admin_flow.js
const axios = require('axios');
const db = require('../config/db');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@ebazer.com';
const ADMIN_PASS = '123456';

async function testFlow() {
  let token;
  let testUserId;

  console.log('--- STARTING ADMIN USER FLOW TEST ---');

  // 1. LOGIN
  try {
    console.log('1. Logging in as Admin...');
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASS
    });
    token = res.data.token;
    console.log('   Login SUCCESS. Token received.');
  } catch (err) {
    console.error('   Login FAILED:', err.response?.data || err.message);
    process.exit(1);
  }

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // 2. ADD USER
  try {
    console.log('\n2. Add New User...');
    const userData = {
      name: 'Test Automatic User',
      email: `test_auto_${Date.now()}@example.com`,
      password: 'password123',
      role: 'customer'
    };
    const res = await axios.post(`${API_URL}/admin/users`, userData, authHeader);
    console.log('   Add User SUCCESS:', res.data);
    testUserId = res.data.id;
  } catch (err) {
    console.error('   Add User FAILED:', err.response?.data || err.message);
    process.exit(1);
  }

  // 3. GET USERS & VERIFY
  try {
    console.log('\n3. Get All Users...');
    const res = await axios.get(`${API_URL}/admin/users`, authHeader);
    const users = res.data;
    const found = users.find(u => u.id === testUserId);
    if (found) {
      console.log('   Get Users SUCCESS. Found newly created user.');
    } else {
      console.error('   Get Users FAILED. New user not found in list.');
      process.exit(1);
    }
  } catch (err) {
    console.error('   Get Users FAILED:', err.response?.data || err.message);
    process.exit(1);
  }

  // 4. EDIT USER
  try {
    console.log(`\n4. Edit User (ID: ${testUserId})...`);
    const updateData = {
      name: 'Updated Automatic User',
      role: 'admin'
    };
    const res = await axios.put(`${API_URL}/admin/users/${testUserId}`, updateData, authHeader);
    console.log('   Edit User SUCCESS:', res.data);
  } catch (err) {
    console.error('   Edit User FAILED:', err.response?.data || err.message);
    process.exit(1);
  }

  // 5. DELETE USER
  try {
    console.log(`\n5. Delete User (ID: ${testUserId})...`);
    const res = await axios.delete(`${API_URL}/admin/users/${testUserId}`, authHeader);
    console.log('   Delete User SUCCESS:', res.data);
  } catch (err) {
    console.error('   Delete User FAILED:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- ADMIN USER FLOW TEST COMPLETE: SUCCESS ---');
  process.exit(0);
}

testFlow();
