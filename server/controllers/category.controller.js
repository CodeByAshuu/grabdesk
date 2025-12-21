const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const { calculateCategoryProductCounts, resolveProductCategories } = require('../utils/categoryMapper');

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Admin
exports.getAllCategories = async (req, res) => {
    try {
        // HYBRID APPROACH: Managed categories + auto-detected from products
        // NOW WITH INTELLIGENT CATEGORY MAPPING

        // 1. Get all managed categories from Category collection
        const managedCategories = await Category.find({}).sort({ createdAt: -1 });
        const categoryMap = {};

        managedCategories.forEach(cat => {
            categoryMap[cat.name] = {
                id: cat._id.toString(),
                _id: cat._id,
                name: cat.name,
                productCount: 0, // Will be filled below
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt,
                isManaged: true
            };
        });

        // 2. Fetch all products and resolve their categories
        const allProducts = await Product.find({});

        // Resolve categories for each product using mapper
        const resolvedProducts = allProducts.map(p => {
            const productObj = p.toObject();
            return {
                ...productObj,
                resolvedCategories: resolveProductCategories(p)
            };
        });

        // 3. Calculate accurate product counts using mapping layer
        const productCounts = calculateCategoryProductCounts(resolvedProducts, managedCategories);

        // 4. Update managed categories with correct counts
        Object.keys(categoryMap).forEach(catName => {
            categoryMap[catName].productCount = productCounts[catName] || 0;
        });

        // 5. Add auto-detected categories (products exist but no Category document)
        Object.keys(productCounts).forEach(catName => {
            if (!categoryMap[catName] && productCounts[catName] > 0) {
                // Add auto-detected category (not in Category collection)
                categoryMap[catName] = {
                    id: `auto-${catName}`,
                    _id: null,
                    name: catName,
                    productCount: productCounts[catName],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isManaged: false // Auto-detected from products
                };
            }
        });

        // 6. Convert to array and sort alphabetically
        const normalizedCategories = Object.values(categoryMap).sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        res.json(normalizedCategories);
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add new category
// @route   POST /api/admin/categories
// @access  Admin
exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(409).json({ success: false, message: 'Category already exists' });
        }

        const category = new Category({ name: name.trim(), productCount: 0 });
        await category.save();

        const normalizedCategory = {
            id: category._id.toString(),
            _id: category._id,
            name: category.name,
            productCount: category.productCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };

        // NEW: Emit Socket.io event for real-time sync
        const io = req.app.get('io');
        if (io) {
            io.emit('category:created', normalizedCategory);
        }

        res.status(201).json({ success: true, message: 'Category added successfully', category: normalizedCategory });
    } catch (error) {
        console.error('Add Category Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update category
// @route   PATCH /api/admin/categories/:id
// @access  Admin
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: name.trim() },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const normalizedCategory = {
            id: category._id.toString(),
            _id: category._id,
            name: category.name,
            productCount: category.productCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };

        // NEW: Emit Socket.io event for real-time sync
        const io = req.app.get('io');
        if (io) {
            io.emit('category:updated', normalizedCategory);
        }

        res.json({ success: true, message: 'Category updated successfully', category: normalizedCategory });
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // NEW: Emit Socket.io event for real-time sync
        const io = req.app.get('io');
        if (io) {
            io.emit('category:deleted', { id: req.params.id });
        }

        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
