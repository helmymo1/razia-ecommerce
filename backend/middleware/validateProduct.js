const { body, validationResult } = require('express-validator');

const validateProduct = [
  // Allow name OR nameEn
  body('name').optional(),
  body('nameEn').optional(),
  body().custom((value, { req }) => {
    if (!req.body.name && !req.body.nameEn) {
      throw new Error('Product name (name or nameEn) is required');
    }
    return true;
  }),

  body('sku').trim().notEmpty().withMessage('SKU is required'),

  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  // Allow quantity OR stock
  body('quantity').optional(),
  body('stock').optional(),
  body().custom((value, { req }) => {
    const qty = req.body.quantity !== undefined ? req.body.quantity : req.body.stock;
    if (qty === undefined || qty === null || isNaN(qty) || qty < 0) {
      // It's acceptable to have 0 stock, so just check if it's a valid number >= 0 if provided? 
      // Actually current check requires strict int. 
      // Let's just check if EITHER is present and valid if we want to enforce it.
      // If "quantity" is expected to be mandatory:
      throw new Error('Quantity/Stock must be a non-negative integer');
    }
    return true;
  }),

  // Custom validation for JSON strings or Arrays
  body('colors').custom((value) => {
    if (!value) return true;
    if (Array.isArray(value)) return true; // Allow actual array
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error('Must be an array');
    } catch (e) {
      throw new Error('Colors must be a valid JSON string or Array');
    }
    return true;
  }),
  
  body('sizes').custom((value) => {
    if (!value) return true;
    if (Array.isArray(value)) return true; 
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error('Must be an array');
    } catch (e) {
      throw new Error('Sizes must be a valid JSON string or Array');
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
