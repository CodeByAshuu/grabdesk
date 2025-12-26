const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

// @desc    Get dashboard stats (Total Sales, Orders, Users, Low Stock)
// @route   GET /api/admin/analytics/stats
// @access  Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Sales (Sum of total from non-cancelled orders)
        const salesAgg = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: "$pricing.total" } } }
        ]);
        const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0;

        // 2. Total Products (Inventory Count)
        const totalProducts = await Product.countDocuments();

        // 3. Active Users
        const activeUsers = await User.countDocuments({ status: 'Active' });

        // 4. Most Sold Product
        const topProductAgg = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $last: "$items.name" },
                    sales: { $sum: "$items.quantity" }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 1 }
        ]);

        const topProduct = topProductAgg.length > 0 ? topProductAgg[0].sales : 0;
        const topProductName = topProductAgg.length > 0 ? topProductAgg[0].name : 'N/A';

        res.json({
            success: true,
            stats: {
                totalSales,
                totalProducts,
                activeUsers,
                topProduct,
                topProductName
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get sales history for chart (Last 6 months)
// @route   GET /api/admin/analytics/sales-history
// @access  Admin
exports.getSalesHistory = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of month

        const history = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    sales: { $sum: "$pricing.total" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format for frontend (e.g., "Jan", "Feb")
        const formattedHistory = history.map(item => {
            const date = new Date();
            date.setMonth(item._id.month - 1);
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                sales: item.sales
            };
        });

        // Ensure we handle empty months if needed, but for now simple agg is fine
        res.json({ success: true, history: formattedHistory });
    } catch (error) {
        console.error('Sales History Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get daily sales history for chart (Last 30 days)
// @route   GET /api/admin/analytics/daily-sales
// @access  Admin
exports.getDailySalesHistory = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const history = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$createdAt" },
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    sales: { $sum: "$pricing.total" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Format for frontend (e.g., "Dec 25", "Dec 26")
        const formattedHistory = history.map(item => {
            const date = new Date(item._id.year, item._id.month - 1, item._id.day);
            const monthStr = date.toLocaleString('default', { month: 'short' });
            return {
                month: `${monthStr} ${item._id.day}`,
                sales: item.sales
            };
        });

        res.json({ success: true, history: formattedHistory });
    } catch (error) {
        console.error('Daily Sales History Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get top selling products
// @route   GET /api/admin/analytics/top-products
// @access  Admin
exports.getTopProducts = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $last: "$items.name" },
                    sales: { $sum: "$items.quantity" }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);

        res.json({ success: true, products: topProducts });
    } catch (error) {
        console.error('Top Products Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
