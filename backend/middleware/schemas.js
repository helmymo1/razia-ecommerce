const Joi = require('joi');

const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow('').optional(),
    price: Joi.number().min(0).required(),
    sku: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required(),
    category: Joi.string().required(), // UUID
    sub_category: Joi.any().optional(),
    tags: Joi.string().allow('').optional(),
    status: Joi.string().valid('active', 'inactive', 'scheduled').default('active'),
    
    // Extra fields
    discount_type: Joi.string().valid('no_discount', 'percentage', 'fixed').default('no_discount'),
    discount_value: Joi.number().min(0).default(0),
    shipping_width: Joi.number().min(0).optional(),
    shipping_height: Joi.number().min(0).optional(),
    shipping_weight: Joi.number().min(0).optional(),
    shipping_cost: Joi.number().min(0).optional(),
    colors: Joi.any().optional(), // Can be string or array
    sizes: Joi.any().optional()
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().allow('').optional(),
    price: Joi.number().min(0),
    sku: Joi.string(),
    quantity: Joi.number().integer().min(0),
    category: Joi.any().optional(),
    sub_category: Joi.any().optional(),
    tags: Joi.string().allow('').optional(),
    status: Joi.string().valid('active', 'inactive', 'scheduled'),

    // Extra fields
    discount_type: Joi.string().valid('no_discount', 'percentage', 'fixed'),
    discount_value: Joi.number().min(0),
    shipping_width: Joi.number().min(0),
    shipping_height: Joi.number().min(0),
    shipping_weight: Joi.number().min(0),
    shipping_cost: Joi.number().min(0),
    colors: Joi.any(),
    sizes: Joi.any()
  }).min(1)
};

const orderSchemas = {
  create: Joi.object({
    user_id: Joi.any().optional(), // Handled by auth middleware
    total_amount: Joi.number().min(0).optional(), 
    address_id: Joi.any().optional(),
    coupon_code: Joi.string().optional(),
    order_items: Joi.array().items(
      Joi.object({
        product_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(), // Support both UUIDs (string) and legacy IDs (int)
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).optional() // Intentionally optional, calculated on server
      })
    ).min(1).required(),
    shipping_info: Joi.object().unknown().optional(),
    shippingAddress: Joi.object().unknown().optional(), // Redundancy support
    referralCode: Joi.string().optional(),
    save_to_profile: Joi.boolean().optional()
  })
};

module.exports = {
  authSchemas,
  productSchemas,
  orderSchemas
};
