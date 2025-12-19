const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.model');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
    {
        name: "Nike SE",
        price: 10257,
        originalPriceString: "₹ 10,257.00",
        rating: 4.56,
        tag: "NEW DROP",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"],
        category: "Fashion",
        brand: "Nike",
        discount: 10,
        countInStock: 10
    },
    {
        name: "Nike Dunk Low Retro SE",
        price: 10257,
        originalPriceString: "₹ 10,257.00",
        rating: 4.56,
        tag: "NEW DROP",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"],
        category: "Fashion",
        brand: "Nike",
        discount: 20,
        countInStock: 10
    },
    {
        name: "Nike Dunk Low Retro",
        price: 9999,
        originalPriceString: "₹ 9,999.00",
        rating: 4.3,
        tag: "NEW DROP",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"],
        category: "Fashion",
        brand: "Nike",
        discount: 15,
        countInStock: 10
    },
    {
        name: "Nike Air Max",
        price: 12499,
        originalPriceString: "₹ 12,499.00",
        rating: 4.56,
        tag: "NEW DROP",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"],
        category: "Sports & Fitness",
        brand: "Nike",
        discount: 30,
        countInStock: 10
    },
    {
        name: "Nike Jordan 1",
        price: 15999,
        originalPriceString: "₹ 15,999.00",
        rating: 4.8,
        tag: "SALE",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"],
        category: "Fashion",
        brand: "Nike",
        discount: 50,
        countInStock: 10
    },
    {
        name: "Nike Blazer",
        price: 8499,
        originalPriceString: "₹ 8,499.00",
        rating: 4.3,
        tag: "NEW DROP",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"],
        category: "Fashion",
        brand: "Nike",
        discount: 10,
        countInStock: 10
    },
    {
        name: "Apple iPhone 15 Pro",
        price: 134900,
        originalPriceString: "₹ 134,900.00",
        rating: 4.9,
        tag: "NEW DROP",
        images: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop"],
        category: "Electronics",
        brand: "Apple",
        discount: 5,
        countInStock: 10
    },
    {
        name: "Samsung Galaxy S24",
        price: 79999,
        originalPriceString: "₹ 79,999.00",
        rating: 4.7,
        tag: "NEW DROP",
        images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop"],
        category: "Electronics",
        brand: "Samsung",
        discount: 10,
        countInStock: 10
    },
    {
        name: "Adidas Ultraboost",
        price: 14999,
        originalPriceString: "₹ 14,999.00",
        rating: 4.6,
        tag: "SALE",
        images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop"],
        category: "Sports & Fitness",
        brand: "Adidas",
        discount: 20,
        countInStock: 10
    }
];

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('Products deleted');

        await Product.insertMany(products);
        console.log('Products imported');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedProducts();
