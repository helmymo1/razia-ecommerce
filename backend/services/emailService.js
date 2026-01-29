const { addEmailJob } = require('../queues/emailQueue');
const logger = require('../utils/logger'); // Assuming logger exists

/**
 * Send Queue-based Order Confirmation
 */
exports.sendOrderConfirmation = async (userEmail, orderDetails, items) => {
    try {
        await addEmailJob('orderConfirmation', {
            userEmail,
            orderDetails,
            items,
            user: { name: orderDetails.user_full_name || 'Customer' }
        });
        logger.info(`Queued Order Confirmation for ${userEmail}`);
    } catch (error) {
        logger.error(`Failed to queue order confirmation: ${error.message}`);
    }
};

/**
 * Send Queue-based Welcome Email
 */
exports.sendWelcomeEmail = async (user) => {
    try {
        await addEmailJob('welcome', {
            userEmail: user.email,
            user: { name: user.name }
        });
        logger.info(`Queued Welcome Email for ${user.email}`);
    } catch (error) {
        logger.error(`Failed to queue welcome email: ${error.message}`);
    }
};

