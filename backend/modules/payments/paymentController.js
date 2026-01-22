const bus = require('../../src/events/eventBus');

// This mimics receiving a success signal from Paymob or another provider
const handlePaymentWebhook = async (req, res) => {
  const { orderId, success, transactionId } = req.body; // Simplified for demo
  
  // Basic validation
  if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
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
};

module.exports = { handlePaymentWebhook };
