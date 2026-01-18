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
app.set('trust proxy', 1); // Trust first proxy (Nginx/Heroku/Railway)
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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/refunds', require('./routes/refundRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes')); // Double check if this is /users/wishlist inside api.ts, but standard is /api/wishlist if route root is /
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// SEO Routes
const { generateSitemap } = require('./controllers/seoController');
app.get('/sitemap.xml', generateSitemap);

app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes')); // api.ts uses /users/addresses, so look into userRoutes for that, but mounting here just in case.

// Static Folder for Uploads
// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Static Files
// Production: Serve React Build from 'public' folder (copied by Dockerfile)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve Admin Panel (Legacy - check if folder exists)
  app.use('/admin-panel', express.static(path.join(__dirname, '../eBazer')));

  // Handle SPA Routing (Any route not API/Uploads -> index.html)
  app.get('*', (req, res) => {
    // Exclude API routes from this fallback just in case (though API routes are defined above)
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API Route not found' });
    }
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
} else {
  // Development: Serve Admin Panel at Root temporarily
  app.use(express.static(path.join(__dirname, '../eBazer')));

  app.get('/', (req, res) => {
    res.send('API is running (Development Mode)...');
  });
}

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
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => {
    // console.log replaced by logger
    const logger = require('./utils/logger');
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
