const Joi = require('joi');

/**
 * Generic Validation Middleware
 * @param {Joi.ObjectSchema} schema - Joi Schema to validate against
 * @param {string} property - Request property to validate (body, query, params)
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields (Security against mass assignment)
      errors: {
        wrap: {
          label: ''
        }
      }
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      console.error('❌ Validation Error:', message, 'Sent:', req[property]);
      return res.status(400).json({ 
        message: `Validation Error: ${message}` 
      });
    }

    // Replace request data with validated (and stripped) data
    req[property] = value;
    next();
  };
};

module.exports = validateRequest;
