const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // Check Cookie (Primary)
  if (req.cookies && req.cookies.token) {
     token = req.cookies.token;
  }
  // Check Header (Fallback)
  else if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.headers.authorization;
    }
  }

  if (token) {
    try {
      console.log("🔍 [Auth] Token Received:", token.substring(0, 10) + "...");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ [Auth] Token Verified. User ID:", decoded.id);

      const [rows] = await db.query('SELECT id, first_name, last_name, email, role, password_hash FROM users WHERE id = ?', [decoded.id]);
      
      if (rows.length === 0) {
        console.error("❌ [Auth] User not found in DB for ID:", decoded.id);
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = rows[0];
      next();
    } catch (error) {
      console.error("❌ [Auth] Failed:", error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired, please login again' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error("🚫 [Auth] No Token found in Cookie or Header");
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
