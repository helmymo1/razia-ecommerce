const config = require('./config/env');
const express = require('express');
const cors = require('cors');

// Security dependencies moved to securityConfig.js
const path = require('path');
const db = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load env vars
// Config loaded/validated via config/env.js

// Test Database Connection
const logger = require('./utils/logger');
db.query('SELECT 1')
  .then(() => logger.info('Connected to MySQL Database'))
  .catch(err => logger.error('Database connection failed: ' + err.message));

const morgan = require('morgan');

// Stream morgan logs into winston
const stream = {
  write: (message) => logger.info(message.trim()),
};

const app = express();

app.use(morgan('combined', { stream }));
const requestLogger = require('./middleware/requestLogger');

// Security Configuration
const { configureSecurity } = require('./middleware/securityConfig');
configureSecurity(app);

// Logging Middleware (Before Body Parser locally? No, before routes)
app.use(requestLogger);

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(require('cookie-parser')());

// Static Folder for Uploads
// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Static Files
// app.use(express.static(path.join(__dirname, '../eBazer'))); // Legacy HTML Template Config Removed

// Routes
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./modules/upload/uploadRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/products', require('./modules/products/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./modules/orders/orderRoutes'));
// app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/users', require('./modules/users/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
// const paymentRoutes = require('./routes/paymentRoutes');
// app.use('/api/payment', paymentRoutes);
app.use('/api/payment', require('./modules/payments/paymentRoutes')); // Unified Payment Routes
// app.use('/api/cart', require('./routes/cartRoutes'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/config', require('./modules/config/configRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health Check Endpoint (for Docker HEALTHCHECK)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Custom Error Handling for Multer and JSON Syntax
const multer = require('multer');

app.use((err, req, res, next) => {
  // Multer Error Handler
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }

  // JSON Syntax Error Handler
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON received:', err.message);
    return res.status(400).json({ message: 'Invalid JSON format' });
  }

  next(err);
});

// General Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Only start server if run directly (node server.js), not when imported by tests
if (require.main === module) {
  const http = require('http');
  const { Server } = require("socket.io");

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5174"
      ],
    }
  });

  const PORT = config.PORT || 5000;

  // Initialize Socket Service
  const { initSocketService } = require('./services/socketService');
  initSocketService(io);

  httpServer.listen(PORT, () => {
    // console.log replaced by logger
    const logger = require('./utils/logger');

    // Initialize Notification Service (Event Listener)
    const { initNotificationService } = require('./modules/notifications/notificationService');
    const { initInventoryService } = require('./modules/inventory/inventoryService');
    const { initOrderService } = require('./modules/orders/orderService');
    const { initShippingService } = require('./modules/shipping/shippingService');

    initNotificationService();
    initInventoryService();
    initOrderService();
    initShippingService();

    // Initialize Email Worker (Queue Consumer)
    const { initEmailWorker } = require('./workers/emailWorker');
    initEmailWorker();

    const { initAnalyticsService } = require('./modules/analytics/analyticsService');
    initAnalyticsService(); // Create table

    const { initConfigService } = require('./modules/config/configService');
    initConfigService();

    logger.info(`Server running on http://localhost:${PORT}`);
    console.log("⚠️ RATE LIMITING DISABLED FOR TESTING ⚠️");
    console.log("🔌 Socket.io Server active");
  });
}

module.exports = app;
