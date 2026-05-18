const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const NotificationController = require('../Controllers/NotificationController');

router.get('/', requireAuth(), NotificationController.GetNotifications);
router.patch('/:id/read', requireAuth(), NotificationController.MarkAsRead);
router.patch('/read-all', requireAuth(), NotificationController.MarkAllAsRead);
router.delete('/:id', requireAuth(), NotificationController.DeleteNotification);
router.delete('/', requireAuth(), NotificationController.ClearAllNotifications);

module.exports = router;