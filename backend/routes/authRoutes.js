const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, googleLogin, appleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const { authSchemas } = require('../middleware/schemas');
const { authLimiter } = require('../middleware/securityConfig');

// Register User
router.post('/register', validate(authSchemas.register), register);

// Login User
router.post('/login', validate(authSchemas.login), login);

// OAuth Login - Google
router.post('/google', googleLogin);

// OAuth Login - Apple
router.post('/apple', appleLogin);

// Verify Session (Get Current User)
router.get('/me', protect, getMe);

// Logout User
router.post('/logout', logout);

module.exports = router;
