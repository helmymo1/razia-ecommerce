const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query('SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC');
    // Map to expected format if needed, splitting name logic if DB uses first/last
    const formattedUsers = users.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim() || 'Unknown',
        email: user.email,
        role: user.role,
        created_at: user.created_at
    }));
    res.json(formattedUsers);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new user
// @route   POST /api/admin/users
// @access  Private/Admin
const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
        res.status(400);
        throw new Error('Name, email, and password are required');
    }

    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Split name (Simple logic: first word is first_name, rest is last_name)
    const nameParts = name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || '';

    const newId = uuidv4();
    await db.query(
        'INSERT INTO users (id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
        [newId, first_name, last_name, email, password_hash, role || 'customer']
    );

    res.status(201).json({
        id: newId,
        name,
        email,
        role: role || 'customer',
        message: 'User created successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Edit user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const editUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const [user] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prepare updates
    let updateFields = [];
    let updateValues = [];

    if (name) {
        const nameParts = name.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ') || '';
        updateFields.push('first_name = ?', 'last_name = ?');
        updateValues.push(first_name, last_name);
    }
    if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
    }
    if (role) {
        updateFields.push('role = ?');
        updateValues.push(role);
    }

    if (updateFields.length === 0) {
        return res.json({ message: 'No changes made' });
    }

    updateValues.push(userId);

    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.query(sql, updateValues);

    res.json({ message: 'User updated successfully' });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Prevent self-deletion (compare as strings since id is UUID)
    if (userId === req.user.id) {
        res.status(400);
        throw new Error('You cannot delete yourself');
    }

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        res.status(400);
        throw new Error('Cannot delete user: They have active orders or data.');
    }
    next(error);
  }
};

module.exports = {
    getAllUsers,
    addUser,
    editUser,
    deleteUser
};
