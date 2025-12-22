const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'moderator'],
        default: 'customer'
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked'],
        default: 'Active'
    },
    profilePhotoUrl: {
        type: String,
        default: ''
    },
    cloudinaryPublicId: {
        type: String,
        default: ''
    },
    addresses: {
        type: [Object],
        default: []
    },
    cart: {
        type: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 },
                size: { type: String, default: '' },
                color: { type: String, default: '' }
            }
        ],
        default: []
    },
    wishlist: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        default: []
    },
    personalizedTags: {
        type: Map,
        of: Number,
        default: {}
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            read: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
