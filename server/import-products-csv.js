const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.model');

// Load environment variables
dotenv.config();

// Generate SKU
const generateSKU = (name, category) => {
    const timestamp = Date.now().toString().slice(-6);
    const nameCode = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const categoryCode = category ? category.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X') : 'XX';
    return `${nameCode}-${categoryCode}-${timestamp}`;
};

// Parse CSV line (handles quoted fields)
const parseCSVLine = (line) => {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    return line.split(regex).map(field =>
        field.trim().replace(/^"|"$/g, '') // Remove surrounding quotes
    );
};

// Parse CSV file
const parseCSV = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        data.push(obj);
    }

    return data;
};

// Transform tags from CSV format to schema format
const transformTags = (tagsString) => {
    if (!tagsString) return [];

    const tagValues = tagsString.split(',').map(t => t.trim()).filter(t => t);
    return tagValues.map((value, index) => ({
        type: index === 0 ? 'category' : 'attribute',
        value: value,
        weight: 1
    }));
};

// Import products from CSV
const importProducts = async () => {
    try {
        console.log('🚀 Starting CSV import...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Read CSV file
        const csvPath = path.join(__dirname, 'products-bulk-upload.csv');
        console.log(`📁 Reading CSV: ${csvPath}\n`);

        const rows = parseCSV(csvPath);
        console.log(`📦 Found ${rows.length} products in CSV\n`);

        let successCount = 0;
        let skipCount = 0;
        let failCount = 0;
        const failures = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const productNum = i + 1;

            try {
                // Parse and validate
                const name = row.name?.trim();
                const category = row.category?.trim() || '';
                const basePrice = Number(row.price);
                const stock = Number(row.stock);

                if (!name || isNaN(basePrice) || isNaN(stock)) {
                    console.log(`⚠️  [${productNum}/${rows.length}] Skipped: ${name || 'Unknown'} - Invalid data`);
                    skipCount++;
                    failures.push({ row: productNum, name, error: 'Invalid data (missing name, price, or stock)' });
                    continue;
                }

                // Check for duplicate
                const duplicate = await Product.findOne({
                    name: { $regex: new RegExp(`^${name}$`, 'i') },
                    category: { $regex: new RegExp(`^${category}$`, 'i') }
                });

                if (duplicate) {
                    console.log(`⏭️  [${productNum}/${rows.length}] Skipped: "${name}" - Already exists in ${category}`);
                    skipCount++;
                    continue;
                }

                // Generate SKU
                let sku = generateSKU(name, category);
                const existingSKU = await Product.findOne({ sku });
                if (existingSKU) {
                    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
                    sku = `${sku}-${randomSuffix}`;
                }

                // Transform tags
                const tags = transformTags(row.tags);

                // Parse images (single URL from CSV)
                const images = row.images ? [row.images] : [];

                // Create product
                const productData = {
                    name,
                    description: '',
                    basePrice,
                    discountPercent: 0,
                    finalPrice: basePrice,
                    stock,
                    sku,
                    isActive: row.isActive === 'true' || row.isActive === true,
                    category,
                    tags,
                    brand: row.brand?.trim() || '',
                    model: row.model?.trim() || '',
                    color: row.color?.trim() || '',
                    material: row.material?.trim() || '',
                    sizeAvailable: [],
                    images,
                    ratingAverage: Number(row.ratingAverage) || 0,
                    ratingCount: Number(row.ratingCount) || 0
                };

                const product = await Product.create(productData);
                console.log(`✅ [${productNum}/${rows.length}] Imported: "${product.name}" (SKU: ${product.sku})`);
                successCount++;

            } catch (error) {
                console.log(`❌ [${productNum}/${rows.length}] Failed: ${row.name} - ${error.message}`);
                failCount++;
                failures.push({ row: productNum, name: row.name, error: error.message });
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 IMPORT SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Successfully imported: ${successCount}`);
        console.log(`⏭️  Skipped (duplicates):  ${skipCount}`);
        console.log(`❌ Failed:                ${failCount}`);
        console.log(`📦 Total processed:       ${rows.length}`);
        console.log('='.repeat(60));

        if (failures.length > 0) {
            console.log('\n⚠️  FAILURES:');
            failures.forEach(f => {
                console.log(`   Row ${f.row}: ${f.name} - ${f.error}`);
            });
        }

        await mongoose.connection.close();
        console.log('\n✅ MongoDB connection closed');
        console.log('\n🎉 Import complete!\n');

    } catch (error) {
        console.error('\n❌ Import failed:', error);
        process.exit(1);
    }
};

// Run import
importProducts();
