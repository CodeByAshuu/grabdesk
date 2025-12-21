const mongoose = require('mongoose');
const Product = require('./models/Product.model');
require('dotenv').config({ path: './.env' });

const verifyCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const totalProducts = await Product.countDocuments();
        const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });

        console.log('--- VERIFICATION RESULTS ---');
        console.log(`Total Products in DB: ${totalProducts}`);
        console.log(`Low Stock Products (<10): ${lowStock}`);

        // List a few low stock items to see why
        if (lowStock > 0) {
            const examples = await Product.find({ stock: { $lt: 10 } }).limit(5).select('name stock');
            console.log('Sample Low Stock Items:', examples);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

verifyCounts();
