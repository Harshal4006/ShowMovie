const express = require('express');
const router = express.Router();
const VerifyToken = require('../Middleware/AuthMiddleware');
const NotificationController = require('../Controllers/NotificationController');

router.get('/', VerifyToken, NotificationController.GetNotifications);
router.patch('/:id/read', VerifyToken, NotificationController.MarkAsRead);
router.patch('/read-all', VerifyToken, NotificationController.MarkAllAsRead);
router.delete('/:id', VerifyToken, NotificationController.DeleteNotification);
router.delete('/', VerifyToken, NotificationController.ClearAllNotifications);

module.exports = router;