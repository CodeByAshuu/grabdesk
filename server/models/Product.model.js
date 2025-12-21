const mongoose = require('mongoose');

// Import allowed values for validation
const ALLOWED_CATEGORIES = [
    'Electronics', 'Fashion', 'Home & Living', 'Beauty & Personal Care',
    'Sports & Fitness', 'Books & Stationery', 'Grocery', 'Toys & Baby Products',
    'Storage', 'Furniture', 'Kitchen', 'Automotive', 'Health', 'Office Supplies'
];

const ALLOWED_BRANDS = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Puma', 'Sony',
    'LG', 'Microsoft', 'Canon', 'Dell', 'HP', 'Lenovo', 'Grabdesk'
];

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
        default: 'Electronics',
        // No enum here - allows existing products with any category
        // Validation enforced in controller for NEW products only
        index: true
    },
    // Multi-category support (NEW - for products in multiple categories)
    categories: {
        type: [String],
        default: function () {
            // Auto-populate from single category if not set
            return this.category ? [this.category] : ['Electronics'];
        }
        // No validator - allows flexibility for existing data
    },
    // Tags for Personalization
    tags: [tagSchema],
    // Product Attributes
    brand: {
        type: String,
        default: 'Grabdesk',
        // No enum - allows custom brand names
        // Case normalization handled in controller
        trim: true
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
