const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    originalPriceString: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    tag: {
        type: String,
        default: ''
    },
    images: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 10
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
