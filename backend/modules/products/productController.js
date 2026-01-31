const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');
const redis = require('../../config/redis');
// const NodeCache = require('node-cache');
// const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes
// const cache = require('../cache/cacheService'); // Replaced by Redis
const { logAdminAction } = require('../../utils/auditLogger');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    // Redis Cache Check
    const page = req.query.pageNumber || req.query.page || 1;
    const cacheKey = `products_page_${page}_keyword_${req.query.search || 'all'}_limit_${req.query.limit || 12}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        console.log("⚡ Serving from Redis Cache");
        return res.json(JSON.parse(cachedData));
    }

    let query = `
      SELECT 
        p.id, p.name_en, p.name_ar, p.description_en, p.description_ar, p.price, p.sku, p.stock_quantity, p.category_id, p.image_url,
        p.is_new, p.is_featured, p.discount_type, p.discount_value, p.slug, p.created_at, p.sizes, p.colors,
        c.name_en as category_name, c.name_ar as category_name_ar,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1 AND p.is_deleted = 0
    `;
    const params = [];

    // Basic Search
    if (req.query.search) {
      query += ' AND (p.name_en LIKE ? OR p.description_en LIKE ?)';
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Category Filter
    if (req.query.category_id) {
        query += ' AND p.category_id = ?';
        params.push(req.query.category_id);
    }
    
    // Sort Order
    if (req.query.sort === 'newest') {
        query += ' ORDER BY p.created_at DESC';
    } else {
        query += ' ORDER BY p.id DESC';
    }

    // const page = parseInt(req.query.pageNumber) || parseInt(req.query.page) || 1; // Already declared above
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Count Total (Must match filters)
    let countQuery = `SELECT COUNT(*) as total FROM products p WHERE p.is_active = 1 AND p.is_deleted = 0`;
    const countParams = [];

    // Apply same filters to Count Query
    if (req.query.search) {
      countQuery += ' AND (p.name_en LIKE ? OR p.description_en LIKE ?)';
      const searchTerm = `%${req.query.search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    if (req.query.category_id) {
        countQuery += ' AND p.category_id = ?';
        countParams.push(req.query.category_id);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Main Query
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [products] = await db.query(query, params);
    
    // Map to Frontend Format (CamelCase)
    const formattedProducts = products.map(p => ({
        id: p.id,
        name: p.name_en,
        nameAr: p.name_ar,
        price: parseFloat(p.price),
        description: p.description_en,
        descriptionAr: p.description_ar,
        category: p.category_name || 'Uncategorized',
        categoryAr: p.category_name_ar || 'غير مصنف',
        category_id: p.category_id,
        created_at: p.created_at,
        images: p.primary_image ? [p.primary_image] : (p.image_url ? [p.image_url] : []),
        sizes: p.sizes || [],
        colors: p.colors || [],
        isNew: p.is_new === 1,
        isFeatured: p.is_featured === 1,
        stock: p.stock_quantity
    }));

    const responseData = {
        data: formattedProducts,
        pagination: {
            current_page: page,
            total_pages: totalPages,
            total_items: totalItems,
            limit: limit
        }
    };

    await redis.setex(cacheKey, 60, JSON.stringify(responseData));
    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id]);
    const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC', [req.params.id]);

    if (products.length === 0) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    const p = products[0];
    
    // Parse JSON fields if they are strings
    const parseJson = (field) => {
        if (!field) return [];
        if (typeof field === 'string') {
             try { return JSON.parse(field); } catch (e) { return []; }
        }
        return field;
    };

    const formattedProduct = {
        id: p.id,
        name: p.name_en,
        nameAr: p.name_ar,
        price: parseFloat(p.price),
        sku: p.sku,
        stock: p.stock_quantity,
        category_id: p.category_id,
        description: p.description_en,
        descriptionAr: p.description_ar,
        image_url: p.image_url, // Legacy or primary
        images: images.map(img => img.image_url),
        images_details: images,
        tags: parseJson(p.tags).join(','), // Frontend expects comma-separated string for tags input
        
        discount_type: p.discount_type,
        discount_value: parseFloat(p.discount_value),
        
        shipping_width: parseFloat(p.shipping_width),
        shipping_height: parseFloat(p.shipping_height),
        shipping_weight: parseFloat(p.shipping_weight),
        shipping_cost: parseFloat(p.shipping_cost),
        
        colors: parseJson(p.colors), // Keep as array/object for frontend to handle or join?
                                     // Frontend: document.getElementById('productColor').value = product.colors
                                     // If input is text, we should join. 
        sizes: parseJson(p.sizes),
        
        is_active: p.is_active === 1
    };
    
    // Convert arrays to comma strings for simple inputs if needed
    if (Array.isArray(formattedProduct.colors)) formattedProduct.colors = formattedProduct.colors.join(',');
    if (Array.isArray(formattedProduct.sizes)) formattedProduct.sizes = formattedProduct.sizes.join(',');

    res.json(formattedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { 
        name, nameEn, nameAr,
        description, descriptionEn, descriptionAr,
        price, sku, quantity, stock, category, categoryId, tags, aiTags,
        discount_type, discount_value,
        shipping_width, shipping_height, shipping_weight, shipping_cost,
        colors, sizes, is_featured
    } = req.body;
    
    // Support aliases and bilingual fields
    const finalNameEn = nameEn || name;
    const finalNameAr = nameAr || name; // Fallback to same name if Ar not provided
    const finalDescEn = descriptionEn || description;
    const finalDescAr = descriptionAr || description;
    const finalStock = Number((stock !== undefined) ? stock : quantity);
    const finalCategory = categoryId || category || null;

    // Validation
    if ((!finalNameEn && !finalNameAr) || !price || !sku || isNaN(finalStock)) {
        res.status(400);
        throw new Error('Please fill in all required fields (Name, Price, SKU, Stock)');
    }
    if (price < 0 || finalStock < 0) {
        res.status(400);
        throw new Error('Price and Stock cannot be negative');
    }

    // Handle Image Upload (Support both Multipart and Pre-uploaded URL)
    let imageUrl = req.body.image_url || req.body.imageUrl || ''; 
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const id = uuidv4();

    const formatJsonField = (field) => {
        if (!field) return '[]';
        if (Array.isArray(field)) return JSON.stringify(field);
        if (typeof field === 'string') {
            try { JSON.parse(field); return field; } catch (e) { return JSON.stringify(field.split(',').map(s => s.trim())); }
        }
        return '[]';
    };

    const tagsJson = formatJsonField(tags);
    const aiTagsJson = formatJsonField(aiTags);
    const colorsJson = formatJsonField(colors);
    const sizesJson = formatJsonField(sizes);
    
    // Generate Slug
    const slugBase = finalNameEn || finalNameAr || 'product';
    const slug = slugBase.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + id.slice(0,8);

    // Insert into DB
    await db.query(
      `INSERT INTO products (
          id, name_en, name_ar, description_en, description_ar, price, sku, stock_quantity, quantity, category_id, image_url,
          tags, ai_tags, discount_type, discount_value,
          shipping_width, shipping_height, shipping_weight, shipping_cost,
          colors, sizes, slug, is_featured
      ) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
          id, 
          finalNameEn, finalNameAr, 
          finalDescEn, finalDescAr, 
        price, sku, finalStock, finalStock,
          finalCategory, imageUrl,
        tagsJson || '[]',
        aiTagsJson || '[]',
        discount_type || 'no_discount',
        discount_value !== undefined ? discount_value : 0,
        shipping_width !== undefined ? shipping_width : null,
        shipping_height !== undefined ? shipping_height : null,
        shipping_weight !== undefined ? shipping_weight : null,
        shipping_cost !== undefined ? shipping_cost : null,
        colorsJson || '[]', sizesJson || '[]', slug, is_featured ? 1 : 0
      ]
    );

    // Handle Multiple Images Insertion
    let imageValues = [];
    
    // 1. From pre-uploaded paths (body.images)
    if (req.body.images) {
        let bodyImages = req.body.images;
        if (typeof bodyImages === 'string') {
             try { bodyImages = JSON.parse(bodyImages); } catch(e) { bodyImages = [bodyImages]; }
        }
        if (Array.isArray(bodyImages)) {
            bodyImages.forEach((imgUrl, index) => {
                const imgId = uuidv4();
                const isPrimary = (index === 0 && !imageUrl) ? 1 : 0; // If no primary set yet
                if (isPrimary && !imageUrl) imageUrl = imgUrl; // Update local primary ref
                imageValues.push([imgId, id, imgUrl, isPrimary, index]);
            });
        }
    }

    // 2. From Multipart files
    if (req.files && req.files.length > 0) {
        req.files.forEach((file, index) => {
            const imgId = uuidv4();
            const imgUrl = `/uploads/${file.filename}`;
            const existingCount = imageValues.length;
            const isPrimary = (existingCount === 0 && !imageUrl) ? 1 : 0;
            imageValues.push([imgId, id, imgUrl, isPrimary, existingCount + index]);
        });
    }

    if (imageValues.length > 0) {
        // Bulk Insert
        await db.query(
            `INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order) VALUES ?`,
            [imageValues]
        );
        
        // Update main product image_url for legacy support if needed
        const primaryImg = imageValues.find(v => v[3] === 1) || imageValues[0];
        if (primaryImg) {
             await db.query('UPDATE products SET image_url = ? WHERE id = ?', [primaryImg[2], id]);
        }
    }

    // Audit Log
    await logAdminAction(req.user.id, 'CREATE_PRODUCT', id, { name: finalNameEn, sku });

    // Invalidate Cache
    await redis.clearPattern('products:*');
    // cache.flush(); // Removed legacy cache

    const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json(newProduct[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { 
        name, nameEn, nameAr,
        description, descriptionEn, descriptionAr,
        price, sku, quantity, stock, category, categoryId, tags, aiTags,
        discount_type, discount_value,
        shipping_width, shipping_height, shipping_weight, shipping_cost,
        colors, sizes, is_featured
    } = req.body;
    const productId = req.params.id;

    // Check if product exists
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (existing.length === 0) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Support aliases and bilingual fields - retain existing ONLY if undefined (allow empty strings/zeros)
    const resolveVal = (val1, val2, existingVal) => {
      if (val1 !== undefined) return val1;
      if (val2 !== undefined) return val2;
      return existingVal;
    };

    const finalNameEn = resolveVal(nameEn, name, existing[0].name_en);
    const finalNameAr = resolveVal(nameAr, name, existing[0].name_ar);
    const finalDescEn = resolveVal(descriptionEn, description, existing[0].description_en);
    const finalDescAr = resolveVal(descriptionAr, description, existing[0].description_ar);
    const finalCategory = categoryId || category || existing[0].category_id; // Category usually strict

    // Stock logic (coalesce to undefined check)
    let finalStock = existing[0].stock_quantity;
    if (stock !== undefined) finalStock = Number(stock);
    else if (quantity !== undefined) finalStock = Number(quantity);

    // Price logic
    const finalPrice = price !== undefined ? price : existing[0].price;
    const finalSku = sku !== undefined ? sku : existing[0].sku;

    const formatJsonField = (field) => {
        if (!field) return '[]';
        if (Array.isArray(field)) return JSON.stringify(field);
        if (typeof field === 'string') {
            try { JSON.parse(field); return field; } catch (e) { return JSON.stringify(field.split(',').map(s => s.trim())); }
        }
        return '[]';
    };

    // Helper to ensure we always get a valid JSON string for SQL
    const ensureJsonString = (val, existingVal) => {
      // logic: if new val provided, format it. If checks fail or empty, fall back to existing. 
      // If existing is null/undefined, return '[]'.
      if (val !== undefined && val !== null && val !== '') {
        return formatJsonField(val);
      }
      // Fallback to existing
      if (existingVal !== undefined && existingVal !== null) {
        // If existingVal is object/array (from DB JSON parse?) No, mySQL returns string or object depending on driver config.
        // mysql2 usually returns object for JSON col if configured, or string.
        // But let's assume valid value.
        if (typeof existingVal === 'object') return JSON.stringify(existingVal);
        return existingVal;
      }
      return '[]';
    };

    const tagsJson = ensureJsonString(tags, existing[0].tags);
    const aiTagsJson = ensureJsonString(aiTags, existing[0].ai_tags);
    const colorsJson = ensureJsonString(colors, existing[0].colors);
    const sizesJson = ensureJsonString(sizes, existing[0].sizes);

    console.log(`[UpdateProduct] ID=${productId} AI_TAGS=${aiTagsJson}`); // Debug log

    // DEBUG: Write to log file
    console.log(`[UpdateProduct] ID=${productId} Body=${JSON.stringify(req.body)}`);

    const [result] = await db.query(
      `UPDATE products SET 
          name_en=?, name_ar=?, description_en=?, description_ar=?, price=?, sku=?, stock_quantity=?, quantity=?, category_id=?,
          tags=?, ai_tags=?, discount_type=?, discount_value=?,
          shipping_width=?, shipping_height=?, shipping_weight=?, shipping_cost=?,
          colors=?, sizes=?, is_featured=?
       WHERE id=?`,
      [
          finalNameEn, finalNameAr, 
          finalDescEn, finalDescAr, 
        finalPrice,
        finalSku, 
          finalStock, finalStock, // Update both
          finalCategory,
        tagsJson || '[]',
        aiTagsJson || '[]',
        discount_type || existing[0].discount_type || 'no_discount',
        discount_value !== undefined ? discount_value : (existing[0].discount_value || 0),
        shipping_width !== undefined ? shipping_width : (existing[0].shipping_width || null),
        shipping_height !== undefined ? shipping_height : (existing[0].shipping_height || null),
        shipping_weight !== undefined ? shipping_weight : (existing[0].shipping_weight || null),
        shipping_cost !== undefined ? shipping_cost : (existing[0].shipping_cost || null),
        colorsJson || '[]',
        sizesJson || '[]',
        (is_featured !== undefined ? (is_featured ? 1 : 0) : existing[0].is_featured),
          productId
      ]
    );

    console.log(`[UpdateProduct] Result: AffectedRows=${result.affectedRows}`);

    // ========== IMAGE SYNC LOGIC ==========
    // Parse existing image URLs from frontend (these are the images user wants to KEEP)
    let keepImages = [];
    if (req.body.images) {
      try {
        keepImages = typeof req.body.images === 'string'
          ? JSON.parse(req.body.images)
          : req.body.images;
        if (!Array.isArray(keepImages)) keepImages = [keepImages];
      } catch (e) {
        keepImages = [];
      }
    }

    // Get current images from DB
    const [currentImages] = await db.query(
      'SELECT id, image_url FROM product_images WHERE product_id = ?',
      [productId]
    );

    // Find images to DELETE (in DB but not in keepImages)
    const imagesToDelete = currentImages.filter(
      img => !keepImages.includes(img.image_url)
    );

    // Delete removed images
    if (imagesToDelete.length > 0) {
      const idsToDelete = imagesToDelete.map(img => img.id);
      await db.query(
        'DELETE FROM product_images WHERE id IN (?)',
        [idsToDelete]
      );
    }

    // Handle New File Uploads
    if (req.files && req.files.length > 0) {
      const existingCount = currentImages.length - imagesToDelete.length;
        const imageValues = req.files.map((file, index) => {
            const imgId = uuidv4();
            const imgUrl = `/uploads/${file.filename}`;
          const isPrimary = (existingCount === 0 && index === 0) ? 1 : 0;
          return [imgId, productId, imgUrl, isPrimary, existingCount + index];
        });

        await db.query(
            `INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order) VALUES ?`,
            [imageValues]
        );
        
      // Update main product image_url if it was empty or deleted
      const [remainingImages] = await db.query(
        'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC LIMIT 1',
        [productId]
      );
      if (remainingImages.length > 0) {
        await db.query('UPDATE products SET image_url = ? WHERE id = ?', [remainingImages[0].image_url, productId]);
      } else if (imageValues.length > 0) {
        await db.query('UPDATE products SET image_url = ? WHERE id = ?', [imageValues[0][2], productId]);
        }
    } else if (imagesToDelete.length > 0) {
      // If we deleted images but no new uploads, update the main image_url
      const [remainingImages] = await db.query(
        'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC LIMIT 1',
        [productId]
      );
      await db.query('UPDATE products SET image_url = ? WHERE id = ?',
        [remainingImages.length > 0 ? remainingImages[0].image_url : null, productId]);
    }

    // Audit Log
    await logAdminAction(req.user.id, 'UPDATE_PRODUCT', productId, { name: finalNameEn, sku });

    // Invalidate Cache - clear both possible patterns
    await redis.del(`product:${productId}`);
    await redis.clearPattern('products:*');  // Old pattern
    await redis.clearPattern('products_page_*');  // Actual cache key pattern

    const [updatedProduct] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    res.json(updatedProduct[0]);

  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const [result] = await db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Audit Log
    await logAdminAction(req.user.id, 'DELETE_PRODUCT', req.params.id, { reason: 'Soft Delete' });

    // Invalidate Cache
    await redis.del(`product:${req.params.id}`);
    await redis.clearPattern('products:*');
    cache.flush(); // Invalidate node-cache

    res.json({ message: 'Product soft deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
