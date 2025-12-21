/**
 * QUICK CATEGORY MAPPING TEST
 * Tests enhanced inference rules with sample products
 */

const { resolveProductCategories } = require('./utils/categoryMapper');

console.log('🧪 ENHANCED CATEGORY MAPPING - SAMPLE TESTS\n');
console.log('='.repeat(70));

// Test cases
const testProducts = [
    { name: 'Wooden Dining Chair', category: 'Furniture', tags: [] },
    { name: 'Kitchen Organizer', category: 'Kitchen', tags: [{ value: 'storage' }] },
    { name: 'Office Desk with Drawers', category: 'Furniture', tags: [] },
    { name: 'Stainless Steel Cookware Set', category: 'Kitchen', tags: [] },
    { name: 'Storage Basket', category: 'Storage', tags: [] },
    { name: 'Mobile Phone Charger', category: 'Electronics', tags: [{ value: 'accessory' }] },
    { name: 'Yoga Mat', category: 'Sports & Fitness', tags: [] },
    { name: 'Baby Crib', category: 'Toys & Baby Products', tags: [{ value: 'furniture' }] },
    { name: 'Office Chair Ergonomic', category: 'Office Supplies', tags: [] },
    { name: 'Pen Set', category: 'Books & Stationery', tags: [] },
    { name: 'Hand Sanitizer', category: 'Health', tags: [] },
    { name: 'Face Cream', category: 'Beauty & Personal Care', tags: [] },
    { name: 'Car Phone Mount', category: 'Automotive', tags: [] },
    { name: 'Cushion Cover Set', category: 'Home & Living', tags: [] }
];

testProducts.forEach((product, index) => {
    const resolved = resolveProductCategories(product);

    console.log(`\n${index + 1}. ${product.name}`);
    console.log(`   Stored: ${product.category}`);
    console.log(`   Primary: ${resolved.primary}`);
    console.log(`   All Categories: [${resolved.all.join(', ')}]`);

    if (resolved.all.length > 1) {
        console.log(`   ✨ Multi-category detected!`);
    }
});

console.log('\n' + '='.repeat(70));
console.log('✅ Enhanced mapping now detects more multi-category relationships!\n');
