const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // Check Cookie (Primary)
  if (req.cookies && req.cookies.token) {
     token = req.cookies.token;
  }
  // Check Header (Fallback)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
     token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await db.query('SELECT id, first_name, last_name, email, role, phone, avatar_url, password_hash, personal_referral_code FROM users WHERE id = ?', [decoded.id]);
      
      if (rows.length === 0) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = rows[0];
      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired, please login again' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
