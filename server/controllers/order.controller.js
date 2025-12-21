const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const { notifyAdminActivity } = require('../utils/adminNotify');

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

        // Calculate totals server-side (never trust frontend)
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product || item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }

            const price = product.finalPrice;
            subtotal += price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images?.[0] || '',
                price,
                quantity: item.quantity
            });
        }

        // Shipping & tax calculation (safe + consistent)
        const shipping =
            deliveryMethod === 'express'
                ? 15.0
                : subtotal > 50
                    ? 0
                    : 5.99;

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

        // NEW: Notify admin of new order (passive - doesn't block)
        const user = await User.findById(req.user.id).select('name email');
        notifyAdminActivity({
            actionType: 'order_placed',
            userId: req.user.id,
            username: user?.name || user?.email,
            userEmail: user?.email,
            entityId: createdOrder._id.toString(),
            entityName: `Order #${createdOrder._id.toString().slice(-6)}`
        }).catch(err => console.error('Admin notify error:', err));

        // Clear user cart safely
        await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

        res.status(201).json({
            success: true,
            orderId: createdOrder._id,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Create Order Error:', error);
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
        console.error('Get My Orders Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const normalizedOrders = orders.map(order => {
            const statusStr = order.status || 'pending';
            const frontendStatus =
                statusStr.charAt(0).toUpperCase() + statusStr.slice(1);

            return {
                id: order._id.toString(),
                _id: order._id,
                customer:
                    order.user?.name ||
                    order.user?.email ||
                    'Unknown Customer',
                status: frontendStatus,
                total:
                    typeof order.pricing?.total === 'number'
                        ? `₹${order.pricing.total.toFixed(2)}`
                        : '₹0.00',
                payment: 'Paid',
                date: order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN')
                    : 'N/A',
                items: order.items || [],
                shippingAddress: order.shippingAddress || {},
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });

        res.json(normalizedOrders);
    } catch (error) {
        console.error('Get All Orders Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/admin/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const backendStatus = status.toLowerCase();
        const validStatuses = [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ];

        if (!validStatuses.includes(backendStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: backendStatus },
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const frontendStatus =
            order.status.charAt(0).toUpperCase() + order.status.slice(1);

        const normalizedOrder = {
            id: order._id.toString(),
            _id: order._id,
            customer:
                order.user?.name || order.user?.email || 'Unknown',
            status: frontendStatus,
            total: `₹${order.pricing.total.toFixed(2)}`,
            payment: 'Paid',
            date: new Date(order.createdAt).toLocaleDateString('en-IN'),
            items: order.items,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };

        // Emit activity log safely
        const io = req.app.get('io');
        if (io) {
            io.of('/activity').emit('newLog', {
                message: `Order #${order._id.toString().slice(-6)} status updated to ${frontendStatus}`,
                type: 'order',
                time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order: normalizedOrder
        });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating order status'
        });
    }
};
