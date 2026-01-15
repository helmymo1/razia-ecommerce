const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');

// 4. Rate Limiting Definitions

// Public Zone: 500 requests per 15 mins (Products, Categories)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many public requests, please try again later' }
});

// Auth Zone: 10 requests per 15 mins (Login, Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

// Transaction Zone: 30 requests per 1 hour (Orders)
const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Transaction limit reached, please try again later' }
});

/**
 * Configure Security Middleware
 * @param {import('express').Application} app 
 */
const configureSecurity = (app) => {
  // 1. Secure HTTP Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled to allow inline scripts/styles in this template
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // 2. GZIP Compression
  app.use(compression());

  // 3. CORS
  // 3. CORS
  app.use(cors({
      origin: true,
      credentials: true
  }));
};

module.exports = { configureSecurity, publicLimiter, authLimiter, transactionLimiter };
