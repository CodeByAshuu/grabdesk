const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
    actionType: {
        type: String,
        enum: ['cart_add', 'order_placed', 'user_joined'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userEmail: {
        type: String
    },
    entityId: {
        type: String // productId, orderId, etc.
    },
    entityName: {
        type: String // product name, order number, etc.
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
adminNotificationSchema.index({ createdAt: -1 });
adminNotificationSchema.index({ read: 1 });

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);
