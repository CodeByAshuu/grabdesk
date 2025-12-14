const Order = require('../models/Order.model');

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
