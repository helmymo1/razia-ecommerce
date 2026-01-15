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

const app = express();
const requestLogger = require('./middleware/requestLogger');

// Security Configuration
const { configureSecurity } = require('./middleware/securityConfig');
configureSecurity(app);

// Logging Middleware (Before Body Parser locally? No, before routes)
app.use(requestLogger);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cookie-parser')());

// Static Folder for Uploads
// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../eBazer')));

// Routes
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
// app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);
// app.use('/api/cart', require('./routes/cartRoutes'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Only start server if run directly (node server.js), not when imported by tests
if (require.main === module) {
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => {
    // console.log replaced by logger
    const logger = require('./utils/logger');
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
