const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at, is_deleted FROM users WHERE is_deleted = 0');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const id = uuidv4();

    await db.query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, role || 'customer']
    );

    res.status(201).json({ id, name, email, role: role || 'customer' });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ id, name, email, role });
  } catch (error) {
    next(error);
  }
};

// Delete user (Soft delete)
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE users SET is_deleted = 1 WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update user profile (Self)
const updateUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { address, city, zip, phone, country, first_name, last_name } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, address = ?, city = ?, zip = ?, phone = ?, country = ? WHERE id = ?',
      [first_name, last_name, address, city, zip, phone, country, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return updated user info
    const [users] = await db.query('SELECT id, first_name, last_name, email, role, phone, address, city, zip, country FROM users WHERE id = ?', [userId]);

    res.status(200).json(users[0]);
  } catch (error) {
    next(error);
  }
};

// Update Password (Secure)
const updatePassword = async (req, res, next) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get User with Password
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Edge Case: Social Login Users (No Password)
    // Note: In our schema calling it 'password_hash' not 'password'
    if (!user.password_hash) {
      return res.status(400).json({ message: "You are logged in via Google/Apple. You cannot change password here." });
    }

    // 3. Verify Old Password
    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // 4. Hash New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // 5. Update DB
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  updatePassword
};
