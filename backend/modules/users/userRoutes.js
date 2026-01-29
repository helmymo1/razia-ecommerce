const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, updateUserProfile, updatePassword, getWishlist, toggleWishlist } = require('./userController');
const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../../controllers/addressController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.get('/', getUsers);
router.put('/profile', protect, require('../../middleware/authStatusCheck'), updateUserProfile);
router.put('/password', protect, require('../../middleware/authStatusCheck'), updatePassword);

// Wishlist
router.get('/wishlist', protect, require('../../middleware/authStatusCheck'), getWishlist);
router.put('/wishlist', protect, require('../../middleware/authStatusCheck'), toggleWishlist);

// Addresses
router.get('/addresses', protect, require('../../middleware/authStatusCheck'), getAddresses);
router.post('/addresses', protect, require('../../middleware/authStatusCheck'), addAddress);
router.put('/addresses/:id', protect, require('../../middleware/authStatusCheck'), updateAddress);
router.delete('/addresses/:id', protect, require('../../middleware/authStatusCheck'), deleteAddress);
router.post('/', protect, admin, require('../../middleware/authStatusCheck'), createUser);
router.put('/:id', protect, admin, require('../../middleware/authStatusCheck'), updateUser);
router.delete('/:id', protect, admin, require('../../middleware/authStatusCheck'), deleteUser);

module.exports = router;
