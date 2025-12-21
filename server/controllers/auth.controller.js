const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { notifyAdminActivity } = require('../utils/adminNotify');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Default 1 day
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        // Check for admin email attempt
        if (email === 'admin123@grabdesk.in') {
            return res.status(400).json({ success: false, message: 'Admin account already exists. Contact system owner.' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            passwordHash,
            phone,
            role: 'customer' // Force customer role
        });

        if (user) {
            // Emit activity log
            const io = req.app.get('io');
            if (io) {
                io.of('/activity').emit('newLog', {
                    message: `New user registered: ${user.email}`,
                    type: 'auth',
                    time: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                });
            }

            // NEW: Notify admin of new user registration (passive)
            notifyAdminActivity({
                actionType: 'user_joined',
                userId: user._id,
                username: user.name,
                userEmail: user.email,
                entityId: user._id.toString(),
                entityName: user.name
            }).catch(err => console.error('Admin notify error:', err));

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                token: generateToken(user._id, user.role),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for email and password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            // Update lastLogin
            user.lastLogin = Date.now();
            await user.save();

            // Emit activity log
            const io = req.app.get('io');
            if (io) {
                io.of('/activity').emit('newLog', {
                    message: `User logged in: ${user.email}`,
                    type: 'auth',
                    time: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                });
            }

            res.json({
                success: true,
                token: generateToken(user._id, user.role),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Private
exports.resetPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both current and new passwords' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        // Get user from DB (req.user is set by protect middleware, but we need the password hash)
        // User.findById(req.user._id) is safer to ensure we get the latest data including password
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
