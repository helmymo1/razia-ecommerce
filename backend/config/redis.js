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
    // Scan/Keys invalidation helper - properly awaits completion
    clearPattern: async (pattern) => {
        try {
           if (redisClient.status !== 'ready') return;

            return new Promise((resolve, reject) => {
               const stream = redisClient.scanStream({ match: pattern });
               const deletionPromises = [];

               stream.on('data', (keys) => {
                   if (keys.length) {
                       const pipeline = redisClient.pipeline();
                       keys.forEach(key => pipeline.del(key));
                       deletionPromises.push(pipeline.exec());
                   }
               });

               stream.on('end', async () => {
                   await Promise.all(deletionPromises);
                   resolve();
               });

               stream.on('error', (err) => {
                   console.warn('Redis Clear Stream Error:', err.message);
                   resolve(); // Don't reject, graceful degradation
               });
           });
        } catch (err) {
            console.warn('Redis Clear Error:', err.message);
        }
    },
    decrby: async (key, amount) => {
        try {
            if (redisClient.status !== 'ready') return null; // Graceful fallback
            return await redisClient.decrby(key, amount);
        } catch (err) {
            console.warn('Redis Decr Error:', err.message);
            // Don't throw, let controller assume stock check passed or handle it via DB
            return null;
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
