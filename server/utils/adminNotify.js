const AdminNotification = require('../models/AdminNotification.model');

/**
 * Helper function to notify admin of user activities
 * Safe to call - doesn't throw errors, just logs them
 */
const notifyAdminActivity = async (data) => {
    try {
        const { actionType, userId, username, userEmail, entityId, entityName } = data;

        // Save notification in database
        const notification = await AdminNotification.create({
            actionType,
            userId,
            username,
            userEmail,
            entityId,
            entityName,
            read: false
        });

        // Get Socket.io instance from global
        const io = global.io;

        if (io) {
            // Emit to admin-room only (admins who are online)
            io.to('admin-room').emit('admin:activity', {
                id: notification._id,
                actionType,
                userId,
                username,
                userEmail,
                entityId,
                entityName,
                read: false,
                createdAt: notification.createdAt
            });
        }

        return notification;
    } catch (error) {
        // Don't throw - this is a passive notification system
        // Log error but don't interrupt main flow
        console.error('Admin Activity Notification Error:', error);
        return null;
    }
};

module.exports = { notifyAdminActivity };
