const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const { emailQueue, connection } = require('../queues/emailQueue');
const templates = require('../services/emailTemplates');

// Reuse existing transporter logic (or import from config)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const QUEUE_NAME = 'email-queue';

const { addEmailJob } = require('../queues/emailQueue');
const db = require('../config/db'); // Needed for "Stop if Paid" check

/**
 * Check if user has purchased RECENTLY (since the flow started)
 * Or generally "Is there a new order?"
 * Simple check: Has user made ANY order in the last 48 hours?
 */
const hasRecentOrder = async (userId) => {
    const [rows] = await db.query(
        'SELECT id FROM orders WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 3 DAY)', 
        [userId]
    );
    return rows.length > 0;
};

/**
 * Process a single email job
 */
const emailProcessor = async (job) => {
    const { name, data } = job;
    console.log(`📧 Processing email job: ${name} (ID: ${job.id})`);

    // STOP IF PAID CHECK for Abandoned Cart Flow
    if (name.startsWith('abandonedCart')) {
        if (!data.user || !data.user.id) {
             console.warn(`Job ${job.id} content warning: Missing user ID for paid check.`);
        } else {
             const paid = await hasRecentOrder(data.user.id);
             if (paid) {
                 console.log(`🛑 Stopping Abandoned Cart Flow for User ${data.user.id} - Order Found!`);
                 return; // Exit without sending
             }
        }
    }

    try {
        let emailContent = null;

        // 1. Generate Content
        switch (name) {
            case 'orderConfirmation':
                emailContent = templates.orderConfirmation(data);
                break;
            case 'welcomeStep1':
                emailContent = templates.welcomeStep1(data);
                // Schedule Step 2 (48h)
                await addEmailJob('welcomeStep2', data, {
                    delay: 1000 * 60 * 60 * 48,
                    jobId: `welcome-step2-${data.user.email}-${Date.now()}`
                });
                break;
            case 'welcomeStep2':
                emailContent = templates.welcomeStep2(data);
                // Schedule Step 3 (48h)
                await addEmailJob('welcomeStep3', data, {
                    delay: 1000 * 60 * 60 * 48,
                    jobId: `welcome-step3-${data.user.email}-${Date.now()}`
                });
                break;
            case 'welcomeStep3':
                emailContent = templates.welcomeStep3(data);
                break;
            case 'abandonedCartStep1':
                emailContent = templates.abandonedCartStep1(data);
                // Schedule Step 2 (24h)
                await addEmailJob('abandonedCartStep2', data, { 
                    delay: 1000 * 60 * 60 * 24, // 24 Hours
                    jobId: `aband-step2-${data.cartId}-${Date.now()}` // Unique ID
                });
                break;
            case 'abandonedCartStep2':
                emailContent = templates.abandonedCartStep2(data);
                 // Schedule Step 3 (48h from start, i.e. 24h from now)
                await addEmailJob('abandonedCartStep3', data, { 
                    delay: 1000 * 60 * 60 * 24, 
                    jobId: `aband-step3-${data.cartId}-${Date.now()}`
                });
                break;
            case 'abandonedCartStep3':
                emailContent = templates.abandonedCartStep3(data);
                break;
            case 'passwordReset':
                emailContent = templates.passwordReset(data);
                break;
            default:
                throw new Error(`Unknown email job type: ${name}`);
        }

        // 2. Validate Content (if stopped flow, we returned earlier)
        if (!emailContent || !data.userEmail) {
            throw new Error(`Invalid email content or missing recipient for job ${name}`);
        }

        // 3. Send Email (Twin-Body)
        const mailOptions = {
            from: `"Razia Store" <${process.env.EMAIL_USER}>`,
            to: data.userEmail,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${data.userEmail} (MsgID: ${info.messageId})`);
        
        return info;

    } catch (error) {
        console.error(`❌ Job ${job.id} failed:`, error.message);
        throw error; // Let BullMQ handle retries
    }
};

/**
 * Initialize Worker
 */
const initEmailWorker = () => {
    const worker = new Worker(QUEUE_NAME, emailProcessor, { 
        connection,
        concurrency: 5 // Process 5 emails in parallel
    });

    worker.on('completed', (job) => {
        // console.log(`Job ${job.id} completed!`);
    });

    worker.on('failed', (job, err) => {
        console.error(`Job ${job.id} has failed with ${err.message}`);
    });

    console.log(`👷 Email Worker initialized for queue: ${QUEUE_NAME}`);
    return worker;
};

module.exports = { initEmailWorker };
