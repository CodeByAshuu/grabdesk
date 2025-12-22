const express = require('express');
const router = express.Router();
const {
    getMe,
    addAddress,
    updateAddress,
    deleteAddress,
    getMessages,
    markMessagesRead,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} = require('../controllers/user.controller');
const { uploadProfilePictureHandler } = require('../controllers/user.controller_PROFILE');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/me', getMe);
router.get('/messages', getMessages);
router.put('/messages/mark-read', markMessagesRead);

// Profile picture upload
router.post('/profile-picture', uploadProfilePictureHandler);

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:productId', updateCartItem);
router.delete('/cart/:productId', removeFromCart);
router.delete('/cart', clearCart);

router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.delete('/wishlist', clearWishlist);

router.post('/address', addAddress);
router.put('/address/:index', updateAddress);
router.delete('/address/:index', deleteAddress);

module.exports = router;
