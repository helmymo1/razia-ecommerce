const app = require('../server');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

async function runTest() {
    console.log('Starting Logger Verification...');
    
    try {
        // 1. Verify Log Files Creation (Might fail if no logs written yet, but startup logs should trigger)
        const logDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logDir)) {
             console.warn('Log directory does not exist yet (normal if no logs written).');
        }

        // 2. Trigger Request Log
        console.log('Triggering Request Log...');
        await request(app).get('/api/products'); // Public route

        // 3. Trigger Error Log
        // We can simulate an error by manually logging or hitting a route that throws
        console.log('Triggering Manual Error Log...');
        logger.error('Test Error Log Entry');

        // 4. Verify Log Content (Wait briefly for async write)
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (fs.existsSync(path.join(logDir, 'combined.log'))) {
             const combined = fs.readFileSync(path.join(logDir, 'combined.log'), 'utf8');
             if (combined.includes('Test Error Log Entry') && combined.includes('GET /api/products')) {
                 console.log('SUCCESS: combined.log contains expected entries.');
             } else {
                 console.error('FAILURE: combined.log missing entries. Content:\n', combined);
                 // don't exit, check error log
             }
        } else {
            console.error('FAILURE: combined.log not found.');
        }

        if (fs.existsSync(path.join(logDir, 'error.log'))) {
             const errorLog = fs.readFileSync(path.join(logDir, 'error.log'), 'utf8');
             if (errorLog.includes('Test Error Log Entry')) {
                 console.log('SUCCESS: error.log contains expected error entry.');
             } else {
                 console.error('FAILURE: error.log missing error entry.');
             }
        } else {
             // might be okay if we only triggered info logs, but we triggered error above.
             console.error('FAILURE: error.log not found.');
        }

    } catch (err) {
        console.error('TEST FAILED:', err);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

runTest();
