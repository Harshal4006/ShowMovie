const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { SyncUser } = require('../Controllers/AuthController');

router.post('/sync', requireAuth(), SyncUser);

module.exports = router;