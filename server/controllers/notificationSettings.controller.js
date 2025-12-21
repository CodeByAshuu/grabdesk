const NotificationSettings = require('../models/NotificationSettings.model');

/**
 * @desc    Get notification settings (Email/SMS configuration)
 * @route   GET /api/admin/notification-settings
 * @access  Admin
 */
exports.getNotificationSettings = async (req, res) => {
    try {
        let settings = await NotificationSettings.findOne();

        if (!settings) {
            // Create default settings if none exist
            settings = await NotificationSettings.create({
                emailEnabled: false,
                smsEnabled: false,
                emailTemplates: {},
                smsTemplates: {}
            });
        }

        res.json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Get Settings Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Update email notification settings
 * @route   PUT /api/admin/notification-settings/email
 * @access  Admin
 */
exports.updateEmailSettings = async (req, res) => {
    try {
        const { enabled, templates } = req.body;

        let settings = await NotificationSettings.findOne();

        if (!settings) {
            settings = new NotificationSettings();
        }

        if (enabled !== undefined) {
            settings.emailEnabled = enabled;
        }

        if (templates) {
            settings.emailTemplates = { ...settings.emailTemplates, ...templates };
        }

        settings.lastUpdated = Date.now();
        await settings.save();

        res.json({
            success: true,
            message: 'Email settings updated successfully',
            settings
        });
    } catch (error) {
        console.error('Update Email Settings Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Update SMS notification settings
 * @route   PUT /api/admin/notification-settings/sms
 * @access  Admin
 */
exports.updateSmsSettings = async (req, res) => {
    try {
        const { enabled, templates } = req.body;

        let settings = await NotificationSettings.findOne();

        if (!settings) {
            settings = new NotificationSettings();
        }

        if (enabled !== undefined) {
            settings.smsEnabled = enabled;
        }

        if (templates) {
            settings.smsTemplates = { ...settings.smsTemplates, ...templates };
        }

        settings.lastUpdated = Date.now();
        await settings.save();

        res.json({
            success: true,
            message: 'SMS settings updated successfully',
            settings
        });
    } catch (error) {
        console.error('Update SMS Settings Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
