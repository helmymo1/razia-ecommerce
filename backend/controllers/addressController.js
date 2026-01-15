
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res, next) => {
  // Map frontend 'name' -> DB 'title', and 'address' -> 'address_line1'
  let { name, address, address_line1, city, state, zip, country, phone, is_default } = req.body;
  const userId = req.user.id;

  // Handle address field mapping
  address_line1 = address_line1 || address;
  const title = name || 'Home';

  // Validation
  if (!address_line1 || !city || !phone) {
    res.status(400);
    throw new Error('Please fill in all required fields (Address, City, Phone)');
  }

  try {
    // If setting as default, unset other defaults
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    const id = uuidv4();
    await db.query(
      `INSERT INTO addresses (id, user_id, title, address_line1, city, state, zip, country, phone, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, title, address_line1, city, state, zip, country, phone, is_default ? 1 : 0]
    );

    const [newAddress] = await db.query('SELECT * FROM addresses WHERE id = ?', [id]);
    res.status(201).json(newAddress[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
  const { id } = req.params;
  let { name, address, address_line1, city, state, zip, country, phone, is_default } = req.body;
  const userId = req.user.id;

  address_line1 = address_line1 || address;

  try {
    // Check ownership
    const [exists] = await db.query('SELECT id FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    if (exists.length === 0) {
      res.status(404);
      throw new Error('Address not found');
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    await db.query(
      `UPDATE addresses 
       SET title = ?, address_line1 = ?, city = ?, state = ?, zip = ?, country = ?, phone = ?, is_default = ?
       WHERE id = ?`,
      [name, address_line1, city, state, zip, country, phone, is_default ? 1 : 0, id]
    );

    const [updatedAddress] = await db.query('SELECT * FROM addresses WHERE id = ?', [id]);
    res.status(200).json(updatedAddress[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (result.affectedRows === 0) {
      res.status(404);
      throw new Error('Address not found or not authorized');
    }

    res.status(200).json({ message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
