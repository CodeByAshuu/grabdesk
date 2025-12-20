const mongoose = require('mongoose');
const Product = require('./models/Product.model');
require('dotenv').config({ path: './.env' });

const deduplicate = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Fetching all products...');
        const products = await Product.find({}).sort({ createdAt: -1 }); // Newest first

        const seen = new Set();
        const duplicates = [];

        // Identify duplicates (keep newest)
        for (const p of products) {
            const key = `${p.name.trim().toLowerCase()}|${p.category.trim().toLowerCase()}`;
            if (seen.has(key)) {
                duplicates.push(p._id);
            } else {
                seen.add(key);
            }
        }

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicates. Deleting...`);
            await Product.deleteMany({ _id: { $in: duplicates } });
            console.log('✅ Duplicates removed successfully.');
        } else {
            console.log('✅ No duplicates found.');
        }

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
};

deduplicate();
