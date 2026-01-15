const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const addressController = require('../controllers/addressController');

router.get('/', protect, addressController.getAddresses);
router.post('/', protect, addressController.addAddress);
router.put('/:id', protect, addressController.updateAddress);
router.delete('/:id', protect, addressController.deleteAddress);

module.exports = router;
