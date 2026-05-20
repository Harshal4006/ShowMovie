const { getAuth } = require('@clerk/express');
const Notification = require('../Models/Notification');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const GetNotifications = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notifications = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ user: user._id, isRead: false });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const MarkAsRead = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const notification = await Notification.findOne({ _id: req.params.id, user: user._id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const MarkAllAsRead = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Notification.updateMany({ user: user._id, isRead: false }, { isRead: true });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteNotification = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: user._id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ClearAllNotifications = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Notification.deleteMany({ user: user._id });

    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const CreateNotification = async (userId, type, title, message, relatedId = null, relatedModel = null) => {
  try {
    await ensureDbConnection();
    return await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedId,
      relatedModel
    });
  } catch (error) {
    return null;
  }
};

module.exports = {
  GetNotifications,
  MarkAsRead,
  MarkAllAsRead,
  DeleteNotification,
  ClearAllNotifications,
  CreateNotification
};