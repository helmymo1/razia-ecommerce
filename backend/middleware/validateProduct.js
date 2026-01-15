const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  
  // Custom validation for JSON strings
  body('colors').custom((value) => {
    if (!value) return true; // Optional
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error('Must be an array');
    } catch (e) {
      throw new Error('Colors must be a valid JSON string representing an array');
    }
    return true;
  }),
  
  body('sizes').custom((value) => {
    if (!value) return true; // Optional
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error('Must be an array');
    } catch (e) {
      throw new Error('Sizes must be a valid JSON string representing an array');
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateProduct;
