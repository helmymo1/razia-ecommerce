const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // 1. Write all errors to error.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error' 
    }),
    // 2. Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    }),
  ],
});

// If we're not in production, also log to the console with colors
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    ),
  }));
}

module.exports = logger;
