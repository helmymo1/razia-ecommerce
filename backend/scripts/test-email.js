const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log("Checking Environment Variables...");
    console.log("SMTP_HOST:", process.env.SMTP_HOST || "MISSING");
    console.log("SMTP_PORT:", process.env.SMTP_PORT || "MISSING");
    console.log("SMTP_USER:", process.env.SMTP_USER || "MISSING");
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "********" : "MISSING");

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("❌ CRTICAL: Missing SMTP Configuration in .env file.");
        console.error("Please add SMTP_HOST, SMTP_USER, and SMTP_PASS to backend/.env");
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Test Script" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to self
            subject: "Test Email from eBazer",
            text: "If you received this, the transactional email system is working!",
            html: "<b>If you received this, the transactional email system is working!</b>",
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

testEmail();
