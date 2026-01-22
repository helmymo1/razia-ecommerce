const bus = require('../../src/events/eventBus');

const initNotificationService = () => {
  console.log("🔔 Notification Service Listening...");

  // Listen for the specific event
  bus.on('ORDER_PLACED', (order) => {
    // Determine properties based on what's available (DB Schema vs Object)
    const orderId = order.id || order._id;
    const userId = order.user_id || order.user;
    const total = order.total || order.totalPrice;

    console.log(`📨 [Notification Service] Sending confirmation email for Order #${orderId}`);
    console.log(`   -> To User ID: ${userId}`);
    console.log(`   -> Total Amount: $${total}`);
    // Future: Add actual email logic here (SendGrid/Nodemailer)
  });
};

module.exports = { initNotificationService };
