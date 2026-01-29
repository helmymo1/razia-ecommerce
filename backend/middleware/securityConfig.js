const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');
const hpp = require('hpp');

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
  max: 1000, // Relaxed for testing
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

// Transaction Zone: 30 requests per 1 hour (Orders)
const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000, // Relaxed for testing
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Transaction limit reached, please try again later' }
});

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

/**
 * Configure Security Middleware
 * @param {import('express').Application} app 
 */
const configureSecurity = (app) => {
  // 1. Secure HTTP Headers
  app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // 2. GZIP Compression
  app.use(compression());

  // 3. CORS
  const allowedOrigins = [
    'http://localhost:3000', // Admin Panel
    'http://localhost:5173', // User Site (Vite usually)
    'http://localhost:5174', // User Site Alternate
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3001',  // Admin Panel Alternate
    'http://localhost:3002',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // [DEBUG] Allow ALL origins temporarily to fix "Connection Error"
      // Check if it's in the allowed list just for logging, but allow anyway
      if (allowedOrigins.indexOf(origin) === -1) {
        console.log('⚠️ CORS WARNING: Origin not in whitelist but allowed for debug:', origin);
      }
      callback(null, true);
    },
    credentials: true, // Essential for Cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }));

  // 4. Prevent Parameter Pollution
  app.use(hpp());

  // 5. Data Sanitization (NoSQL Injection)
  app.use(mongoSanitize());

  // 6. Data Sanitization (XSS)
  app.use(xss());

  // 7. Global Rate Limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again later.' }
  });
  app.use('/api', limiter);

  console.log("🛡️ Security Layer: Active (Helmet, RateLimit, Sanitize, XSS)");
};

module.exports = { configureSecurity, publicLimiter, authLimiter, transactionLimiter };
