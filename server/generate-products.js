const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Product data template
const products = [
    { name: 'Executive Leather Office Chair', category: 'Office', price: 12500, stock: 25, color: 'Black', material: 'Leather', query: 'executive office chair' },
    { name: 'Standing Desk Converter', category: 'Office', price: 8999, stock: 30, color: 'Black', material: 'Steel', query: 'standing desk' },
    { name: 'Ergonomic Mesh Office Chair', category: 'Office', price: 9500, stock: 40, color: 'Grey', material: 'Mesh', query: 'ergonomic office chair' },
    { name: 'L-Shaped Corner Desk', category: 'Office', price: 15999, stock: 15, color: 'Walnut', material: 'Wood', query: 'corner desk' },
    { name: 'Gaming Chair Pro', category: 'Office', price: 14500, stock: 20, color: 'Red', material: 'Faux Leather', query: 'gaming chair' },
    { name: 'Wooden Writing Desk', category: 'Home', price: 11999, stock: 18, color: 'Oak', material: 'Solid Wood', query: 'wooden writing desk' },
    { name: 'Adjustable Laptop Stand', category: 'Workspace', price: 2499, stock: 50, color: 'Silver', material: 'Aluminum', query: 'laptop stand' },
    { name: 'Monitor Arm Mount', category: 'Workspace', price: 3999, stock: 35, color: 'Black', material: 'Steel', query: 'monitor arm' },
    { name: 'Cable Management Box', category: 'Workspace', price: 899, stock: 60, color: 'White', material: 'Plastic', query: 'cable management' },
    { name: 'Desk Organizer Set', category: 'Workspace', price: 1499, stock: 45, color: 'Bamboo', material: 'Bamboo', query: 'desk organizer' },
    { name: 'LED Desk Lamp', category: 'Workspace', price: 3499, stock: 40, color: 'White', material: 'Metal', query: 'desk lamp' },
    { name: 'Wireless Keyboard and Mouse Combo', category: 'Workspace', price: 2999, stock: 55, color: 'Black', material: 'Plastic', query: 'wireless keyboard mouse' },
    { name: 'Ergonomic Mouse Pad', category: 'Workspace', price: 699, stock: 70, color: 'Black', material: 'Gel', query: 'ergonomic mouse pad' },
    { name: 'Footrest for Desk', category: 'Workspace', price: 1999, stock: 30, color: 'Black', material: 'Foam', query: 'footrest desk' },
    { name: 'Rolling File Cabinet', category: 'Office', price: 7999, stock: 22, color: 'Grey', material: 'Metal', query: 'file cabinet' },
    { name: 'Bookshelf 5-Tier', category: 'Home', price: 6999, stock: 28, color: 'Brown', material: 'Wood', query: 'bookshelf' },
    { name: 'Desk Storage Drawer', category: 'Office', price: 4999, stock: 35, color: 'White', material: 'Wood', query: 'desk drawer' },
    { name: 'Conference Table', category: 'Office', price: 34999, stock: 8, color: 'Mahogany', material: 'Wood', query: 'conference table' },
    { name: 'Task Chair with Wheels', category: 'Office', price: 5999, stock: 42, color: 'Blue', material: 'Fabric', query: 'task chair' },
    { name: 'Computer Desk with Hutch', category: 'Home', price: 18999, stock: 12, color: 'White', material: 'Composite Wood', query: 'computer desk hutch' },
    { name: 'Floating Wall Desk', category: 'Home', price: 8499, stock: 20, color: 'Black', material: 'MDF', query: 'floating desk' },
    { name: 'Portable Folding Desk', category: 'Workspace', price: 4499, stock: 38, color: 'Brown', material: 'Wood', query: 'folding desk' },
    { name: 'Sit-Stand Desk Electric', category: 'Office', price: 24999, stock: 10, color: 'Black', material: 'Steel', query: 'electric standing desk' },
    { name: 'Office Chair Cushion', category: 'Workspace', price: 1299, stock: 50, color: 'Grey', material: 'Memory Foam', query: 'chair cushion' },
    { name: 'Whiteboard Desktop', category: 'Office', price: 2999, stock: 35, color: 'White', material: 'Acrylic', query: 'desktop whiteboard' },
    { name: 'Desk Shelf Riser', category: 'Workspace', price: 1799, stock: 48, color: 'Bamboo', material: 'Bamboo', query: 'desk riser' },
    { name: 'Mesh Back Office Chair', category: 'Office', price: 7999, stock: 32, color: 'Black', material: 'Mesh', query: 'mesh office chair' },
    { name: 'Glass Top Desk', category: 'Office', price: 16999, stock: 14, color: 'Clear', material: 'Glass', query: 'glass desk' },
    { name: 'Industrial Desk', category: 'Home', price: 13999, stock: 16, color: 'Brown', material: 'Metal Wood', query: 'industrial desk' },
    { name: 'Kids Study Desk', category: 'Home', price: 6499, stock: 25, color: 'Pink', material: 'Plastic', query: 'kids study desk' },
    { name: 'Executive Mahogany Desk', category: 'Office', price: 29999, stock: 6, color: 'Mahogany', material: 'Hardwood', query: 'executive desk' },
    { name: 'Minimalist White Desk', category: 'Home', price: 9999, stock: 22, color: 'White', material: 'MDF', query: 'minimalist desk' },
    { name: 'Vintage Writing Desk', category: 'Home', price: 17999, stock: 10, color: 'Cherry', material: 'Solid Wood', query: 'vintage desk' },
    { name: 'Reception Desk', category: 'Office', price: 44999, stock: 5, color: 'White', material: 'Laminate', query: 'reception desk' },
    { name: 'Drafting Table Adjustable', category: 'Workspace', price: 12999, stock: 18, color: 'Black', material: 'Steel', query: 'drafting table' },
    { name: 'Corner Computer Workstation', category: 'Office', price: 14999, stock: 15, color: 'Espresso', material: 'Wood', query: 'corner workstation' },
    { name: 'Compact Study Table', category: 'Home', price: 5999, stock: 30, color: 'Beige', material: 'Engineered Wood', query: 'compact study table' },
    { name: 'Office Chair Lumbar Support', category: 'Office', price: 11999, stock: 28, color: 'Black', material: 'Leather', query: 'lumbar support chair' },
    { name: 'Mobile Standing Desk', category: 'Workspace', price: 7499, stock: 24, color: 'White', material: 'Metal', query: 'mobile desk' },
    { name: 'Triple Monitor Stand', category: 'Workspace', price: 5999, stock: 20, color: 'Black', material: 'Aluminum', query: 'triple monitor stand' },
    { name: 'Drawer Pedestal Mobile', category: 'Office', price: 6499, stock: 26, color: 'Grey', material: 'Steel', query: 'mobile pedestal' },
    { name: 'Plant Stand for Desk', category: 'Workspace', price: 1299, stock: 40, color: 'Wood', material: 'Bamboo', query: 'desk plant stand' },
    { name: 'Printer Stand with Storage', category: 'Office', price: 3999, stock: 32, color: 'Black', material: 'Wood', query: 'printer stand' },
    { name: 'Adjustable Height Stool', category: 'Workspace', price: 4999, stock: 35, color: 'Grey', material: 'Fabric', query: 'adjustable stool' },
    { name: 'Corner Shelf Unit', category: 'Home', price: 4499, stock: 28, color: 'White', material: 'Wood', query: 'corner shelf' },
    { name: 'Desk Mat Extended', category: 'Workspace', price: 1999, stock: 45, color: 'Black', material: 'PU Leather', query: 'desk mat' },
    { name: 'Document Holder Stand', category: 'Workspace', price: 899, stock: 50, color: 'Black', material: 'Plastic', query: 'document holder' },
    { name: 'Dual Monitor Desk Mount', category: 'Workspace', price: 4999, stock: 30, color: 'Silver', material: 'Aluminum', query: 'dual monitor mount' },
    { name: 'USB Desk Hub', category: 'Workspace', price: 1499, stock: 55, color: 'Black', material: 'Plastic', query: 'usb hub desk' },
    { name: 'Acoustic Desk Divider', category: 'Office', price: 8999, stock: 15, color: 'Grey', material: 'Fabric', query: 'desk divider' }
];

