const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT id, name_en as name, name_ar, slug, image_url as image, parent_id, description_en as description, sort_order FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, name_ar, slug, parent_id, description, sort_order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    
    // Validation
    if (!name || !slug) {
        res.status(400);
        throw new Error('Name (en) and Slug are required');
    }

    // Generate UUID for category ID
    const categoryId = uuidv4();

    const [result] = await db.query(
      'INSERT INTO categories (id, name_en, name_ar, slug, image_url, parent_id, description_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [categoryId, name, name_ar || name, slug, image, parent_id || null, description, sort_order || 0]
    );
    
    res.status(201).json({ 
      id: categoryId,
        name,
        slug,
        message: 'Category created successfully' 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        res.status(400);
        throw new Error('Category slug already exists');
    }
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, name_ar, slug, parent_id, description, sort_order, is_active } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const categoryId = req.params.id;

    // Check if category exists
    const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    if (existing.length === 0) {
        res.status(404);
        throw new Error('Category not found');
    }
    const cat = existing[0];

    // Prepare values, defaulting to existing if not provided
    const nameEn = name !== undefined ? name : cat.name_en;
    const nameAr = name_ar !== undefined ? name_ar : cat.name_ar;
    const slugVal = slug !== undefined ? slug : cat.slug;
    const imageUrl = image !== undefined ? image : cat.image_url;
    const parentId = parent_id !== undefined ? parent_id : cat.parent_id;
    const descEn = description !== undefined ? description : cat.description_en;
    const sortOrder = sort_order !== undefined ? sort_order : cat.sort_order;
    const isActive = is_active !== undefined ? is_active : cat.is_active;

    await db.query(
        'UPDATE categories SET name_en=?, name_ar=?, slug=?, image_url=?, parent_id=?, description_en=?, sort_order=?, is_active=? WHERE id=?', 
        [nameEn, nameAr, slugVal, imageUrl, parentId, descEn, sortOrder, isActive, categoryId]
    );
    
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
        res.status(404);
        throw new Error('Category not found');
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
