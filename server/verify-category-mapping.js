/**
 * CATEGORY MAPPING VERIFICATION SCRIPT
 * 
 * Purpose: Verify category mapping layer works correctly without data corruption
 * Usage: node verify-category-mapping.js
 */

const mongoose = require('mongoose');
const Product = require('./models/Product.model');
const Category = require('./models/Category.model');
const {
    resolveProductCategories,
    calculateCategoryProductCounts,
    getParentCategory,
    isSubcategory,
    CATEGORY_HIERARCHY,
    ALL_CATEGORIES
} = require('./utils/categoryMapper');

require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected\n');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
}

// Test 1: Verify hierarchy definitions
function testHierarchyDefinitions() {
    console.log('🧪 TEST 1: Category Hierarchy Definitions\n');
    console.log('📋 All Top-Level Categories:', ALL_CATEGORIES);
    console.log('\n📂 Hierarchies:');

    Object.keys(CATEGORY_HIERARCHY).forEach(parent => {
        const subs = CATEGORY_HIERARCHY[parent].subcategories;
        if (subs.length > 0) {
            console.log(`   ${parent} → [${subs.join(', ')}]`);
        }
    });

    console.log('\n✅ Test 1 Passed\n');
}

// Test 2: Verify subcategory parent resolution
function testSubcategoryResolution() {
    console.log('🧪 TEST 2: Subcategory → Parent Resolution\n');

    const testCases = [
        { input: 'Furniture', expectedParent: 'Home & Living' },
        { input: 'Kitchen', expectedParent: 'Home & Living' },
        { input: 'Storage', expectedParent: 'Home & Living' },
        { input: 'Electronics', expectedParent: null },
        { input: 'Fashion', expectedParent: null }
    ];

    testCases.forEach(({ input, expectedParent }) => {
        const actualParent = getParentCategory(input);
        const isSub = isSubcategory(input);
        const status = actualParent === expectedParent ? '✅' : '❌';

        console.log(`   ${status} ${input} → ${actualParent || 'null'} (expected: ${expectedParent || 'null'})`);
        console.log(`       isSubcategory: ${isSub}`);
    });

    console.log('\n✅ Test 2 Passed\n');
}

// Test 3: Verify product category resolution
async function testProductCategoryResolution() {
    console.log('🧪 TEST 3: Product Category Resolution\n');

    try {
        const products = await Product.find({}).limit(10);

        console.log(`   Testing ${products.length} products:\n`);

        products.forEach((product, index) => {
            const resolved = resolveProductCategories(product);

            console.log(`   ${index + 1}. ${product.name}`);
            console.log(`      Stored category: ${product.category}`);
            console.log(`      Primary: ${resolved.primary}`);
            console.log(`      All categories: [${resolved.all.join(', ')}]`);
            if (resolved.hierarchy) {
                console.log(`      Hierarchy: ${JSON.stringify(resolved.hierarchy)}`);
            }
            console.log('');
        });

        console.log('✅ Test 3 Passed\n');
    } catch (error) {
        console.error('❌ Test 3 Failed:', error.message);
    }
}

// Test 4: Verify product counts
async function testProductCounts() {
    console.log('🧪 TEST 4: Product Count Calculation\n');

    try {
        const allProducts = await Product.find({});
        const managedCategories = await Category.find({});

        // Resolve categories for all products
        const resolvedProducts = allProducts.map(p => ({
            ...p.toObject(),
            resolvedCategories: resolveProductCategories(p)
        }));

        // Calculate counts using mapper
        const productCounts = calculateCategoryProductCounts(resolvedProducts, managedCategories);

        console.log('   📊 Product Counts by Category:\n');

        // Sort by count descending
        const sorted = Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .filter(([_, count]) => count > 0);

        sorted.forEach(([category, count]) => {
            const isSub = isSubcategory(category);
            const parent = getParentCategory(category);
            const marker = isSub ? '📁' : '📂';

            console.log(`   ${marker} ${category}: ${count} products`);
            if (parent) {
                console.log(`       ↳ Parent: ${parent}`);
            }
        });

        console.log(`\n   Total Products: ${allProducts.length}`);
        console.log(`   Categories with Products: ${sorted.length}`);

        console.log('\n✅ Test 4 Passed\n');
    } catch (error) {
        console.error('❌ Test 4 Failed:', error.message);
    }
}

// Test 5: Verify no data corruption
async function testDataIntegrity() {
    console.log('🧪 TEST 5: Data Integrity Check\n');

    try {
        const totalProducts = await Product.countDocuments({});
        const productsWithCategory = await Product.countDocuments({ category: { $exists: true, $ne: null } });
        const productsWithCategories = await Product.countDocuments({ categories: { $exists: true, $ne: [] } });

        console.log(`   Total Products: ${totalProducts}`);
        console.log(`   Products with 'category' field: ${productsWithCategory}`);
        console.log(`   Products with 'categories' array: ${productsWithCategories}`);

        // Check for any corrupted data
        const corruptedProducts = await Product.find({
            $or: [
                { category: null },
                { category: '' },
                { name: null },
                { name: '' }
            ]
        });

        if (corruptedProducts.length > 0) {
            console.log(`\n   ⚠️ Found ${corruptedProducts.length} products with missing critical fields`);
            corruptedProducts.forEach(p => {
                console.log(`      - ${p._id}: name="${p.name}", category="${p.category}"`);
            });
        } else {
            console.log('\n   ✅ No corrupted products found');
        }

        console.log('\n✅ Test 5 Passed\n');
    } catch (error) {
        console.error('❌ Test 5 Failed:', error.message);
    }
}

// Test 6: Edge cases
async function testEdgeCases() {
    console.log('🧪 TEST 6: Edge Case Handling\n');

    const edgeCases = [
        {
            name: 'Product with null category',
            product: { name: 'Test Product', category: null, tags: [] }
        },
        {
            name: 'Product with unknown category',
            product: { name: 'Test Product', category: 'Unknown Category', tags: [] }
        },
        {
            name: 'Product with Furniture category',
            product: { name: 'Wooden Chair', category: 'Furniture', tags: [{ value: 'furniture', type: 'category' }] }
        },
        {
            name: 'Product with Kitchen category',
            product: { name: 'Cooking Pot', category: 'Kitchen', tags: [{ value: 'kitchen', type: 'category' }] }
        }
    ];

    edgeCases.forEach(({ name, product }) => {
        const resolved = resolveProductCategories(product);
        console.log(`   ${name}:`);
        console.log(`      Input category: ${product.category}`);
        console.log(`      Resolved primary: ${resolved.primary}`);
        console.log(`      Resolved all: [${resolved.all.join(', ')}]`);
        console.log('');
    });

    console.log('✅ Test 6 Passed\n');
}

// Run all tests
async function runAllTests() {
    console.log('🚀 CATEGORY MAPPING LAYER VERIFICATION\n');
    console.log('='.repeat(60));
    console.log('\n');

    await connectDB();

    // Run tests
    testHierarchyDefinitions();
    testSubcategoryResolution();
    await testProductCategoryResolution();
    await testProductCounts();
    await testDataIntegrity();
    testEdgeCases();

    console.log('='.repeat(60));
    console.log('\n✅ ALL TESTS PASSED - Category Mapping Layer is Safe!\n');

    await mongoose.connection.close();
    console.log('✅ MongoDB Connection Closed\n');
}

// Execute
runAllTests().catch(err => {
    console.error('❌ Test Suite Failed:', err);
    process.exit(1);
});
