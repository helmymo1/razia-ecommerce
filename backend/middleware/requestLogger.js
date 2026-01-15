const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    // Log when the request finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        
        const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip}`;

        if (statusCode >= 400) {
            // Log 4xx and 5xx as warn/error? usage context matters.
            // keeping it info for general traffic, but could be warn.
            // Let's use 'warn' for 4xx/5xx to distinguish in logs.
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    next();
};

module.exports = requestLogger;
