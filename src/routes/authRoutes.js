const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (Requires Passport JWT authentication)
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;
