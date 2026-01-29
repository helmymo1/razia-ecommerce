/**
 * Email Templates Module
 * Adheres to "Anti-Soup" (Tables for layout) and "Twin-Body" (HTML + Text).
 */

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};

const getBaseStyles = () => `
    body { font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    table { border-collapse: collapse; width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f8f8f8; font-weight: bold; }
    .header { background-color: #1a1a1a; padding: 20px; text-align: center; color: #ffffff; }
    .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888; }
    .btn { display: inline-block; background-color: #d4a017; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .total-row { font-weight: bold; font-size: 16px; background-color: #f9f9f9; }
`;

/**
 * 1. Order Confirmation Template
 */
exports.orderConfirmation = (startData) => {
    const { orderDetails, items, user } = startData;
    const orderId = orderDetails.order_number || orderDetails.id;
    
    // 1. Plain Text Version
    const textBody = `
Thank you for your order, ${user.name || 'Valued Customer'}!

Your Order #${orderId} has been confirmed.
We are preparing it for shipping to: ${orderDetails.shipping_city}, ${orderDetails.shipping_address}.

Order Summary:
------------------------------------------------
${items.map(i => `${i.quantity}x ${i.name} - ${i.unit_price || i.price} SAR`).join('\n')}
------------------------------------------------
Total: ${orderDetails.total} SAR

You will receive another email when your order ships.

Thank you,
Razia Store Team
    `.trim();

    // 2. HTML Version (Table-based)
    const itemsRows = items.map(i => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.unit_price || i.price} SAR</td>
        </tr>
    `).join('');

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>${getBaseStyles()}</style>
    </head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e0e0e0;">
            <tr>
                <td class="header">
                    <h1 style="margin:0; font-size: 24px;">Order Confirmed</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px;">
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        Hello <strong>${user.name || 'Valued Customer'}</strong>,
                    </p>
                    <p style="margin-bottom: 20px;">
                        Thank you for shopping with Razia! Your order <strong>#${orderId}</strong> is confirmed and being prepared.
                    </p>
                    
                    <h3 style="border-bottom: 2px solid #d4a017; padding-bottom: 10px; margin-top: 30px;">Order Summary</h3>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th style="background-color: #f8f8f8; padding: 10px;">Item</th>
                                <th style="background-color: #f8f8f8; padding: 10px;">Qty</th>
                                <th style="background-color: #f8f8f8; padding: 10px;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsRows}
                            <tr class="total-row">
                                <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
                                <td style="padding: 15px;">${orderDetails.total} SAR</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
                        <h4 style="margin-top: 0;">Shipping to:</h4>
                        <p style="margin: 0;">
                            ${orderDetails.shipping_address}<br>
                            ${orderDetails.shipping_city}, ${orderDetails.shipping_country || 'Saudi Arabia'}<br>
                            ${orderDetails.shipping_phone}
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" class="btn">View Your Order</a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    &copy; ${new Date().getFullYear()} Razia Store. All rights reserved.<br>
                    <a href="#" style="color: #888;">Unsubscribe</a>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `.trim();

    return { subject: `Order Confirmed #${orderId}`, text: textBody, html: htmlBody };
};

/**
 * 2. Welcome Email
 */
/**
 * 2. Welcome Sequence
 */
