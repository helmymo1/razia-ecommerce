const io = require('socket.io-client');

// Connect to the backend
const socket = io("http://localhost:5006");

console.log("🎧 Connecting to Socket Server...");

socket.on("connect", () => {
    console.log("✅ Connected to Backend Socket!");
    console.log("⏳ Waiting for Order Updates...");
});

socket.on("order_update", (data) => {
    console.log("\n🔔 RECEIVED SOCKET EVENT:");
    console.log("   Message:", data.message);
    console.log("   Status:", data.status);
    console.log("   Details:", JSON.stringify(data, null, 2));
    
    if (data.status === 'delivered') {
        console.log("🎉 Verification Complete: Full Cycle (Paid -> Shipped -> Delivered -> Socket Notification)");
        process.exit(0);
    }
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected");
});
