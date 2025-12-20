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
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0;

        // 2. Total Products (Inventory Count)
        const totalProducts = await Product.countDocuments();

        // 3. Active Users
        const activeUsers = await User.countDocuments({ status: 'Active' });

        // 4. Low Stock Items (Threshold < 5)
        const lowStock = await Product.countDocuments({ stock: { $lt: 5 } });

        res.json({
            success: true,
            stats: {
                totalSales,
                totalProducts,
                activeUsers,
                lowStock
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
                    sales: { $sum: "$total" }
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
                    _id: "$items.productId",
                    name: { $first: "$items.name" }, // Assuming name is stored in items
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
