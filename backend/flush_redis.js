
require('dotenv').config();
const Redis = require('ioredis');

const flushCache = async () => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  });

  try {
    await redis.flushall();
    console.log('✅ Redis Cache Flushed Successfully');
  } catch (error) {
    console.error('Error flushing redis:', error);
  } finally {
    redis.disconnect();
  }
};

flushCache();
