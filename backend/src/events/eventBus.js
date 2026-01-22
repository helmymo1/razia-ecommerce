const EventEmitter = require('events');
class EventBus extends EventEmitter {}
const bus = new EventBus();
console.log("🚌 Event Bus Initialized");
module.exports = bus;
