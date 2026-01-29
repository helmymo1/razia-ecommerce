const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
// Checking path: root/backend/middleware/uploadMiddleware.js exists (found in Step 179)
// But wait, step 179 says `middleware/uploadMiddleware.js` exists.
// Routes are in `backend/routes/`. So `../middleware/uploadMiddleware` is correct.

router.route('/')
    .get(getCategories)
    .post(protect, admin, upload.single('image'), createCategory);

router.route('/:id')
    .put(protect, admin, upload.single('image'), updateCategory)
    .delete(protect, admin, deleteCategory);

module.exports = router;
