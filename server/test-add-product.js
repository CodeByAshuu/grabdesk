const axios = require('axios');
const fs = require('fs');

// Test adding a product via API
const testAddProduct = async () => {
    try {
        console.log('🧪 Testing product add endpoint...\n');

        // Create a test product with base64 image (very small)
        const testProduct = {
            name: 'TEST PRODUCT - DELETE ME',
            category: 'Test',
            description: 'This is a test product to verify persistence',
            basePrice: 9999,
            discountPercent: 0,
            finalPrice: 9999,
            stock: 1,
            brand: 'Grabdesk',
            model: 'TEST-001',
            color: 'Red',
            material: 'Test Material',
            tags: ['test', 'debug'],
            sizeAvailable: [],
            images: [
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            ]
        };

        console.log('📤 Sending POST request to /api/admin/products...');
        const response = await axios.post('http://localhost:5000/api/admin/products', testProduct, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅ Response Status:', response.status);
        console.log('✅ Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data.success && response.data.product) {
            const productId = response.data.product._id;
            console.log(`\n✅ Product Created! ID: ${productId}`);
            console.log(`   Name: ${response.data.product.name}`);
            console.log(`   SKU: ${response.data.product.sku}`);
            console.log(`   Images: ${response.data.product.images?.length || 0}`);

            // Now fetch it back
            console.log('\n📥 Fetching product back from /api/products...');
            const fetchResponse = await axios.get('http://localhost:5000/api/products');

            const foundProduct = fetchResponse.data.products.find(p => p._id === productId);
            if (foundProduct) {
                console.log('✅ Product found in /api/products!');
                console.log(`   Name: ${foundProduct.name}`);
            } else {
                console.log('❌ Product NOT found in /api/products!');
                console.log(`   Total products returned: ${fetchResponse.data.products.length}`);
                console.log(`   Page: ${fetchResponse.data.page}`);
                console.log(`   Pages: ${fetchResponse.data.pages}`);
            }

            // Fetch by ID
            console.log('\n📥 Fetching product by ID...');
            try {
                const byIdResponse = await axios.get(`http://localhost:5000/api/products/${productId}`);
                console.log('✅ Product found by ID!');
                console.log(`   Name: ${byIdResponse.data.name}`);
            } catch (err) {
                console.log('❌ Product NOT found by ID!');
            }
        }

    } catch (error) {
        console.error('\n❌ Test failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testAddProduct();
