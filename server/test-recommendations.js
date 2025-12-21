const mongoose = require('mongoose');
const User = require('./models/User.model');
const Product = require('./models/Product.model');
const { updatePersonalizedTags } = require('./utils/recommendation.utils');
const dotenv = require('dotenv');

dotenv.config();

const testRecommendations = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('ERROR: MONGODB_URI not found in .env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);

        // 1. Find or create a test user
        let user = await User.findOne({ email: 'test_rec@example.com' });
        if (!user) {
            user = await User.create({
                name: 'Test Rec User',
                email: 'test_rec@example.com',
                passwordHash: 'dummy',
                phone: '1234567890',
                role: 'customer'
            });
        } else {
            // Clear previous tags for a clean test
            user.personalizedTags = new Map();
            await user.save();
        }

        // 2. Find some products with tags
        const furnitureProduct = await Product.findOne({ 'tags.value': 'furniture' });
        const electronicsProduct = await Product.findOne({ 'tags.value': 'electronics' });

        const furnitureTag = furnitureProduct.tags.find(t => t.value.toLowerCase() === 'furniture');
        const electronicsTag = electronicsProduct.tags.find(t => t.value.toLowerCase() === 'electronics');

        // 3. Simulate Click on Furniture (+1 score)
        await updatePersonalizedTags(user, furnitureProduct, 'CLICK');

        // 4. Simulate Wishlist on Electronics (+2 score)
        await updatePersonalizedTags(user, electronicsProduct, 'WISHLIST');

        // 5. Simulate Cart on Furniture (+3 score)
        await updatePersonalizedTags(user, furnitureProduct, 'CART');

        // Reload user
        user = await User.findById(user._id);

        // 6. Verify scores
        const furnitureScore = user.personalizedTags.get('furniture') || 0;
        const electronicsScore = user.personalizedTags.get('electronics') || 0;

        // Correct expectations based on multipliers:
        // Furniture (CLICK: 1 + CART: 3 = 4) * multiplier
        // Electronics (WISHLIST: 2) * multiplier
        const fMult = furnitureTag.type === 'attribute' ? 1 : 0.2;
        const eMult = electronicsTag.type === 'attribute' ? 1 : 0.2;

        const expectedF = 4 * fMult;
        const expectedE = 2 * eMult;

        if (Math.abs(furnitureScore - expectedF) < 0.01 && Math.abs(electronicsScore - expectedE) < 0.01) {
            console.log('--- TEST PASSED: ALL SCORES MATCH ---');
        } else {
            console.log('--- TEST FAILED: SCORES MISMATCH ---');
            console.log('F:', furnitureScore, 'E:', expectedF);
            console.log('EL:', electronicsScore, 'EE:', expectedE);
        }

        await mongoose.connection.close();
        console.log('Test complete.');
    } catch (error) {
        console.error('Test error:', error);
        process.exit(1);
    }
};

testRecommendations();
