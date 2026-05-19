const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const VerifyAdmin = require('../Middleware/AdminMiddleware');
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

// User routes (auth required)
router.get('/me', VerifyToken, GetCurrentUser);

// Debug - remove this after testing
router.get('/debug', VerifyToken, async (req, res) => {
  res.json({
    auth: req.auth,
    message: 'Auth working! If you see this, Clerk is configured correctly.'
  });
});

router.put('/me', VerifyToken, UpdateUserProfile);
router.post('/favorites', VerifyToken, ToggleFavorite);
router.get('/favorites', VerifyToken, GetUserFavorites);

// Admin routes (admin only)
router.get('/', VerifyToken, VerifyAdmin, GetAllUsers);
router.get('/:id', VerifyToken, VerifyAdmin, GetUserById);
router.put('/:id/role', VerifyToken, VerifyAdmin, UpdateUserRole);
router.delete('/:id', VerifyToken, VerifyAdmin, DeleteUser);
router.get('/:id/stats', VerifyToken, VerifyAdmin, GetUserStats);

module.exports = router;