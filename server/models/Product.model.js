const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['category', 'attribute', 'usage'],
        required: true
    },
    value: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        default: 1
    }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    // Pricing Structure
    basePrice: {
        type: Number,
        required: true
    },
    discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    finalPrice: {
        type: Number,
        required: true
    },
    // Inventory & Identification
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined to not conflict if not set
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Categorization
    category: {
        type: String,
        default: '',
        index: true
    },
    // Tags for Personalization
    tags: [tagSchema],
    // Product Attributes
    brand: {
        type: String,
        default: ''
    },
    model: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    material: {
        type: String,
        default: ''
    },
    sizeAvailable: {
        type: [String],
        default: []
    },
    // Media
    images: {
        type: [String],
        default: []
    },
    // Ratings
    ratingAverage: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Pre-save hook to calculate finalPrice if not explicitly set (though seed should set it)
productSchema.pre('save', function (next) {
    if (this.isModified('basePrice') || this.isModified('discountPercent')) {
        this.finalPrice = this.basePrice - (this.basePrice * (this.discountPercent / 100));
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
