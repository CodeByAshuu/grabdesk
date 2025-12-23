const Product = require('../models/Product.model');
const { processProductImages } = require('../utils/cloudinary');
const { resolveProductCategories } = require('../utils/categoryMapper');
const { updatePersonalizedTags } = require('../utils/recommendation.utils');

// Helper function to generate SKU
const generateSKU = (name, category) => {
    const timestamp = Date.now().toString().slice(-6);
    const nameCode = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const categoryCode = category ? category.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X') : 'XX';
    return `${nameCode}-${categoryCode}-${timestamp}`;
};

// Helper function to normalize brand names (capitalize properly)
const normalizeBrandName = (brandInput) => {
    if (!brandInput) return 'Grabdesk';

    const trimmed = brandInput.trim();
    if (!trimmed) return 'Grabdesk';

    // Common brand names (case-insensitive mapping to proper case)
    const knownBrands = {
        'apple': 'Apple',
        'samsung': 'Samsung',
        'nike': 'Nike',
        'adidas': 'Adidas',
        'puma': 'Puma',
        'sony': 'Sony',
        'lg': 'LG',
        'microsoft': 'Microsoft',
        'canon': 'Canon',
        'dell': 'Dell',
        'hp': 'HP',
        'lenovo': 'Lenovo',
        'grabdesk': 'Grabdesk'
    };

    const lowerBrand = trimmed.toLowerCase();

    // If it's a known brand, return proper case
    if (knownBrands[lowerBrand]) {
        return knownBrands[lowerBrand];
    }

    // For new/custom brands, capitalize first letter of each word
    return trimmed
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

exports.getProducts = async (req, res) => {
    try {
        const pageSize = 27; // Products per page
        const page = Number(req.query.pageNumber) || 1;

        // Enhanced search: searches name, tags, brand, category AND categories array
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { 'tags.value': { $regex: req.query.keyword, $options: 'i' } },
                    { brand: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } },
                    { categories: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .sort({ createdAt: -1 })  // Sort newest first
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        // Enrich products with resolved categories (runtime only, non-destructive)
        const enrichedProducts = products.map(p => {
            const productObj = p.toObject();
            const resolved = resolveProductCategories(p);
            return {
                ...productObj,
                resolvedCategories: resolved.all,
                primaryCategory: resolved.primary,
                categoryHierarchy: resolved.hierarchy
            };
        });

        res.json({ products: enrichedProducts, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Update personalized tags on click (low intent)
            // We don't await here to avoid blocking the response
            if (req.user) {
                const User = require('../models/User.model');
                User.findById(req.user.id).then(user => {
                    if (user) updatePersonalizedTags(user, product, 'CLICK');
                }).catch(err => console.error('Personalization error:', err));
            }

            res.json(product);
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add a new product (Admin)
// @route   POST /api/admin/products
// @access  Admin
exports.addProduct = async (req, res) => {
    try {
        // Frontend payload structure from AddProductForm:
        // { name, category, description, basePrice, discountPercent, finalPrice, stock, brand, model, color, material, tags, sizeAvailable, images }
        const {
            name, category, description, basePrice, discountPercent, finalPrice,
            stock, brand, model, color, material, tags, sizeAvailable, images
        } = req.body;

        // Validation: Check required fields from frontend
        if (!name || basePrice === undefined || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, basePrice, and stock are required'
            });
        }

        // Validate category (must be from allowed list)
        const ALLOWED_CATEGORIES = [
            'Electronics', 'Fashion', 'Home & Living', 'Beauty & Personal Care',
            'Sports & Fitness', 'Books & Stationery', 'Grocery', 'Toys & Baby Products',
            'Storage', 'Furniture', 'Kitchen', 'Automotive', 'Health', 'Office Supplies'
        ];
        const trimmedCategory = category?.trim() || 'Electronics';
        if (!ALLOWED_CATEGORIES.includes(trimmedCategory)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`
            });
        }

        // Brand validation - ALLOWED_BRANDS are suggestions, but any brand is accepted
        const SUGGESTED_BRANDS = [
            'Apple', 'Samsung', 'Nike', 'Adidas', 'Puma', 'Sony',
            'LG', 'Microsoft', 'Canon', 'Dell', 'HP', 'Lenovo', 'Grabdesk'
        ];
        // No validation - any brand is allowed, will be normalized below


        // Validate and prepare name
        const trimmedName = name.trim();
        if (!trimmedName) {
            return res.status(400).json({
                success: false,
                message: 'Product name cannot be empty'
            });
        }

        // Normalize brand name (handles case-insensitive matching and new brands)
        const normalizedBrand = normalizeBrandName(brand);

        // Generate SKU
        const finalSku = generateSKU(trimmedName, trimmedCategory);

        // Validate basePrice
        const basePriceNum = Number(basePrice);
        if (isNaN(basePriceNum) || basePriceNum <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price value. Price must be a positive number.'
            });
        }

        // Validate stock
        const stockNumber = Number(stock);
        if (isNaN(stockNumber) || stockNumber < 0) {
            return res.status(400).json({ success: false, message: 'Invalid stock quantity' });
        }

        // Calculate finalPrice from basePrice and discountPercent
        const discountPercentNum = Number(discountPercent) || 0;
        const calculatedFinalPrice = basePriceNum - (basePriceNum * (discountPercentNum / 100));

        // PROCESS IMAGES: Upload base64 to Cloudinary, keep URLs as-is
        let processedImages = [];
        try {
            processedImages = await processProductImages(images);
        } catch (error) {
            console.error('Image processing error:', error);
            // FAIL SAFE: If image upload fails, do NOT save the product with raw base64.
            // Return 500 so frontend knows it failed.
            return res.status(500).json({
                success: false,
                message: 'Failed to upload images. Please try again.'
            });
        }

        // Transform tags from string array to schema format
        let transformedTags = [];
        if (tags && Array.isArray(tags)) {
            transformedTags = tags.map((tagValue, index) => {
                // If already in schema format, use as-is
                if (typeof tagValue === 'object' && tagValue.value) {
                    return tagValue;
                }
                // Transform string to schema format
                return {
                    type: index === 0 ? 'category' : 'attribute',
                    value: typeof tagValue === 'string' ? tagValue : String(tagValue),
                    weight: 1
                };
            });
        }

        // Auto-populate categories array if not provided (non-destructive)
        let productCategories = req.body.categories || [];
        if (!productCategories || productCategories.length === 0) {
            // Use single category as fallback
            productCategories = trimmedCategory ? [trimmedCategory] : ['Electronics'];
        }

        // Create product document matching MongoDB schema
        const productData = {
            name: trimmedName,
            description: description?.trim() || '',
            basePrice: basePriceNum,
            discountPercent: discountPercentNum,
            finalPrice: calculatedFinalPrice,
            stock: stockNumber,
            sku: finalSku,
            isActive: true,
            category: trimmedCategory, // Keep existing single category field
            categories: productCategories, // Populate multi-category field
            images: processedImages, // Cloudinary URLs or original URLs
            tags: transformedTags,
            brand: normalizedBrand, // Normalized brand name
            model: model?.trim() || '',
            color: color?.trim() || '',
            material: material?.trim() || '',
            sizeAvailable: sizeAvailable || [],
            ratingAverage: 0,
            ratingCount: 0
        };

        // Save to database
        const product = new Product(productData);
        const savedProduct = await product.save();

        // Emit activity log
        const io = req.app.get('io');
        if (io) {
            io.of('/activity').emit('newLog', {
                message: `Product "${savedProduct.name}" added to inventory`,
                type: 'product',
                time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            });
        }

        // Return success with saved document

        if (io) {
            io.emit('product:created', {
                productId: savedProduct._id,
                category: savedProduct.category
            });
        }

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: savedProduct
        });

    } catch (error) {
        console.error('Add Product Error:', error);

        // Handle duplicate SKU error (code 11000)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Product SKU already exists. Please try again.'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: 'Server error while adding product. Please try again.'
        });
    }
};

// @desc    Bulk create products (Admin)
// @route   POST /api/admin/products/bulk
// @access  Admin
exports.bulkCreateProducts = async (req, res) => {
    try {
        const { products } = req.body;

        console.log('Bulk upload request received');
        console.log('Products array:', products ? `${products.length} items` : 'undefined/null');

        if (!products || !Array.isArray(products) || products.length === 0) {
            console.error('Bulk upload failed: No products provided');
            console.error('Received req.body:', JSON.stringify(req.body).substring(0, 200));
            return res.status(400).json({
                success: false,
                message: 'No products provided. Please provide an array of products.'
            });
        }

        const validProducts = [];
        const failures = [];

        for (let i = 0; i < products.length; i++) {
            const row = products[i];

            try {
                const name = row.name?.toString().trim();
                const category = row.category?.toString().trim() || '';
                const description = row.description?.toString().trim() || '';
                const priceValue = row.basePrice || row.price;
                const basePrice = Number(priceValue);
                const stock = Number(row.stock);
                const discountPercent = Number(row.discountPercent || 0);

                if (!name) {
                    console.log(`Row ${i + 1}: Missing name`);
                    failures.push({ row: i + 1, data: row, error: 'Missing required field: name' });
                    continue;
                }

                if (isNaN(basePrice) || basePrice <= 0) {
                    console.log(`Row ${i + 1}: Invalid price for "${name}"`, priceValue);
                    failures.push({ row: i + 1, data: row, error: 'Invalid or missing price. Price must be a positive number.' });
                    continue;
                }

                if (isNaN(stock) || stock < 0) {
                    console.log(`Row ${i + 1}: Invalid stock for "${name}"`, row.stock);
                    failures.push({ row: i + 1, data: row, error: 'Invalid or missing stock. Stock must be a non-negative number.' });
                    continue;
                }

                if (discountPercent < 0 || discountPercent > 100) {
                    console.log(`Row ${i + 1}: Invalid discount for "${name}"`, discountPercent);
                    failures.push({ row: i + 1, data: row, error: 'Invalid discount percent. Must be between 0 and 100.' });
                    continue;
                }

                let sku = row.sku?.toString().trim();
                if (!sku) {
                    sku = generateSKU(name, category);
                    const existingSKU = await Product.findOne({ sku });
                    if (existingSKU) {
                        const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
                        sku = `${sku}-${randomSuffix}`;
                    }
                }

                const finalPrice = basePrice - (basePrice * (discountPercent / 100));

                // Transform tags from CSV format to schema format
                let tags = [];
                if (row.tags) {
                    const tagStrings = Array.isArray(row.tags)
                        ? row.tags
                        : row.tags.toString().split(',').map(t => t.trim()).filter(t => t);

                    // Convert to tag schema format: { type, value, weight }
                    tags = tagStrings.map((tagValue, index) => ({
                        type: index === 0 ? 'category' : 'attribute',
                        value: tagValue,
                        weight: 1
                    }));
                }

                let sizeAvailable = [];
                if (row.sizeAvailable) {
                    sizeAvailable = Array.isArray(row.sizeAvailable) ? row.sizeAvailable : row.sizeAvailable.toString().split(',').map(s => s.trim()).filter(s => s);
                }

                let images = [];
                if (row.images) {
                    images = Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? [row.images] : []);
                }

                // Handle rating fields with proper defaults
                const ratingAverage = row.ratingAverage ? Number(row.ratingAverage) : 0;
                const ratingCount = row.ratingCount ? Number(row.ratingCount) : 0;

                // Auto-populate categories array from category if not provided
                let productCategories = row.categories || [];
                if (!productCategories || productCategories.length === 0) {
                    productCategories = category ? [category] : ['Electronics'];
                }

                const productData = {
                    name, description, basePrice, discountPercent, finalPrice, stock, sku,
                    isActive: row.isActive !== undefined ? (row.isActive === true || row.isActive === 'true') : true,
                    category,
                    categories: productCategories,
                    tags,
                    brand: row.brand?.toString().trim() || '',
                    model: row.model?.toString().trim() || '',
                    color: row.color?.toString().trim() || '',
                    material: row.material?.toString().trim() || '',
                    sizeAvailable, images,
                    ratingAverage, ratingCount
                };

                validProducts.push(productData);

            } catch (error) {
                console.error(`Row ${i + 1} processing error:`, error.message);
                console.error('Row data:', JSON.stringify(row).substring(0, 150));
                failures.push({ row: i + 1, data: row, error: error.message || 'Unknown error processing this row' });
            }
        }

        console.log(`Validation complete: ${validProducts.length} valid, ${failures.length} failed`);
        if (failures.length > 0) {
            console.log('Failures:', JSON.stringify(failures, null, 2));
        }

        let insertedProducts = [];
        if (validProducts.length > 0) {
            console.log(`Attempting to insert ${validProducts.length} products into database...`);
            try {
                insertedProducts = await Product.insertMany(validProducts, { ordered: false });
                console.log(`Successfully inserted ${insertedProducts.length} products`);
            } catch (error) {
                console.error('Database insertion error:', error.message);
                console.error('Error name:', error.name);
                if (error.writeErrors) {
                    console.log(`Write errors occurred: ${error.writeErrors.length} errors`);
                    insertedProducts = error.insertedDocs || [];
                    error.writeErrors.forEach(writeError => {
                        const failedProduct = validProducts[writeError.index];
                        console.error(`Failed to insert product at index ${writeError.index}:`, writeError.errmsg);
                        failures.push({ row: writeError.index + 1, data: failedProduct, error: writeError.errmsg || 'Database write error' });
                    });
                } else {
                    console.error('Full error:', error);
                    throw error;
                }
            }
        }

        console.log(`Insert complete: ${insertedProducts.length} inserted, ${failures.length} total failures`);

        const totalRows = products.length;
        const successCount = insertedProducts.length;
        const failedCount = failures.length;

        let statusCode = 201;
        let message = 'Bulk upload completed successfully';

        if (successCount === 0) {
            statusCode = 400;
            message = 'All products failed validation';
        } else if (failedCount > 0) {
            statusCode = 207;
            message = `Bulk upload completed: ${successCount} succeeded, ${failedCount} failed`;
        }

        // Emit activity log for successful bulk upload
        if (successCount > 0) {
            const io = req.app.get('io');
            if (io) {
                io.of('/activity').emit('newLog', {
                    message: `Bulk upload: ${successCount} products added to inventory`,
                    type: 'product',
                    time: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                });
            }
        }

        res.status(statusCode).json({
            success: successCount > 0,
            message, totalRows, successCount, failedCount,
            insertedProducts,
            failures: failures.length > 0 ? failures : undefined
        });

    } catch (error) {
        console.error('Bulk Create Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during bulk upload. Please try again.',
            error: error.message
        });
    }
};

// @desc    Fetch all products for Admin (No Pagination)
// @route   GET /api/admin/products
// @access  Admin
exports.getAllProductsAdmin = async (req, res) => {
    try {
        // Fetch all products, sorted by newest first
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.error('Admin Get Products Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ success: true, message: 'Product removed' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Admin
exports.updateProduct = async (req, res) => {
    try {
        const {
            name, category, description, basePrice, discountPercent,
            stock, brand, model, color, material, tags, sizeAvailable, images
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const basePriceNum = Number(basePrice);
        const stockNumber = Number(stock);
        const discountPercentNum = Number(discountPercent) || 0;

        if (basePrice !== undefined && (isNaN(basePriceNum) || basePriceNum <= 0)) {
            return res.status(400).json({ success: false, message: 'Invalid price' });
        }
        if (stock !== undefined && (isNaN(stockNumber) || stockNumber < 0)) {
            return res.status(400).json({ success: false, message: 'Invalid stock' });
        }

        let processedImages = product.images;
        if (images && Array.isArray(images) && images.length > 0) {
            const hasNewImages = images.some(img => img.startsWith('data:image'));
            if (hasNewImages) {
                try {
                    // Requires processProductImages import at top, which is already there
                    processedImages = await require('../utils/cloudinary').processProductImages(images);
                } catch (error) {
                    console.error('Image Processing Error during update:', error);
                    return res.status(500).json({ success: false, message: 'Image upload failed' });
                }
            } else {
                // Process images
                processedImages = images;
            }
        }

        // Build update object
        const updateData = {
            name: name || product.name,
            basePrice: basePriceNum || product.basePrice,
            discountPercent: discountPercentNum,
            finalPrice: basePriceNum ? (basePriceNum - (basePriceNum * (discountPercentNum / 100))) : product.finalPrice,
            stock: stockNumber !== undefined ? stockNumber : product.stock,
            description: description || product.description,
            images: processedImages
        };

        // Optional fields
        if (category) updateData.category = category;
        if (brand) updateData.brand = normalizeBrandName(brand);
        if (tags) updateData.tags = tags;
        if (sizeAvailable) updateData.sizeAvailable = sizeAvailable;

        // Use findByIdAndUpdate to avoid version conflicts
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, product: updatedProduct });

    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get personalized product recommendations
// @route   GET /api/products/recommended
// @access  Private
exports.getRecommendedProducts = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            // If called without auth, return empty array (or we could return 401, 
            // but for graceful fallback, an empty array is safer for .map())
            return res.status(401).json([]);
        }

        const User = require('../models/User.model');
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json([]);
        }

        const personalizedTags = user.personalizedTags || new Map();
        const hasInteractions = personalizedTags.size > 0;

        let products;

        if (!hasInteractions) {
            // COLD START: Fallback to top-rated products
            products = await Product.find({ isActive: true, stock: { $gt: 0 } })
                .sort({ ratingAverage: -1, createdAt: -1 })
                .limit(8);
        } else {
            // PERSONALIZED RECOMMENDATIONS
            // 1. Get top 5 tags
            const topTags = Array.from(personalizedTags.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(entry => entry[0]);

            // 2. Query products that contain any of these tags
            // Matching against 'tags.value' (both attribute and category types)
            const candidateProducts = await Product.find({
                isActive: true,
                stock: { $gt: 0 },
                'tags.value': { $in: topTags }
            });

            // 3. Calculate match scores
            const scoredProducts = candidateProducts.map(product => {
                let matchScore = 0;
                product.tags.forEach(pTag => {
                    const tagValue = pTag.value.toLowerCase();
                    if (personalizedTags.has(tagValue)) {
                        const userWeight = personalizedTags.get(tagValue);
                        // Score = user's interest weight * product's tag weight
                        matchScore += userWeight * (pTag.weight || 1);
                    }
                });

                return {
                    ...product.toObject(),
                    matchScore
                };
            });

            // 4. Sort and Limit
            products = scoredProducts
                .sort((a, b) => {
                    // Primary: matchScore (DESC)
                    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
                    // Secondary: ratingAverage (DESC)
                    if (b.ratingAverage !== a.ratingAverage) return b.ratingAverage - a.ratingAverage;
                    // Tertiary: createdAt (DESC)
                    return b.createdAt - a.createdAt;
                })
                .slice(0, 8);
        }

        res.json(products);
    } catch (error) {
        console.error('Recommendation Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};