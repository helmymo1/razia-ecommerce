const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    addUser,
    editUser,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users')
    .get(protect, admin, getAllUsers)
    .post(protect, admin, addUser);

router.route('/users/:id')
    .put(protect, admin, editUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
