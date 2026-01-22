const NodeCache = require('node-cache');

// Cache for 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

const get = (key) => {
  const value = cache.get(key);
  if (value) {
      console.log(`⚡ [Cache] Hit: ${key}`);
      return value;
  }
  return null;
};

const set = (key, value) => {
  console.log(`💾 [Cache] Set: ${key}`);
  cache.set(key, value);
};

const flush = () => {
   // Clear cache when products change
   cache.flushAll();
   console.log("🧹 [Cache] Flushed");
};

module.exports = { get, set, flush };
