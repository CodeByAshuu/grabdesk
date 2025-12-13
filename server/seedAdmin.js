const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin123@grabdesk.in';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        // Default password for admin, should be changed or managed via env in production
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);

        await User.create({
            name: 'System Admin',
            email: adminEmail,
            passwordHash,
            phone: '0000000000',
            role: 'admin',
            profilePhotoUrl: '',
            addresses: [],
            cart: [],
            wishlist: [],
            personalizedTags: {}
        });

        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
