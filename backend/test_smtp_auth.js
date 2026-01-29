
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTP() {
    console.log("📧 Testing SMTP Authentication...");
    console.log(`User: ${process.env.EMAIL_USER}`);
    
    // Check if password exists (don't print it)
    if (!process.env.EMAIL_PASS) {
        console.error("❌ EMAIL_PASS is missing/empty in .env");
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("✅ SMTP Credentials Verified! Login Successful.");
        
        // Try sending a test email to self
        console.log("📤 Sending Test Email...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Razia Store SMTP Test',
            text: 'If you receive this, your email configuration is working correctly!'
        });
        console.log(`✅ Test Email Sent! Message ID: ${info.messageId}`);
    } catch (err) {
        console.error("❌ SMTP Error:", err.message);
        console.error("Possible causes:");
        console.error("1. Invalid email or password.");
        console.error("2. Using login password instead of App Password (for Gmail).");
        console.error("3. 2FA is on but App Password not used.");
        process.exit(1);
    }
}

testSMTP();
