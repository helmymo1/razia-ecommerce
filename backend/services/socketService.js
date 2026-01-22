const bus = require('../src/events/eventBus');

const initSocketService = (io) => {
  console.log("🔌 Socket Service Initialized");
  
  // When internal bus says "Shipped", tell the frontend
  bus.on('ORDER_SHIPPED', (data) => {
    console.log("📡 Emitting Socket Event: order_update (SHIPPED)");
    io.emit('order_update', { message: `Order #${data.orderId.slice(0,8)}... has been SHIPPED!`, status: 'shipped', ...data });
  });

  bus.on('ORDER_DELIVERED', (data) => {
    console.log("📡 Emitting Socket Event: order_update (DELIVERED)");
    io.emit('order_update', { message: `Order #${data.orderId.slice(0,8)}... has been DELIVERED!`, status: 'delivered', ...data });
  });
};

module.exports = { initSocketService };
