const bus = require('../../src/events/eventBus');

// This mimics receiving a success signal from Paymob or another provider
// This mimics receiving a success signal from Paymob or another provider
const handlePaymentWebhook = async (req, res) => {
    try {
        const fs = require('fs');
        const logMsg = `\n[${new Date().toISOString()}] WEBHOOK RECEIVED:\nHEADER: ${JSON.stringify(req.headers)}\nBODY: ${JSON.stringify(req.body, null, 2)}\nQUERY: ${JSON.stringify(req.query)}\n`;
        try { fs.appendFileSync('payment_webhook.log', logMsg); } catch (e) { }

        const { obj, type } = req.body;
        let orderId = null;
        let success = false;
        let transactionId = null;

        // 1. Paymob Standard Structure
        if (obj) {
            success = obj.success === true;
            transactionId = obj.id;

            // Extract Order ID
            // Strategy: 
            // 1. obj.order.merchant_order_id (if mapped)
            // 2. obj.data.metadata.order_reference (if we sent it in extras)
            // 3. req.query.id (if passed in callback url)

            if (obj.order && obj.order.merchant_order_id) {
                orderId = obj.order.merchant_order_id;
            }

            // Check Metadata/Extras (Billing Data often has it if allowed)
            // Note: Paymob 'extras' might be flattened in 'data' or 'billing_data' depending on integration type.
            // Let's assume standard object structure first.
        }
        // 2. Fallback / Test Structure
        else if (req.body.orderId) {
            orderId = req.body.orderId;
            success = req.body.success;
            transactionId = req.body.transactionId;
        }

        // 3. Query Param Fallback
        if (!orderId && req.query.orderId) {
            orderId = req.query.orderId;
        }
        if (!orderId && req.query.id) {
            orderId = req.query.id;
        }

      if (!orderId) {
        console.warn("⚠️ Webhook received but no Order ID found.");
        return res.status(200).send(); // Acknowledge anyway
    }

      if (success) {
          console.log(`💳 [Payment Service] Payment Captured for Order ${orderId}`);
        // 📢 EMIT THE EVENT
        bus.emit('PAYMENT_CONFIRMED', { orderId, transactionId });
        res.status(200).json({ message: 'Webhook Received: Payment Confirmed' });
    } else {
        console.log(`❌ [Payment Service] Payment Failed for Order ${orderId}`);
        bus.emit('PAYMENT_FAILED', { orderId });
        res.status(200).json({ message: 'Webhook Received: Payment Failed' });
      }
  } catch (error) {
      console.error("❌ Webhook Error:", error);
      res.status(500).send();
  }
};

module.exports = { handlePaymentWebhook };
