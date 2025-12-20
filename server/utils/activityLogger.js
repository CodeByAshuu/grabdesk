const ActivityLog = require('../models/ActivityLog.model');

/**
 * Utility function to create and emit activity logs
 * Can be called from any controller for automatic logging
 * 
 * @param {Object} io - Socket.IO instance (from req.app.get('io'))
 * @param {String} message - Log message
 * @param {String} type - Log type: 'system' | 'auth' | 'product' | 'order' | 'user'
 */
const emitActivityLog = async (io, message, type) => {
    try {
        // Save to database
        const log = await ActivityLog.create({ message, type });

        // Emit to Socket.IO /activity namespace
        if (io) {
            io.of('/activity').emit('newLog', {
                message: log.message,
                type: log.type,
                time: new Date(log.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            });
        }

        return log;
    } catch (error) {
        console.error('Error emitting activity log:', error);
        return null;
    }
};

module.exports = { emitActivityLog };
