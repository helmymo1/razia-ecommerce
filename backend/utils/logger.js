const winston = require('winston');
const path = require('path');

// Logs directory
const logDir = path.join(__dirname, '../logs');

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Print stack trace
    winston.format.json()
  ),
  defaultMeta: { service: 'ebazer-backend' },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //
    new winston.transports.File({ 
        filename: path.join(logDir, 'error.log'), 
        level: 'error' 
    }),
    new winston.transports.File({ 
        filename: path.join(logDir, 'combined.log') 
    }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        logFormat
    )
  }));
}

module.exports = logger;
