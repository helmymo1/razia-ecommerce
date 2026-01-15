const db = require('../config/db');

/**
 * Log an administrative action to the audit_logs table.
 * 
 * @param {number} adminId - The ID of the admin performing the action.
 * @param {string} action - The action being performed (e.g., 'CREATE_PRODUCT').
 * @param {number} targetId - The ID of the item being affected.
 * @param {Object} details - Additional details about the action (optional).
 */
const logAdminAction = async (adminId, action, targetId, details = {}) => {
  try {
    const detailsJson = JSON.stringify(details);
    await db.query(
      'INSERT INTO audit_logs (admin_id, action, target_id, details) VALUES (?, ?, ?, ?)',
      [adminId, action, targetId, detailsJson]
    );
    // console.log(`Audit Log: [${action}] by Admin ${adminId} on Target ${targetId}`);
  } catch (error) {
    console.error('Failed to write audit log:', error.message);
    // Silent fail to not disrupt main flow, but should be monitored
  }
};

module.exports = { logAdminAction };
