const bus = require('../../src/events/eventBus');

const initShippingService = () => {
  console.log("🚚 Shipping Service Listening...");

  bus.on('PAYMENT_CONFIRMED', async ({ orderId }) => {
    console.log(`📦 [Shipping] Payment confirmed for Order ${orderId}. Preparing shipment...`);
    
    // In a real app, we would Create Shipment Record here e.g. await Shipping.create(...)
    // For now, we simulate the logistics flow with delays

    // 1. Simulate Logistics Delay (Packing)
    setTimeout(() => {
       console.log(`🚚 [Shipping] Order ${orderId} has been SHIPPED.`);
       bus.emit('ORDER_SHIPPED', { orderId, trackingNumber: 'TRACK-' + Math.floor(Math.random() * 100000) });
    }, 5000); // 5 seconds

    // 2. Simulate Delivery
    setTimeout(() => {
       console.log(`📍 [Shipping] Order ${orderId} has been DELIVERED.`);
       bus.emit('ORDER_DELIVERED', { orderId, deliveredAt: new Date() });
    }, 10000); // 10 seconds
  });
};

module.exports = { initShippingService };
