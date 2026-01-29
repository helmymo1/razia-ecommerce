const express = require('express');
const router = express.Router();
const { getOutfitConfig, updateOutfitConfig } = require('./configController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.route('/outfit')
  .get(getOutfitConfig)
  .put(protect, admin, updateOutfitConfig);

module.exports = router;
