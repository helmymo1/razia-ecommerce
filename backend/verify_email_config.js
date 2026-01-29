
require('dotenv').config();
const nodemailer = require('nodemailer');
const Redis = require('ioredis');

async function testConfig() {
    console.log("🕵️ Checking Email Configuration...");
    
    // 1. Check Env Vars
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    console.log(`- EMAIL_USER: ${user ? 'Set ✅' : 'Missing ❌'} (${user || ''})`);
    console.log(`- EMAIL_PASS: ${pass ? 'Set ✅' : 'Missing ❌'} (${pass ? '******' : ''})`);

    if (!user || !pass) {
        console.error("❌ Credentials missing. Email cannot work.");
    }

    // 2. Test Redis
    console.log("\n🕵️ Checking Redis Connection...");
    const redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        maxRetriesPerRequest: 1
    });

    try {
        await redis.ping();
        console.log("✅ Redis Connected Successfully.");
    } catch (err) {
        console.error("❌ Redis Connection Failed:", err.message);
        console.error("   (Is Redis server running?)");
    } finally {
        redis.disconnect();
    }

    // 3. Test SMTP (Direct)
    if (user && pass) {
        console.log("\n🕵️ Testing SMTP Login...");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass }
        });

        try {
            await transporter.verify();
            console.log("✅ SMTP Login Successful.");
        } catch (err) {
            console.error("❌ SMTP Login Failed:", err.message);
            console.error("   (Check password or App Password settings)");
        }
    }

    process.exit(0);
}

testConfig();
