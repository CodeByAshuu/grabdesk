const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['system', 'auth', 'product', 'order', 'user'],
        required: true
    }
}, {
    timestamps: true  // Auto-generates createdAt and updatedAt
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