async function fetchUnsplashImage(query, index) {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: query,
                per_page: 1,
                page: 1,
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            const photo = response.data.results[0];
            return `https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=800&q=80&utm_source=grabdesk`;
        } else {
            // Fallback to a generic office/furniture image
            return `https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80&utm_source=grabdesk`;
        }
    } catch (error) {
        console.error(`Error fetching image for ${query}:`, error.message);
        return `https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80&utm_source=grabdesk`;
    }
}

function generateTags(category, color, material) {
    const baseTags = ['furniture', 'grabdesk'];
    const categoryTag = category.toLowerCase();
    const materialTag = material.toLowerCase().replace(/\s+/g, '-');
    const colorTag = color.toLowerCase();

    return [...baseTags, categoryTag, materialTag, colorTag].join(',');
}

function randomRating() {
    return (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
}

function randomRatingCount() {
    return Math.floor(Math.random() * (500 - 50) + 50);
}

async function generateCSV() {
    console.log('🖼️  Fetching Unsplash images for 50 products...\n');

    const csvRows = [];
    const header = 'name,price,stock,isActive,category,tags,brand,model,color,material,sizeAvailable,images,ratingAverage,ratingCount';
    csvRows.push(header);

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(`[${i + 1}/50] Fetching: ${product.name}...`);

        const imageUrl = await fetchUnsplashImage(product.query, i);
        const tags = generateTags(product.category, product.color, product.material);
        const ratingAvg = randomRating();
        const ratingCnt = randomRatingCount();

        // CSV row - note: images is just the URL string, tags are comma-separated
        const row = [
            `"${product.name}"`,
            product.price,
            product.stock,
            'true',
            product.category,
            `"${tags}"`,
            'Grabdesk',
            '""', // model - empty
            product.color,
            product.material,
            '""', // sizeAvailable - empty array
            `"${imageUrl}"`,
            ratingAvg,
            ratingCnt
        ].join(',');

        csvRows.push(row);

        // Rate limit: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const csvContent = csvRows.join('\n');
    fs.writeFileSync('products-bulk-upload.csv', csvContent);
    console.log('\n✅ CSV file generated: products-bulk-upload.csv');
    console.log(`📦 Total products: ${products.length}`);
}

// Run the script
if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ UNSPLASH_ACCESS_KEY not found in environment variables');
    console.error('   Please add UNSPLASH_ACCESS_KEY to your .env file');
    process.exit(1);
}

generateCSV().catch(error => {
    console.error('❌ Error generating CSV:', error);
    process.exit(1);
});
