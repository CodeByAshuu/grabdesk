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
        const user = await User.findById(req.user.id).populate('wishlist');
        const wishlistItems = user.wishlist
            .filter(product => product !== null)
            .map(product => ({
                id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                rating: product.rating,
                available: product.countInStock > 0,
                originalPriceString: product.originalPriceString
            }));
        res.json(wishlistItems);
    } catch (error) {
        console.error(error);
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
        }

        const updatedUser = await User.findById(req.user.id).populate('wishlist');
        const wishlistItems = updatedUser.wishlist
            .filter(product => product !== null)
            .map(product => ({
                id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                rating: product.rating,
                available: product.countInStock > 0,
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
            price: product.price,
            images: product.images,
            rating: product.rating,
            available: product.countInStock > 0,
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
