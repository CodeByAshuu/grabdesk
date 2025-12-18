const User = require('../models/User.model');

// @desc    Get current user profile (Extended)
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add an address
// @route   POST /api/users/address
// @access  Private
exports.addAddress = async (req, res) => {
    try {
        const { street, city, state, zipCode, country, isPrimary } = req.body;

        const user = await User.findById(req.user.id);

        const newAddress = {
            street,
            city,
            state,
            zipCode,
            country,
            isPrimary: isPrimary || false
        };

        // If primary, set others to false
        if (isPrimary) {
            user.addresses.forEach(addr => addr.isPrimary = false);
        }

        user.addresses.push(newAddress);
        await user.save();

        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update an address
// @route   PUT /api/users/address/:index
// @access  Private
exports.updateAddress = async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const { street, city, state, zipCode, country, isPrimary } = req.body;

        const user = await User.findById(req.user.id);

        if (index < 0 || index >= user.addresses.length) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        if (isPrimary) {
            user.addresses.forEach(addr => addr.isPrimary = false);
        }

        const updatedAddress = {
            ...user.addresses[index],
            street, city, state, zipCode, country, isPrimary
        };

        user.addresses[index] = updatedAddress;

        // Mark modified because we are modifying a mixed array/object
        user.markModified('addresses');
        await user.save();

        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete an address
// @route   DELETE /api/users/address/:index
// @access  Private
exports.deleteAddress = async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const user = await User.findById(req.user.id);

        if (index < 0 || index >= user.addresses.length) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        user.addresses.splice(index, 1);
        user.markModified('addresses');
        await user.save();

        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user messages
// @route   GET /api/users/messages
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.messages || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Mark message as read
// @route   PUT /api/users/messages/mark-read
// @access  Private
exports.markMessagesRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.messages && user.messages.length > 0) {
            user.messages.forEach(msg => msg.read = true);
            user.markModified('messages');
            await user.save();
        }

        res.json(user.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
