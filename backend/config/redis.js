const Redis = require('ioredis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true, // Don't crash instantly if not connected
    retryStrategy: (times) => {
        // Stop retrying after 3 attempts to avoid log spam if service isn't there
        if (times > 3) {
            return null;
        }
        return Math.min(times * 50, 2000);
    }
});

// Graceful Degradation Wrapper
const redisWrapper = {
    get: async (key) => {
        try {
            if (redisClient.status !== 'ready') return null;
            return await redisClient.get(key);
        } catch (err) {
            console.warn('Redis Get Error:', err.message);
            return null; // Fallback to DB
        }
    },
    setex: async (key, seconds, value) => {
        try {
            if (redisClient.status !== 'ready') return;
            await redisClient.setex(key, seconds, value);
        } catch (err) {
            console.warn('Redis Set Error:', err.message);
        }
    },
    del: async (key) => {
        try {
            if (redisClient.status !== 'ready') return;
            await redisClient.del(key);
        } catch (err) {
            console.warn('Redis Del Error:', err.message);
        }
    },
    // Scan/Keys invalidation helper
    clearPattern: async (pattern) => {
        try {
           if (redisClient.status !== 'ready') return;
           const stream = redisClient.scanStream({ match: pattern });
           stream.on('data', (keys) => {
               if (keys.length) {
                   const pipeline = redisClient.pipeline();
                   keys.forEach(key => pipeline.del(key));
                   pipeline.exec();
               }
           });
        } catch (err) {
            console.warn('Redis Clear Error:', err.message);
        }
    },
    decrby: async (key, amount) => {
        try {
            if (redisClient.status !== 'ready') throw new Error('Redis not ready');
            return await redisClient.decrby(key, amount);
        } catch (err) {
            console.warn('Redis Decr Error:', err.message);
            throw err; // Re-throw to let controller handle "Out of Stock" or "System Error"
        }
    },
    incrby: async (key, amount) => {
        try {
            if (redisClient.status !== 'ready') return;
            await redisClient.incrby(key, amount);
        } catch (err) {
            console.warn('Redis Incr Error:', err.message);
        }
    },
    client: redisClient
};

// Handle connection events
redisClient.on('error', (err) => {
    // Silence valid connection errors if cache is optional
    if (process.env.NODE_ENV !== 'test') {
        // console.error('Redis Client Error:', err.message); 
    }
});

// Try connecting once - non-blocking
redisClient.connect().catch(() => {
    console.log('Redis Cache: Disabled (Service Unavailable)');
});

module.exports = redisWrapper;
