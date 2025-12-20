const ActivityLog = require('../models/ActivityLog.model');

/**
 * @desc    Get all activity logs (recent 50, sorted oldest -> newest)
 * @route   GET /api/admin/activity-logs
 * @access  Admin (auth disabled for now)
 */
const getAllActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .sort({ createdAt: 1 })  // Oldest first (to preserve scroll order)
            .limit(50)
            .lean();

        // Normalize to frontend format: { message, type, time }
        const normalizedLogs = logs.map(log => ({
            message: log.message,
            type: log.type,
            time: new Date(log.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        }));

        res.json(normalizedLogs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Error fetching activity logs' });
    }
};

/**
 * @desc    Get latest activity logs (for polling fallback)
 * @route   GET /api/admin/activity-logs/latest
 * @access  Admin
 */
const getLatestActivityLogs = async (req, res) => {
    try {
        // Get logs from last 30 seconds
        const thirtySecondsAgo = new Date(Date.now() - 30000);

        const logs = await ActivityLog.find({
            createdAt: { $gte: thirtySecondsAgo }
        })
            .sort({ createdAt: 1 })
            .lean();

        const normalizedLogs = logs.map(log => ({
            message: log.message,
            type: log.type,
            time: new Date(log.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        }));

        res.json(normalizedLogs);
    } catch (error) {
        console.error('Error fetching latest logs:', error);
        res.status(500).json({ message: 'Error fetching latest logs' });
    }
};

/**
 * @desc    Create a new activity log (for testing)
 * @route   POST /api/admin/activity-logs
 * @access  Admin
 */
const createActivityLog = async (req, res) => {
    try {
        const { message, type } = req.body;

        if (!message || !type) {
            return res.status(400).json({ message: 'Message and type are required' });
        }

        const log = await ActivityLog.create({ message, type });

        // Emit to Socket.IO if available
        const io = req.app.get('io');
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

        res.status(201).json({ message: 'Activity log created', log });
    } catch (error) {
        console.error('Error creating activity log:', error);
        res.status(500).json({ message: 'Error creating activity log' });
    }
};

module.exports = {
    getAllActivityLogs,
    getLatestActivityLogs,
    createActivityLog
};
