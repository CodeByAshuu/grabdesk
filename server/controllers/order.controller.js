const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, pricing, deliveryMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        if (!shippingAddress) {
            return res.status(400).json({ success: false, message: 'Shipping address is required' });
        }

        // Calculate totals server-side (do not trust frontend)
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product || item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
            }

            const price = product.finalPrice;
            subtotal += price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: price,
                quantity: item.quantity
            });
        }

        // Shipping calculation (mirroring frontend logic for consistency, but enforced here)
        let shipping = deliveryMethod === 'express' ? 15.00 : (subtotal > 50 ? 0 : 5.99);
        const tax = subtotal * 0.085;
        const total = subtotal + shipping + tax;

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            pricing: {
                subtotal,
                shipping,
                tax,
                total
            },
            deliveryMethod,
            status: 'pending'
        });

        const createdOrder = await order.save();

        // Clear user's cart
        await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

        res.status(201).json({
            success: true,
            orderId: createdOrder._id,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
