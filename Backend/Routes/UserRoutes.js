const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const VerifyAdmin = require('../Middleware/AdminMiddleware');
const {
  validateUpdateProfile,
  validateUpdateRole,
  validateToggleFavorite,
  sanitizeSearch,
} = require('../Middleware/Validators');
const {
  GetCurrentUser,
  UpdateUserProfile,
  ToggleFavorite,
  GetUserFavorites,
  GetAllUsers,
  GetUserById,
  UpdateUserRole,
  DeleteUser,
  GetUserStats
} = require('../Controllers/UserController');

// Auth required - user profile and favorites
router.get('/me', VerifyToken, GetCurrentUser);
router.put('/me', VerifyToken, validateUpdateProfile, UpdateUserProfile);
router.post('/favorites', VerifyToken, validateToggleFavorite, ToggleFavorite);
router.get('/favorites', VerifyToken, GetUserFavorites);

// Admin only - user management
router.get('/', VerifyToken, VerifyAdmin, sanitizeSearch, GetAllUsers);
router.get('/:id', VerifyToken, VerifyAdmin, GetUserById);
router.put('/:id/role', VerifyToken, VerifyAdmin, validateUpdateRole, UpdateUserRole);
router.delete('/:id', VerifyToken, VerifyAdmin, DeleteUser);
router.get('/:id/stats', VerifyToken, VerifyAdmin, GetUserStats);

module.exports = router;