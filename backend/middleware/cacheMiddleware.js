const redis = require('../config/redis');

/**
 * Cache Middleware
 * @param {string} keyPrefix - Prefix for the cache key (e.g., 'products')
 * @param {number} ttl - Time to live in seconds (default: 3600 aka 1 hour)
 */
const cache = (keyPrefix, ttl = 3600) => async (req, res, next) => {
    // Skip caching for non-GET methods
    if (req.method !== 'GET') {
        return next();
    }

    // Construct Key: prefix:full_url_query
    // e.g., products:search=term&category=1
    const key = `${keyPrefix}:${JSON.stringify(req.query)}`;

    try {
        const cachedData = await redis.get(key);
        
        if (cachedData) {
            // Hit!
            return res.json(JSON.parse(cachedData));
        }

        // Miss - Intercept Response to Store it
        const originalSend = res.json;
        res.json = (body) => {
            // Store in Redis (Async - don't block response)
            redis.setex(key, ttl, JSON.stringify(body));
            
            // Send original response
            originalSend.call(res, body);
        };

        next();
    } catch (error) {
        // If middleware fails, just proceed to DB
        console.error('Cache Middleware Error:', error);
        next();
    }
};

module.exports = cache;
