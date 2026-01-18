const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Utility: Master Email Layout
const _wrapWithBranding = (content) => {
    return `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 0; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background-color: #000000; padding: 24px; text-align: center;">
                   <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: bold;">RAZIA</h1> 
                </div>
                
                <!-- Body -->
                <div style="padding: 32px; color: #333333; line-height: 1.6; font-size: 16px;">
                    ${content}
                </div>

                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0;">© 2026 Razia E-Commerce. All rights reserved.</p>
                    <p style="margin: 5px 0 0;">Riyadh, Saudi Arabia</p>
                </div>
            </div>
        </div>
    `;
};

// Utility: Send Email
const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: '"Razia Store" <' + process.env.SMTP_USER + '>',
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error("Email Service Error:", error.message);
        // We log but don't throw, to prevent blocking the main process
    }
};

// Templates
const templates = {
    welcome: (name) => `
        <h1>Welcome to Razia!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Razia E-Commerce. We are thrilled to have you!</p>
        <p>Start exploring our latest collection now.</p>
    `,
    loginAlert: (date) => `
        <h1>New Login Detected</h1>
        <p>We detected a new login to your Razia account on ${date}.</p>
        <p>If this wasn't you, please reset your password immediately.</p>
    `,
    orderConfirmation: (orderDetails, items) => {
        const itemsHtml = items.map(i => `
            <tr>
                <td>${i.name || i.product_name}</td>
                <td>${i.quantity}</td>
                <td>${i.unit_price || i.price} SAR</td>
            </tr>
        `).join('');

        return `
            <h1>Order Confirmed #${orderDetails.order_number || orderDetails.id}</h1>
            <p>Thank you for shopping with us!</p>
            <h3>Order Summary:</h3>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            <p><strong>Total: ${orderDetails.total} SAR</strong></p>
        `;
    },
    refundRequest: (orderId) => `
        <h1>Refund Request Received</h1>
        <p>We have received your refund request for Order #${orderId}.</p>
        <p>Our team will review your request and get back to you shortly.</p>
    `,
    refundProcessed: (name, orderId) => `
        <h1>Refund Processed</h1>
        <p>Hi ${name},</p>
        <p>Good news! We have processed the refund for Order #${orderId}.</p>
        <p>The funds have been sent back to your original payment method.</p>
        <p>Please allow 5-10 business days for your bank to reflect the transaction.</p>
    `
};

// Exports
exports.sendWelcome = async (email, name) => {
    await sendEmail({
        to: email,
        subject: 'Welcome to Razia!',
        html: _wrapWithBranding(templates.welcome(name))
    });
};

exports.sendLoginAlert = async (email) => {
    await sendEmail({
        to: email,
        subject: 'Security Alert: New Login',
        html: _wrapWithBranding(templates.loginAlert(new Date().toLocaleString()))
    });
};

exports.sendReceipt = async (order, items) => {
    // Note: 'items' might need to be fetched if not provided, but mostly passed from controller
    await sendEmail({
        to: order.user_email || order.email, // fallback
        subject: `Order Confirmation #${order.order_number || order.id}`,
        html: _wrapWithBranding(templates.orderConfirmation(order, items))
    });
};

// export legacy alias if used elsewhere
exports.sendOrderConfirmation = exports.sendReceipt;

exports.sendRefundConfirmation = async (email, orderId) => {
    await sendEmail({
        to: email,
        subject: `Refund Request Received #${orderId}`,
        html: _wrapWithBranding(templates.refundRequest(orderId))
    });
};

exports.sendRefundRequestAdminNotification = async (orderId) => {
    // Ideally fetch admin email from env or DB, here assuming SMTP_USER for simplicity/self-notification
    await sendEmail({
        to: process.env.SMTP_USER,
        subject: `ACTION REQUIRED: Refund Request #${orderId}`,
        html: _wrapWithBranding(`
            <h1>Refund Request Alert</h1>
            <p>A user has requested a refund for Order #${orderId}.</p>
            <p>Please review this request in the Admin Panel.</p>
        `)
    });
};

exports.sendRefundProcessed = async (email, orderId, name) => {
    await sendEmail({
        to: email,
        subject: `Refund Processed for Order #${orderId}`,
        html: _wrapWithBranding(templates.refundProcessed(name, orderId))
    });
};

exports.sendCustomResponse = async (toEmail, subject, adminMessageBody) => {
    const formattedBody = adminMessageBody ? adminMessageBody.replace(/\n/g, '<br/>') : '';
    await sendEmail({
        to: toEmail,
        subject: subject,
        html: _wrapWithBranding(formattedBody)
    });
};

exports.sendReferralReward = async (email, couponCode) => {
    await sendEmail({
        to: email,
        subject: 'You earned 15% off! Your friend just bought their outfit.',
        html: _wrapWithBranding(`
            <h1>Congrats! You've earned a reward!</h1>
            <p>Your friend just successfully placed an order using your referral code.</p>
            <p>As a thank you, here is a <strong>15% OFF</strong> coupon for your next purchase:</p>
            <div style="background: #eee; padding: 15px; text-align: center; margin: 20px 0; font-size: 20px; font-weight: bold; letter-spacing: 2px;">
                ${couponCode}
            </div>
            <p>This code expires in 30 days. Happy Shopping!</p>
        `)
    });
};

