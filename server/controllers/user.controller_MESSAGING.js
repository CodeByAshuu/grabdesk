const User = require('../models/User.model');

// @desc    Send message to specific user (Admin)
// @route   POST /api/admin/send-message
// @access  Admin
exports.sendMessageToUser = async (req, res) => {
    try {
        const { emailOrUsername, title, message } = req.body;

        // Validate input
        if (!emailOrUsername || !title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Email/username, title, and message are required'
            });
        }

        // Find user by email OR username (email is primary, but support both)
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase().trim() },
                { name: emailOrUsername.trim() } // Using name field as username
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with that email or username'
            });
        }

        // Add message to user's messages array
        const newMessage = {
            title: title.trim(),
            description: message.trim(),
            read: false,
            createdAt: new Date()
        };

        user.messages.push(newMessage);
        await user.save();

        // Get the newly added message (last one in array)
        const addedMessage = user.messages[user.messages.length - 1];

        // Emit real-time event to specific user via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.emit(`admin-message:${user._id}`, {
                _id: addedMessage._id,
                title: addedMessage.title,
                description: addedMessage.description,
                read: addedMessage.read,
                createdAt: addedMessage.createdAt
            });
        }

        res.status(201).json({
            success: true,
            message: `Message sent to ${user.name} (${user.email}) successfully`,
            sentMessage: {
                _id: addedMessage._id,
                title: addedMessage.title,
                description: addedMessage.description,
                read: addedMessage.read,
                createdAt: addedMessage.createdAt,
                recipientName: user.name,
                recipientEmail: user.email
            }
        });
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = exports;
