const axios = require('axios');

// CRITICAL: KSA Base URL
const BASE_URL = 'https://ksa.paymob.com/api'; 

const initiatePayment = async (user, totalAmount, items, merchantOrderId) => {
    try {
        // 1. AUTHENTICATION
        const authRes = await axios.post(`${BASE_URL}/auth/tokens`, {
            api_key: process.env.PAYMOB_API_KEY
        });
        const token = authRes.data.token;

        // 2. ORDER REGISTRATION
        const orderRes = await axios.post(`${BASE_URL}/ecommerce/orders`, {
            auth_token: token,
            delivery_needed: "false",
            amount_cents: Math.round(totalAmount * 100), // Ensure integer
            currency: "SAR", // KSA Currency
            items: items, // [{name: "Item", amount_cents: 1000, quantity: 1}]
            merchant_order_id: merchantOrderId // Link to our internal DB Order
        });
        const orderId = orderRes.data.id;

        // 3. PAYMENT KEY REQUEST
        const billingData = {
            "apartment": "NA",
            "email": user.email,
            "floor": "NA",
            "first_name": user.name.split(' ')[0] || "Guest",
            "street": user.address || "Riyadh St",
            "building": "NA",
            "phone_number": formatKSAPhone(user.phone), // Helper to ensure +966
            "shipping_method": "NA",
            "postal_code": user.zip || "12345",
            "city": user.city || "Riyadh",
            "country": "SA", // KSA Country Code
            "last_name": user.name.split(' ')[1] || "User",
            "state": "Riyadh"
        };

        console.log("PAYMENT PAYLOAD DEBUG:", JSON.stringify({
            amount_cents: Math.round(totalAmount * 100),
            currency: "SAR",
            billing_data: billingData
        }, null, 2));

        const keyRes = await axios.post(`${BASE_URL}/acceptance/payment_keys`, {
            auth_token: token,
            amount_cents: Math.round(totalAmount * 100),
            expiration: 3600,
            order_id: orderId,
            billing_data: billingData,
            currency: "SAR",
            integration_id: process.env.PAYMOB_INTEGRATION_ID
        });

        return { 
            payment_key: keyRes.data.token,
            iframe_url: `https://ksa.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${keyRes.data.token}`
        };

    } catch (error) {
        console.error("Paymob KSA Error:", error.response?.data || error.message);
        throw new Error("Payment Gateway Rejected: " + JSON.stringify(error.response?.data || error.message));
    }
};

// Helper to fix phone numbers
function formatKSAPhone(phone) {
    if (!phone) return "+966500000000";
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('05')) p = '966' + p.substring(1);
    if (!p.startsWith('966')) p = '966' + p;
    return '+' + p;
}

module.exports = { initiatePayment };
