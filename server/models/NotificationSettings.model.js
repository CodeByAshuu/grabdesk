const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
    emailEnabled: {
        type: Boolean,
        default: false
    },
    smsEnabled: {
        type: Boolean,
        default: false
    },
    emailTemplates: {
        type: Map,
        of: String,
        default: {}
    },
    smsTemplates: {
        type: Map,
        of: String,
        default: {}
    },
    emailProvider: {
        type: String,
        enum: ['sendgrid', 'mailgun', 'smtp', 'none'],
        default: 'none'
    },
    smsProvider: {
        type: String,
        enum: ['twilio', 'nexmo', 'none'],
        default: 'none'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
