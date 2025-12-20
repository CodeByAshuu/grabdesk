const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    productCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
