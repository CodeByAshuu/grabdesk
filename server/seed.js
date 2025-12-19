const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.model');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany({});
        console.log('🧹 Cleared existing products.');

        // 2. Create Products
        const productsData = [
            {
                name: "Solid Wood Study Desk",
                description: "Minimalist wooden desk ideal for home offices. Crafted from high-quality timber with a smooth finish.",
                basePrice: 12999,
                discountPercent: 15,
                stock: 25,
                sku: "DSK-WD-001",
                category: "Office",
                tags: [
                    { type: "category", value: "office", weight: 5 },
                    { type: "attribute", value: "wooden", weight: 4 },
                    { type: "usage", value: "study", weight: 3 },
                    { type: "attribute", value: "minimalist", weight: 2 }
                ],
                brand: "Grabdesk",
                material: "Solid Wood",
                color: "Walnut Brown",
                images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.5,
                ratingCount: 38,
                isActive: true
            },
            {
                name: "Ergonomic Office Chair",
                description: "High-back mesh chair with lumbar support and adjustable armrests for long working hours.",
                basePrice: 15499,
                discountPercent: 10,
                stock: 50,
                sku: "CHR-ERG-002",
                category: "Office",
                tags: [
                    { type: "category", value: "office", weight: 5 },
                    { type: "attribute", value: "ergonomic", weight: 5 },
                    { type: "usage", value: "work", weight: 4 },
                    { type: "attribute", value: "mesh", weight: 2 }
                ],
                brand: "ErgoLife",
                material: "Mesh & Plastic",
                color: "Black",
                images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.7,
                ratingCount: 120,
                isActive: true
            },
            {
                name: "Modern Table Lamp",
                description: "Sleek LED desk lamp with adjustable brightness and color temperature.",
                basePrice: 2499,
                discountPercent: 5,
                stock: 100,
                sku: "LMP-LED-003",
                category: "Accessories",
                tags: [
                    { type: "category", value: "lighting", weight: 4 },
                    { type: "usage", value: "desk", weight: 3 },
                    { type: "attribute", value: "modern", weight: 2 }
                ],
                brand: "Lumiere",
                material: "Aluminum",
                color: "Silver",
                images: ["https://images.unsplash.com/photo-1534281303263-4416339c3b08?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.3,
                ratingCount: 45,
                isActive: true
            },
            {
                name: "Leather Desk Pad",
                description: "Premium vegan leather desk mat to protect your surface and improve mouse tracking.",
                basePrice: 1299,
                discountPercent: 0,
                stock: 200,
                sku: "ACC-MAT-004",
                category: "Accessories",
                tags: [
                    { type: "category", value: "accessory", weight: 3 },
                    { type: "attribute", value: "leather", weight: 4 },
                    { type: "usage", value: "protection", weight: 2 }
                ],
                brand: "Grabdesk",
                material: "Vegan Leather",
                color: "Tan",
                images: ["https://images.unsplash.com/photo-1626218174358-77b7f9a46058?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.8,
                ratingCount: 89,
                isActive: true
            },
            {
                name: "Mechanical Keyboard",
                description: "RGB mechanical keyboard with tactile switches for the ultimate typing experience.",
                basePrice: 6999,
                discountPercent: 20,
                stock: 30,
                sku: "ELC-KBD-005",
                category: "Electronics",
                tags: [
                    { type: "category", value: "electronics", weight: 5 },
                    { type: "attribute", value: "mechanical", weight: 4 },
                    { type: "usage", value: "gaming", weight: 3 }
                ],
                brand: "KeyMaster",
                material: "Plastic & Metal",
                color: "White",
                images: ["https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.9,
                ratingCount: 210,
                isActive: true
            },
            {
                name: "Wireless Mouse",
                description: "Ergonomic wireless mouse with high precision sensor and long battery life.",
                basePrice: 1999,
                discountPercent: 15,
                stock: 80,
                sku: "ELC-MSE-006",
                category: "Electronics",
                tags: [
                    { type: "category", value: "electronics", weight: 5 },
                    { type: "attribute", value: "wireless", weight: 3 },
                    { type: "usage", value: "productivity", weight: 3 }
                ],
                brand: "TechGear",
                material: "Plastic",
                color: "Black",
                images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.4,
                ratingCount: 65,
                isActive: true
            },
            {
                name: "Ceramic Plant Pot",
                description: "Minimalist white ceramic pot for indoor plants to add greenery to your desk.",
                basePrice: 599,
                discountPercent: 0,
                stock: 150,
                sku: "HOM-POT-007",
                category: "Home",
                tags: [
                    { type: "category", value: "decor", weight: 4 },
                    { type: "attribute", value: "ceramic", weight: 3 },
                    { type: "usage", value: "plant", weight: 2 }
                ],
                brand: "GreenSpace",
                material: "Ceramic",
                color: "White",
                images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.6,
                ratingCount: 32,
                isActive: true
            },
            {
                name: "Noise Cancelling Headphones",
                description: "Over-ear headphones with active noise cancellation for deep focus.",
                basePrice: 18999,
                discountPercent: 25,
                stock: 40,
                sku: "ELC-HDP-008",
                category: "Electronics",
                tags: [
                    { type: "category", value: "electronics", weight: 5 },
                    { type: "attribute", value: "wireless", weight: 3 },
                    { type: "usage", value: "music", weight: 4 }
                ],
                brand: "SoundWave",
                material: "Plastic & Foam",
                color: "Midnight Blue",
                images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.8,
                ratingCount: 150,
                isActive: true
            },
            {
                name: "Bookshelf Speaker",
                description: "Compact bookshelf speakers delivering rich and clear sound.",
                basePrice: 8500,
                discountPercent: 10,
                stock: 20,
                sku: "ELC-SPK-009",
                category: "Electronics",
                tags: [
                    { type: "category", value: "electronics", weight: 4 },
                    { type: "usage", value: "audio", weight: 4 },
                    { type: "attribute", value: "wood", weight: 2 }
                ],
                brand: "AudioPro",
                material: "Wood & Fabric",
                color: "Oak",
                images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.5,
                ratingCount: 28,
                isActive: true
            },
            {
                name: "Laptop Stand",
                description: "Aluminum laptop stand to raise your screen to eye level and improve posture.",
                basePrice: 1800,
                discountPercent: 5,
                stock: 90,
                sku: "ACC-STD-010",
                category: "Accessories",
                tags: [
                    { type: "category", value: "accessory", weight: 3 },
                    { type: "usage", value: "ergonomics", weight: 5 },
                    { type: "attribute", value: "metal", weight: 3 }
                ],
                brand: "ErgoLife",
                material: "Aluminum",
                color: "Space Grey",
                images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.7,
                ratingCount: 200,
                isActive: true
            },
            {
                name: "Nike Air Max",
                description: "Classic running shoes with air cushioning for maximum comfort.",
                basePrice: 12499,
                discountPercent: 30,
                stock: 15,
                sku: "FSH-SHS-011",
                category: "Fashion",
                tags: [
                    { type: "category", value: "fashion", weight: 5 },
                    { type: "usage", value: "sports", weight: 4 },
                    { type: "attribute", value: "comfortable", weight: 3 }
                ],
                brand: "Nike",
                material: "Synthetic",
                color: "White/Red",
                images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.6,
                ratingCount: 300,
                isActive: true
            },
            {
                name: "Cotton T-Shirt",
                description: "Premium 100% cotton t-shirt, breathable and soft.",
                basePrice: 999,
                discountPercent: 0,
                stock: 500,
                sku: "FSH-TSH-012",
                category: "Fashion",
                tags: [
                    { type: "category", value: "fashion", weight: 5 },
                    { type: "usage", value: "casual", weight: 4 },
                    { type: "attribute", value: "cotton", weight: 3 }
                ],
                brand: "Basics",
                material: "Cotton",
                color: "White",
                images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.2,
                ratingCount: 150,
                isActive: true
            },
            // Adding more products to reach > 21 for pagination testing
            {
                name: "Smart Watch",
                description: "Fitness tracker and smart watch with heart rate monitor.",
                basePrice: 4999,
                discountPercent: 10,
                stock: 60,
                sku: "ELC-WTC-013",
                category: "Electronics",
                tags: [
                    { type: "category", value: "electronics", weight: 5 },
                    { type: "usage", value: "fitness", weight: 4 }
                ],
                brand: "TechGear",
                material: "Silicone",
                color: "Black",
                images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.5,
                ratingCount: 88,
                isActive: true
            },
            {
                name: "Bluetooth Speaker",
                description: "Portable bluetooth speaker with 360 degree sound.",
                basePrice: 3499,
                discountPercent: 5,
                stock: 45,
                sku: "ELC-SPK-014",
                category: "Electronics",
                tags: [
                    { type: "category", value: "electronics", weight: 4 },
                    { type: "usage", value: "music", weight: 4 }
                ],
                brand: "SoundWave",
                material: "Plastic",
                color: "Blue",
                images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.3,
                ratingCount: 55,
                isActive: true
            },
            {
                name: "Running Shoes",
                description: "Lightweight running shoes for daily jogging.",
                basePrice: 2999,
                discountPercent: 15,
                stock: 100,
                sku: "FSH-SHS-015",
                category: "Fashion",
                tags: [
                    { type: "category", value: "fashion", weight: 5 },
                    { type: "usage", value: "sports", weight: 4 }
                ],
                brand: "Sporty",
                material: "Mesh",
                color: "Grey",
                images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.1,
                ratingCount: 40,
                isActive: true
            },
            {
                name: "Denim Jacket",
                description: "Classic blue denim jacket for a casual look.",
                basePrice: 3999,
                discountPercent: 0,
                stock: 30,
                sku: "FSH-JKT-016",
                category: "Fashion",
                tags: [
                    { type: "category", value: "fashion", weight: 5 },
                    { type: "usage", value: "casual", weight: 4 }
                ],
                brand: "DenimCo",
                material: "Denim",
                color: "Blue",
                images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.7,
                ratingCount: 90,
                isActive: true
            },
            {
                name: "Office Desk Organizer",
                description: "Keep your desk clutter-free with this multi-compartment organizer.",
                basePrice: 899,
                discountPercent: 0,
                stock: 120,
                sku: "ACC-ORG-017",
                category: "Accessories",
                tags: [
                    { type: "category", value: "accessory", weight: 3 },
                    { type: "usage", value: "organization", weight: 5 }
                ],
                brand: "Grabdesk",
                material: "Plastic",
                color: "White",
                images: ["https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.4,
                ratingCount: 25,
                isActive: true
            },
            {
                name: "Monitor Stand",
                description: "Wooden monitor stand with storage underneath.",
                basePrice: 2499,
                discountPercent: 10,
                stock: 50,
                sku: "ACC-STD-018",
                category: "Accessories",
                tags: [
                    { type: "category", value: "accessory", weight: 3 },
                    { type: "usage", value: "organization", weight: 4 }
                ],
                brand: "Grabdesk",
                material: "Wood",
                color: "Oak",
                images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.6,
                ratingCount: 60,
                isActive: true
            },
            {
                name: "Wall Art Frame",
                description: "Abstract wall art frame to decorate your office walls.",
                basePrice: 1499,
                discountPercent: 0,
                stock: 40,
                sku: "HOM-ART-019",
                category: "Home",
                tags: [
                    { type: "category", value: "decor", weight: 4 },
                    { type: "usage", value: "decoration", weight: 3 }
                ],
                brand: "ArtHouse",
                material: "Wood & Canvas",
                color: "Multicolor",
                images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.5,
                ratingCount: 35,
                isActive: true
            },
            {
                name: "Throw Pillow",
                description: "Soft throw pillow for your office sofa or chair.",
                basePrice: 799,
                discountPercent: 0,
                stock: 80,
                sku: "HOM-PLW-020",
                category: "Home",
                tags: [
                    { type: "category", value: "decor", weight: 3 },
                    { type: "usage", value: "comfort", weight: 4 }
                ],
                brand: "CozyHome",
                material: "Cotton",
                color: "Grey",
                images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.3,
                ratingCount: 45,
                isActive: true
            },
            {
                name: "Desk Clock",
                description: "Minimalist digital desk clock.",
                basePrice: 1299,
                discountPercent: 5,
                stock: 60,
                sku: "ACC-CLK-021",
                category: "Accessories",
                tags: [
                    { type: "category", value: "accessory", weight: 3 },
                    { type: "usage", value: "time", weight: 5 }
                ],
                brand: "TimeKeeper",
                material: "Plastic",
                color: "Black",
                images: ["https://images.unsplash.com/photo-1563861826100-9cb868c72876?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.4,
                ratingCount: 50,
                isActive: true
            },
            {
                name: "Water Bottle",
                description: "Insulated stainless steel water bottle.",
                basePrice: 999,
                discountPercent: 0,
                stock: 100,
                sku: "ACC-BTL-022",
                category: "Accessories",
                tags: [
                    { type: "category", value: "accessory", weight: 3 },
                    { type: "usage", value: "hydration", weight: 5 }
                ],
                brand: "Hydro",
                material: "Steel",
                color: "Silver",
                images: ["https://images.unsplash.com/photo-1602143407151-011141950038?auto=format&fit=crop&w=1000&q=80"],
                ratingAverage: 4.7,
                ratingCount: 110,
                isActive: true
            }
        ];

        // Calculate finalPrice for each product
        const productsWithFinalPrice = productsData.map(product => ({
            ...product,
            finalPrice: product.basePrice - (product.basePrice * (product.discountPercent / 100))
        }));

        await Product.insertMany(productsWithFinalPrice);
        console.log(`✅ Created ${productsWithFinalPrice.length} products with calculated final prices.`);

        console.log('🎉 Seed data imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
