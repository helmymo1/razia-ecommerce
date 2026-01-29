const configService = require('./configService');

// @desc    Get Outfit Builder settings
// @route   GET /api/config/outfit
// @access  Public
const getOutfitConfig = async (req, res, next) => {
  try {
    const rules = await configService.getConfig('outfit_builder_discounts');
    res.json(rules || {});
  } catch (error) {
    next(error);
  }
};

// @desc    Update Outfit Builder settings
// @route   PUT /api/config/outfit
// @access  Private/Admin
const updateOutfitConfig = async (req, res, next) => {
  try {
    const { tier_2, tier_3, tier_4, tier_5 } = req.body;
    
    // Simple validation
    if (tier_2 === undefined) {
      return res.status(400).json({ message: "Missing discount configuration" });
    }

    const newRules = {
      tier_2: Number(tier_2),
      tier_3: Number(tier_3),
      tier_4: Number(tier_4),
      tier_5: Number(tier_5) // This will be the 5+ or 6+ tier depending on frontend logic, let's store granular if possible
    };

    await configService.setConfig('outfit_builder_discounts', newRules);
    res.json(newRules);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOutfitConfig,
  updateOutfitConfig
};
