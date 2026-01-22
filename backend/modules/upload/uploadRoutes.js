const express = require('express');
const router = express.Router();
const upload = require('../../middleware/uploadMiddleware');
const { protect, admin } = require('../../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Return path relative to server root, intended for static serving
  // e.g., /uploads/image-123456789.jpg
  res.json({
    message: 'Image uploaded',
    imageUrl: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
