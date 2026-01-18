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
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://*.paymob.com", "https://*.googleapis.com"],
        framesrc: ["'self'", "https://*.paymob.com"],
        connectSrc: ["'self'", "https://*.paymob.com"],
        imgSrc: ["'self'", "data:", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline needed for some UI libs if not nonce-based
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // 2. GZIP Compression
  app.use(compression());

  // 3. CORS
  // 3. CORS
  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
      // Localhost fallback for development
      if (process.env.NODE_ENV !== 'production' || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  app.use(cors(corsOptions));
};

module.exports = { configureSecurity, publicLimiter, authLimiter, transactionLimiter };
