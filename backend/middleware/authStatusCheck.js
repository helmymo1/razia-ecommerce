const db = require('../config/db');

const authStatusCheck = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
             return res.status(401).json({ message: 'Not authorized' });
        }

        const [rows] = await db.query('SELECT is_deleted, role FROM users WHERE id = ?', [req.user.id]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = rows[0];

        if (user.is_deleted === 1) {
            return res.status(403).json({ message: 'Account Deactivated' });
        }

        // Optional: Route specific role checks can go here or remain in 'admin' middleware
        
        next();
    } catch (error) {
        console.error('Auth Status Check Error:', error);
        res.status(500).json({ message: 'Server error during auth check' });
    }
};

module.exports = authStatusCheck;
