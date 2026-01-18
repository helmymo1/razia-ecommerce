const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

exports.sendOrderConfirmation = async (userEmail, orderDetails, items) => {
    // Build HTML Table for items
    const itemsHtml = items.map(i => `
        <tr>
            <td>${i.name}</td>
            <td>${i.quantity}</td>
            <td>${i.unit_price || i.price} SAR</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: '"Razia Store" <' + process.env.EMAIL_USER + '>',
        to: userEmail,
        subject: `Order Confirmed #${orderDetails.order_number || orderDetails.id}`,
        html: `
            <h1>Thank you for your order!</h1>
            <p>We are preparing your package for shipping to <strong>${orderDetails.shipping_city}</strong>.</p>
            <h3>Order Summary:</h3>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <p><strong>Total: ${orderDetails.total} SAR</strong></p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Order Confirmation Email sent to ${userEmail}`);
    } catch (error) {
        console.error("Email Service Error:", error);
        // Don't throw to avoid disrupting the main flow
    }
};
