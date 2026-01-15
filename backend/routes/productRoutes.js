const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const validate = require('../middleware/validateRequest');
const { productSchemas } = require('../middleware/schemas');
const cache = require('../middleware/cacheMiddleware');
const { publicLimiter } = require('../middleware/securityConfig');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns the list of all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: The list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.route('/')
    .get(publicLimiter, getProducts)
    // upload.array('images', 10) allows up to 10 files with field name 'images'
    // Frontend must use formData.append('images', file)
    .post(protect, admin, require('../middleware/authStatusCheck'), upload.array('images', 10), require('../middleware/validateProduct'), createProduct);

router.route('/:id')
    .get(publicLimiter, getProductById)
    .put(protect, admin, require('../middleware/authStatusCheck'), upload.array('images', 10), require('../middleware/validateProduct'), updateProduct)
    .delete(protect, admin, require('../middleware/authStatusCheck'), deleteProduct);

module.exports = router;
