
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [wishlistItems] = await db.query(`
      SELECT w.id, w.product_id, w.created_at,
             p.name_en, p.price, pi.image_url
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);

    res.status(200).json(wishlistItems);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist item (Add/Remove)
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res, next) => {
  const { product_id } = req.body;
  const userId = req.user.id;

  if (!product_id) {
    res.status(400);
    return next(new Error('Product ID is required'));
  }

  try {
    // Check if item exists
    const [exists] = await db.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (exists.length > 0) {
      // Remove
      await db.query('DELETE FROM wishlists WHERE id = ?', [exists[0].id]);
      return res.status(200).json({ message: 'Removed from wishlist', action: 'removed' });
    } else {
      // Add
      const id = uuidv4();
      await db.query(
        'INSERT INTO wishlists (id, user_id, product_id) VALUES (?, ?, ?)',
        [id, userId, product_id]
      );
      return res.status(201).json({ message: 'Added to wishlist', action: 'added' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
