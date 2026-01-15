const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log to file
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}\nStack: ${err.stack}\n\n`;
  const logFile = path.join(__dirname, '../../logs.md');
  
  fs.appendFile(logFile, logMessage, (fileErr) => {
      if (fileErr) console.error('Failed to write to log file:', fileErr);
  });

  console.error(err.stack); // Keep console logging for dev

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
