const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Constants
const QUEUE_NAME = 'email-queue';

/**
 * Configure Redis Connection
 * BullMQ requires a Redis connection. We use ioredis.
 */
const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Create Queue instance
const emailQueue = new Queue(QUEUE_NAME, { connection });

/**
 * Add an Email Job to the Queue
 * @param {string} type - 'welcome' | 'orderConfirmation' | 'passwordReset'
 * @param {object} payload - Data needed for the template (user, orderDetails, etc.)
 * @param {object} options - BullMQ options (delay, distinct, etc.)
 */
const addEmailJob = async (type, payload, options = {}) => {
  try {
    const job = await emailQueue.add(type, payload, {
      attempts: 3,         // Retry 3 times
      backoff: {
        type: 'exponential',
        delay: 5000,       // Wait 5s, then 10s, then 20s...
      },
      ...options
    });
    console.log(`🚀 Job added to email queue: ${type} (ID: ${job.id})`);
    return job;
  } catch (error) {
    console.error(`❌ Failed to add email job (${type}):`, error);
  }
};

/**
 * Update (Reset) Abandoned Cart Timer
 * Removes existing job for this cart and adds a new one.
 */
const updateAbandonedCartJob = async (cartId, payload) => {
    const jobId = `abandoned-cart-${cartId}`;
    try {
        const existingJob = await emailQueue.getJob(jobId);
        if (existingJob) {
            await existingJob.remove();
            // console.log(`🔄 Reset abandoned cart timer for Cart ${cartId}`);
        }
        
        await addEmailJob('abandonedCartStep1', { ...payload, cartId }, {
            jobId,
            delay: 1000 * 60 * 60 // 1 Hour
        });
    } catch (error) {
        console.error("Failed to update abandoned cart job:", error);
    }
};

module.exports = {
  emailQueue,
  addEmailJob,
  updateAbandonedCartJob,
  connection
};
