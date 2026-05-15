const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const { SyncUser, GetCurrentUser, ToggleFavorite } = require('../Controllers/AuthController');

// Sync Clerk user to MongoDB (called from frontend)
router.post('/sync', SyncUser);

// Get current logged in user
router.get('/me', VerifyToken, GetCurrentUser);

// Toggle favorite movie
router.post('/favorites', VerifyToken, ToggleFavorite);

module.exports = router;