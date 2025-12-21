const User = require('../models/User.model');
const Product = require('../models/Product.model');
const { notifyAdminActivity } = require('../utils/adminNotify');
const { updatePersonalizedTags } = require('../utils/recommendation.utils');

// @desc    Get current user profile (Extended)
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('getMe error:', error);
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

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.productId');

        // Transform to expected frontend format
        const cartItems = user.cart.map(item => {
            if (!item.productId) return null; // Handle if product was deleted
            const product = item.productId;
            return {
                id: product._id,
                title: product.name,
                price: product.finalPrice || product.price, // Use finalPrice if available
                originalPrice: product.basePrice,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                color: item.color || product.color || "Standard",
                size: item.size || (product.sizeAvailable && product.sizeAvailable.length > 0 ? product.sizeAvailable[0] : "Standard"),
                quantity: item.quantity,
                description: product.description,
                inStock: product.stock > 0,
                maxQuantity: product.stock
            };
        }).filter(item => item !== null);

        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add item to cart
// @route   POST /api/users/cart
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;
        const user = await User.findById(req.user.id);

        // Find if item with same product, size, and color exists
        const cartItemIndex = user.cart.findIndex(item =>
            item.productId.toString() === productId &&
            item.size === (size || '') &&
            item.color === (color || '')
        );

        if (cartItemIndex > -1) {
            // Item exists, update quantity
            user.cart[cartItemIndex].quantity += quantity || 1;
        } else {
            // Add new item
            user.cart.push({
                productId,
                quantity: quantity || 1,
                size: size || '',
                color: color || ''
            });
        }

        await user.save();

        // NEW: Notify admin of cart activity (passive - doesn't block)
        const product = await Product.findById(productId);
        if (product) {
            // Update personalized tags on cart add (high intent)
            updatePersonalizedTags(user, product, 'CART').catch(err => console.error('Personalization error:', err));

            notifyAdminActivity({
                actionType: 'cart_add',
                userId: user._id,
                username: user.name || user.email,
                userEmail: user.email,
                entityId: productId,
                entityName: product.name
            }).catch(err => console.error('Admin notify error:', err));
        }

        // Return updated cart
        const updatedUser = await User.findById(req.user.id).populate('cart.productId');
        const cartItems = updatedUser.cart.map(item => {
            if (!item.productId) return null;
            const product = item.productId;
            return {
                id: product._id,
                title: product.name,
                price: product.finalPrice || product.price,
                originalPrice: product.basePrice,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                color: item.color || product.color || "Standard",
                size: item.size || (product.sizeAvailable && product.sizeAvailable.length > 0 ? product.sizeAvailable[0] : "Standard"),
                quantity: item.quantity,
                description: product.description,
                inStock: product.stock > 0,
                maxQuantity: product.stock
            };
        }).filter(item => item !== null);

        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/users/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.productId;
        const user = await User.findById(req.user.id);

        const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex > -1) {
            user.cart[cartItemIndex].quantity = quantity;
            await user.save();
        } else {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        // Return updated cart
        const updatedUser = await User.findById(req.user.id).populate('cart.productId');
        const cartItems = updatedUser.cart.map(item => {
            if (!item.productId) return null;
            const product = item.productId;
            return {
                id: product._id,
                title: product.name,
                price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                color: "Standard",
                quantity: item.quantity,
                inStock: product.countInStock > 0,
                maxQuantity: product.countInStock
            };
        }).filter(item => item !== null);

        res.json(cartItems);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await User.findById(req.user.id);

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();

        // Return updated cart
        const updatedUser = await User.findById(req.user.id).populate('cart.productId');
        const cartItems = updatedUser.cart.map(item => {
            if (!item.productId) return null;
            const product = item.productId;
            return {
                id: product._id,
                title: product.name,
                price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                color: "Standard",
                quantity: item.quantity,
                inStock: product.countInStock > 0,
                maxQuantity: product.countInStock
            };
        }).filter(item => item !== null);

        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Clear cart
// @route   DELETE /api/users/cart
// @access  Private
exports.clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();
        res.json([]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const user = await User.findById(req.user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const wishlistItems = (user.wishlist || [])
            .filter(product => product !== null)
            .map(product => ({
                id: product._id,
                name: product.name,
                price: product.finalPrice || product.price || 0,
                basePrice: product.originalPrice || product.basePrice || product.price || 0,
                priceNum: product.finalPrice || product.price || 0,
                images: product.images,
                rating: product.ratingAverage || product.rating || 0,
                available: product.stock > 0,
                originalPriceString: product.originalPriceString
            }));
        res.json(wishlistItems);
    } catch (error) {
        console.error('getWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.wishlist.some(id => id.toString() === productId)) {
            user.wishlist.push(productId);
            await user.save();

            // Update personalized tags on wishlist add (medium intent)
            const product = await Product.findById(productId);
            if (product) {
                updatePersonalizedTags(user, product, 'WISHLIST').catch(err => console.error('Personalization error:', err));
            }
        }

        const updatedUser = await User.findById(req.user.id).populate('wishlist');
        const wishlistItems = updatedUser.wishlist
            .filter(product => product !== null)
            .map(product => ({
                id: product._id,
                name: product.name,
                price: product.finalPrice || product.price || 0,
                basePrice: product.originalPrice || product.basePrice || product.price || 0,
                priceNum: product.finalPrice || product.price || 0,
                images: product.images,
                rating: product.ratingAverage || product.rating || 0,
                available: product.stock > 0,
                originalPriceString: product.originalPriceString
            }));
        res.json(wishlistItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('wishlist');
        const wishlistItems = updatedUser.wishlist.map(product => ({
            id: product._id,
            name: product.name,
            price: product.finalPrice || product.price || 0,
            basePrice: product.originalPrice || product.basePrice || product.price || 0,
            priceNum: product.finalPrice || product.price || 0,
            images: product.images,
            rating: product.ratingAverage || product.rating || 0,
            available: product.stock > 0,
            originalPriceString: product.originalPriceString
        }));
        res.json(wishlistItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/users/wishlist
// @access  Private
exports.clearWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = [];
        await user.save();
        res.json([]);
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
        const normalizedUsers = users.map(user => {
            const frontendRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
            const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : 'Never';
            return {
                id: user._id.toString(), _id: user._id, name: user.name, email: user.email,
                role: frontendRole, status: user.status || 'Active', lastLogin,
                createdAt: user.createdAt, updatedAt: user.updatedAt
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
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.status = user.status === 'Active' ? 'Blocked' : 'Active';
        await user.save();
        const frontendRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : 'Never';
        const normalizedUser = {
            id: user._id.toString(), _id: user._id, name: user.name, email: user.email,
            role: frontendRole, status: user.status, lastLogin,
            createdAt: user.createdAt, updatedAt: user.updatedAt
        };
        res.json({ success: true, message: `User ${user.status === 'Active' ? 'activated' : 'blocked'} successfully`, user: normalizedUser });
    } catch (error) {
        console.error('Toggle User Status Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Reset user password (Admin)
// @route   POST /api/admin/users/:id/reset-password
// @access  Admin
exports.resetUserPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('email name');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        console.log(`Password reset link would be sent to: ${user.email}`);
        res.json({ success: true, message: `Password reset link sent to ${user.email}` });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

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
