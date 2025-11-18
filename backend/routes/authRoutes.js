const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Get & Update profile
router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateUserProfile);

module.exports = router;
