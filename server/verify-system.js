const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api';
const LOG_FILE = 'verify_system_log.txt';

const log = (msg) => {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${msg}`;
    console.log(logMsg);
    fs.appendFileSync(LOG_FILE, logMsg + '\n');
};

const verifySystem = async () => {
    try {
        fs.writeFileSync(LOG_FILE, '');
        log('Starting System Verification...');

        // 1. Admin Login (Get Token)
        log('Test 1: Admin Login...');
        let token;
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@example.com', // Assuming this user exists from previous context
                password: 'password123'
            });
            token = loginRes.data.token;
            if (!token) throw new Error('No token received');
            log('✅ Admin Login Successful');
        } catch (error) {
            log(`❌ Admin Login Failed: ${error.message}`);
            // If login fails, we can't proceed with other tests properly
            // But let's try to proceed if we can, or just exit.
            // For this script, let's exit if login fails.
            process.exit(1);
        }

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Fetch Admin Products (Check Persistence Fix)
        log('Test 2: Fetch Admin Products (Full List)...');
        try {
            const prodRes = await axios.get(`${BASE_URL}/admin/products`, authHeaders);
            if (prodRes.data.success && Array.isArray(prodRes.data.products)) {
                log(`✅ Unpaginated Fetch Successful. Count: ${prodRes.data.products.length}`);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            log(`❌ Fetch Admin Products Failed: ${error.response?.data?.message || error.message}`);
        }

        // 3. Upload Product (Check Safe Upload & Persistence)
        log('Test 3: Upload Single Product...');
        const newProduct = {
            name: `Test Product ${Date.now()}`,
            description: 'Automated test product',
            basePrice: 100,
            stock: 10,
            category: 'Test',
            images: ['https://via.placeholder.com/150'], // Using URL to skip cloudinary upload logic for speed, or basic base64 if needed. 
            // The controller supports URL strings directly too if we look at the code "Cloudinary URLs or original URLs".
            // Let's use a dummy URL to be safe and fast.
        };

        try {
            const uploadRes = await axios.post(`${BASE_URL}/admin/products`, newProduct, authHeaders);
            if (uploadRes.status === 201 && uploadRes.data.success) {
                log('✅ Product Upload Successful');
                const uploadedId = uploadRes.data.product._id;

                // 4. Verify Persistence
                log('Test 4: Verify Persistence (Fetch again)...');
                const verifyRes = await axios.get(`${BASE_URL}/admin/products`, authHeaders);
                const found = verifyRes.data.products.find(p => p._id === uploadedId);
                if (found) {
                    log('✅ Persistence Verified: Product found in subsequent fetch.');
                } else {
                    log('❌ Persistence Failed: Product NOT found in subsequent fetch.');
                }

            } else {
                throw new Error('Upload reported failure');
            }
        } catch (error) {
            log(`❌ Product Upload Failed: ${error.response?.data?.message || error.message}`);
        }

        // 5. Test Auth Failure (401 correctness)
        log('Test 5: Test Invalid Token (Should be 401)...');
        try {
            await axios.get(`${BASE_URL}/admin/products`, { headers: { Authorization: 'Bearer invalid_token' } });
            log('❌ Failed: Invalid token should have thrown 401 but didn\'t.');
        } catch (error) {
            if (error.response?.status === 401) {
                log('✅ Auth Block Verified: Received 401 as expected.');
            } else {
                log(`❌ Unexpected Error Status: ${error.response?.status}`);
            }
        }

        log('System Verification Complete.');

    } catch (error) {
        log(`CRITICAL SCRIPT ERROR: ${error.message}`);
    }
};

verifySystem();