// Step 1: Immediate Welcome
exports.welcomeStep1 = (data) => {
    const { user } = data;
    const subject = `Welcome to Razia, ${user.name.split(' ')[0]}!`;
    
    const textBody = `
Welcome to Razia, ${user.name}!

We are thrilled to have you with us. Razia is your destination for luxury, modesty, and elegance.

Start exploring our latest collections today at:
${process.env.FRONTEND_URL || 'http://localhost:5173'}

P.S. Keep an eye on your inbox. Over the next few days, we'll share the story behind our designs.

Warmly,
The Razia Team
    `.trim();

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><style>${getBaseStyles()}</style></head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e0e0e0;">
            <tr><td class="header"><h1 style="margin:0; font-size: 24px;">Welcome to Razia</h1></td></tr>
            <tr>
                <td style="padding: 40px 30px; text-align: center;">
                    <p style="font-size: 18px; color: #333;">Hello <strong>${user.name}</strong>,</p>
                    <p style="color: #555; margin-bottom: 30px;">Thank you for joining <strong>Razia</strong>. We are dedicated to bringing you the finest luxury modest fashion.</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" class="btn">Start Shopping</a>
                </td>
            </tr>
            <tr><td class="footer">&copy; ${new Date().getFullYear()} Razia Store.</td></tr>
        </table>
    </body>
    </html>`;

    return { subject, text: textBody, html: htmlBody };
};

// Step 2: Value/Education (Day 2)
exports.welcomeStep2 = (data) => {
    const { user } = data;
    const subject = `The Art of Modesty: Our Philosophy`;
    
    const textBody = `
Hi ${user.name.split(' ')[0]},

At Razia, we believe modesty shouldn't compromise on elegance.

Our fabrics are hand-picked for breathability and drape, ensuring you feel as good as you look.

Discover the difference in our signature collection.
${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop

Razia Design Team
    `.trim();

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><style>${getBaseStyles()}</style></head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e0e0e0;">
            <tr><td class="header" style="background-color: #333;"><h1 style="margin:0; font-size: 22px;">The Art of Modesty</h1></td></tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <p>Hi <strong>${user.name.split(' ')[0]}</strong>,</p>
                    <p>At Razia, we believe modesty shouldn't compromise on elegance.</p>
                    <p>Our fabrics are hand-picked for breathability and drape, ensuring you feel as good as you look.</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" class="btn" style="background-color: #555;">Discover the Collection</a>
                    </div>
                </td>
            </tr>
            <tr><td class="footer">&copy; ${new Date().getFullYear()} Razia Store.</td></tr>
        </table>
    </body>
    </html>`;

    return { subject, text: textBody, html: htmlBody };
};

// Step 3: Social Proof (Day 4)
exports.welcomeStep3 = (data) => {
    const { user } = data;
    const subject = `Loved by Thousands ✨`;
    
    const textBody = `
"The quality is unmatched. Finally, modest wear that feels premium." - Sarah A.

See what everyone is talking about, ${user.name.split(' ')[0]}.
Check out our Bestsellers.

${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop?sort=best_selling

Razia Store
    `.trim();

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><style>${getBaseStyles()}</style></head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e0e0e0;">
            <tr><td class="header" style="background-color: #d4a017;"><h1 style="margin:0; font-size: 22px;">Loved by Thousands ✨</h1></td></tr>
            <tr>
                <td style="padding: 40px 30px; text-align: center;">
                    <p style="font-style: italic; font-size: 18px; color: #555;">"The quality is unmatched. Finally, modest wear that feels premium."</p>
                    <p style="font-weight: bold;">- Sarah A.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    <p>See what everyone is talking about.</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop?sort=best_selling" class="btn">View Bestsellers</a>
                </td>
            </tr>
            <tr><td class="footer">&copy; ${new Date().getFullYear()} Razia Store.</td></tr>
        </table>
    </body>
    </html>`;

    return { subject, text: textBody, html: htmlBody };
};

/**
 * 4. Abandoned Cart Emails
 */
exports.abandonedCartStep1 = (data) => {
    const { user, cartUrl, items } = data; // items = top 3 items
    
    const textBody = `
Hi ${user.name},

Did something go wrong? We noticed you left some great pieces in your bag.

We saved them for you, but stock is limited!

Return to your bag: ${cartUrl}

Need help? Reply to this email.

Razia Customer Care
    `.trim();

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><style>${getBaseStyles()}</style></head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e0e0e0;">
            <tr>
                <td class="header" style="background-color: #f8f8f8; color: #333; text-align: left; padding: 30px;">
                    <h1 style="margin:0; font-size: 20px;">Did something go wrong?</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px;">
                    <p>Hi ${user.name},</p>
                    <p>We noticed you left some items in your bag. We saved them for you!</p>
                    <br>
                    <a href="${cartUrl}" class="btn" style="background-color: #1a1a1a;">Return to Bag</a>
                </td>
            </tr>
            <tr>
                <td class="footer">&copy; Razia Store</td>
            </tr>
        </table>
    </body>
    </html>`;

    return { subject: 'Did something go wrong?', text: textBody, html: htmlBody };
};

exports.abandonedCartStep2 = (data) => {
    const { user, cartUrl, product } = data; // product = main item image
    
    const textBody = `
Your bag is waiting, ${user.name}.

These pieces are popular and might sell out soon. 
Complete your order now to secure them.

${cartUrl}

Razia Store
    `.trim();

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><style>${getBaseStyles()}</style></head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e0e0e0;">
            <tr>
                <td class="header" style="background-color: #f8f8f8; color: #333; padding: 30px;">
                    <h1 style="margin:0; font-size: 20px;">Your bag is waiting</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 0;">
                     <img src="${product?.image_url ? (process.env.BACKEND_URL + product.image_url) : 'https://via.placeholder.com/600x300'}" width="100%" style="display:block;">
                </td>
            </tr>
            <tr>
                <td style="padding: 30px; text-align: center;">
                    <p>Don't miss out on your selection.</p>
                    <a href="${cartUrl}" class="btn">Secure Your Bag</a>
                </td>
            </tr>
        </table>
    </body>
    </html>`;

    return { subject: 'Your bag is waiting', text: textBody, html: htmlBody };
};

exports.abandonedCartStep3 = (data) => {
    const { user, cartUrl } = data;
    
    const textBody = `
Still thinking about it, ${user.name}?

Here is 5% OFF to help you decide.
Use Code: COMEBACK5

${cartUrl}

Offer expires in 24 hours.
    `.trim();

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><style>${getBaseStyles()}</style></head>
    <body>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e0e0e0;">
            <tr>
                <td class="header" style="background-color: #d4a017;">
                    <h1 style="margin:0; font-size: 24px;">Here is 5% OFF</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px; text-align: center;">
                    <p>Use code <strong>COMEBACK5</strong> at checkout.</p>
                    <a href="${cartUrl}" class="btn">Finish Your Order</a>
                </td>
            </tr>
        </table>
    </body>
    </html>`;

    return { subject: 'Here is 5% off to finish your order', text: textBody, html: htmlBody };
};
