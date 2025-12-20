const User = require('../models/User.model');
const Product = require('../models/Product.model');

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

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });

        // Normalize data for frontend compatibility
        const normalizedUsers = users.map(user => {
            // Capitalize role for frontend (e.g., 'admin' → 'Admin')
            const frontendRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

            // Format last login
            const lastLogin = user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString('en-IN')
                : 'Never';

            return {
                id: user._id.toString(),
                _id: user._id,
                name: user.name,
                email: user.email,
                role: frontendRole,
                status: user.status || 'Active',
                lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        });

        res.json(normalizedUsers);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Toggle user status (Admin)
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Toggle status
        user.status = user.status === 'Active' ? 'Blocked' : 'Active';
        await user.save();

        // Return normalized data
        const frontendRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        const lastLogin = user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString('en-IN')
            : 'Never';

        const normalizedUser = {
            id: user._id.toString(),
            _id: user._id,
            name: user.name,
            email: user.email,
            role: frontendRole,
            status: user.status,
            lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json({
            success: true,
            message: `User ${user.status === 'Active' ? 'activated' : 'blocked'} successfully`,
            user: normalizedUser
        });

    } catch (error) {
        console.error('Toggle User Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user status'
        });
    }
};

// @desc    Reset user password (Admin)
// @route   POST /api/admin/users/:id/reset-password
// @access  Admin
exports.resetUserPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('email name');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // TODO: In production, generate a password reset token and send email
        // For now, we'll just simulate the email being sent

        // Simulated email send
        console.log(`Password reset link would be sent to: ${user.email}`);

        res.json({
            success: true,
            message: `Password reset link sent to ${user.email}`
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while resetting password'
        });
    }
};

// Existing functions below remain unchanged...
