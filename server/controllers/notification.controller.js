const Notification = require('../models/Notification.model');
const User = require('../models/User.model');

// Helper function to format time
const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

// @desc    Get all notifications
// @route   GET /api/admin/notifications
// @access  Admin
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({}).sort({ createdAt: -1 });

        const normalizedNotifications = notifications.map(notif => ({
            id: notif._id.toString(),
            _id: notif._id,
            type: notif.type,
            message: notif.message,
            read: notif.read,
            time: formatTime(notif.createdAt),
            createdAt: notif.createdAt,
            updatedAt: notif.updatedAt
        }));

        res.json(normalizedNotifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Toggle notification read status
// @route   PATCH /api/admin/notifications/:id/read
// @access  Admin
exports.toggleNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        notification.read = !notification.read;
        await notification.save();

        const normalizedNotification = {
            id: notification._id.toString(),
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            read: notification.read,
            time: formatTime(notification.createdAt),
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt
        };

        res.json({ success: true, notification: normalizedNotification });
    } catch (error) {
        console.error('Toggle Read Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete notification
// @route   DELETE /api/admin/notifications/:id
// @access  Admin
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Delete Notification Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create announcement
// @route   POST /api/admin/notifications/announcement
// @access  Admin
exports.createAnnouncement = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Announcement message is required' });
        }

        const trimmedMessage = message.trim();

        // Save in admin notifications (existing behavior)
        const notification = new Notification({
            type: 'system',
            message: trimmedMessage,
            read: false
        });

        await notification.save();

        // NEW: Broadcast to all users
        const users = await User.find({}).select('_id');

        if (users.length > 0) {
            const announcementForUsers = {
                title: 'Announcement',
                description: trimmedMessage,
                read: false,
                createdAt: new Date()
            };

            // Bulk update all users
            const bulkOps = users.map(user => ({
                updateOne: {
                    filter: { _id: user._id },
                    update: { $push: { messages: announcementForUsers } }
                }
            }));

            await User.bulkWrite(bulkOps);

            // Emit Socket.io event to all connected users
            const io = req.app.get('io');
            if (io) {
                io.emit('announcement:new', announcementForUsers);
            }
        }

        const normalizedNotification = {
            id: notification._id.toString(),
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            read: notification.read,
            time: 'just now',
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt
        };

        res.status(201).json({
            success: true,
            message: `Announcement sent to ${users.length} users`,
            notification: normalizedNotification
        });
    } catch (error) {
        console.error('Create Announcement Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
