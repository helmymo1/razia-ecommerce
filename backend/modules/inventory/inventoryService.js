const bus = require('../../src/events/eventBus');
const db = require('../../config/db');

const initInventoryService = () => {
  console.log("📦 Inventory Service Listening...");

  bus.on('ORDER_PLACED', async (eventData) => {
    try {
      // eventData contains { id, user, total, items (maybe?) }
      // The current emitter in orderController sends: { id: orderId, user: user_id, totalPrice: calculatedTotalAmount }
      // It DOES NOT currently send 'items'. I need to fetch them or update the emitter.
      // Emitter update is safer/cleaner to avoid a DB read here, but fetching is more robust if the payload is small.
      // Let's check `orderController.js` again to see what is emitted.
      // It emits: bus.emit('ORDER_PLACED', { id: orderId, user: user_id, totalPrice: calculatedTotalAmount });
      // It does NOT send items. 
      // I should update the emitter in orderController to include items, or fetch them here.
      // Updating the emitter is better for the "Event Carries State" pattern.
      
      // Wait, I am the one writing this file right now.
      // I will assume I will update the controller to pass `items` or I fetch them.
      // The user instructions said: "Loop through order items and update DB".
      // Let's Query the items here to be safe and "decoupled" (Listener fetches what it needs if not provided, or better yet, I'll update the controller to pass them).
      // Actually, to strictly follow the prompt "Update orders module to EMIT events" (done previously), 
      // I should probably inspect the orderController again.
      // The prompt for THIS task says "Loop through order items".
      // I will update the controller to emit `items` as well.
      
      const { id, items } = eventData;
      console.log(`📉 [Inventory] Reserving stock for Order ${id}...`);

      if (!items || items.length === 0) {
          console.warn("⚠️ [Inventory] No items provided in event.");
          return;
      }

      for (const item of items) {
        // item structure from controller: { product_id, quantity, ... }
        
        // SQL Update
        await db.query(
            'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
            [item.quantity, item.product_id]
        );
        
        console.log(`   ✅ Stock updated for Product ${item.product_id}: -${item.quantity}`);
      }

    } catch (error) {
      console.error("❌ [Inventory] Failed to update stock:", error);
      // In a real system, trigger compensation (saga)
    }
  });
};

module.exports = { initInventoryService };
