const mongoose = require('mongoose');
const Order = require('./models/Order.model');
const User = require('./models/User.model');
require('dotenv').config({ path: './.env' });

const verifyOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Fetching orders...');
        const orders = await Order.find({})
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        console.log(`Found ${orders.length} orders.`);

        const normalizedOrders = orders.map(order => {
            const frontendStatus = order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown';
            return {
                id: order._id.toString(),
                total: order.total
            };
        });

        console.log('Successfully normalized orders:', normalizedOrders.length);
        process.exit(0);
    } catch (e) {
        console.error('ERROR reproduce:', e);
        process.exit(1);
    }
};

verifyOrders();
