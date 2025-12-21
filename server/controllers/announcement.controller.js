const User = require('../models/User.model');

/**
 * @desc    Send announcement to all users
 * @route   POST /api/admin/notifications/announcement
 * @access  Admin only
 */
exports.sendAnnouncement = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Announcement message is required'
            });
        }

        const trimmedMessage = message.trim();

        // Get all users
        const users = await User.find({}).select('_id');

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found'
            });
        }

        // Create announcement notification object
        const announcementNotification = {
            title: 'Announcement',
            description: trimmedMessage,
            read: false,
            createdAt: new Date()
        };

        // Bulk update all users - add announcement to their messages array
        const bulkOps = users.map(user => ({
            updateOne: {
                filter: { _id: user._id },
                update: {
                    $push: {
                        messages: announcementNotification
                    }
                }
            }
        }));

        await User.bulkWrite(bulkOps);

        // Emit Socket.io event to all connected users (real-time)
        const io = req.app.get('io');
        if (io) {
            io.emit('announcement:new', {
                title: 'Announcement',
                description: trimmedMessage,
                read: false,
                createdAt: new Date()
            });
        }

        res.status(201).json({
            success: true,
            message: `Announcement sent to ${users.length} users`,
            userCount: users.length,
            notification: {
                type: 'announcement',
                message: trimmedMessage,
                time: 'just now',
                read: false
            }
        });

    } catch (error) {
        console.error('Send Announcement Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send announcement'
        });
    }
};
