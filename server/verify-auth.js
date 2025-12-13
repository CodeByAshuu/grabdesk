const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_EMAIL = 'admin123@grabdesk.in';

const testAuth = async () => {
    try {
        console.log('--- STARTING AUTH VERIFICATION ---');

        // 1. Signup Customer
        console.log('\n1. Testing Customer Signup...');
        const customerEmail = `customer_${Date.now()}@test.com`;
        const customerPassword = 'password123';

        try {
            const signupRes = await axios.post(`${API_URL}/signup`, {
                name: 'Test Customer',
                email: customerEmail,
                password: customerPassword,
                phone: '1234567890'
            });
            console.log('✅ Signup Success:', signupRes.data.success);
        } catch (err) {
            console.error('❌ Signup Failed:', err.response ? err.response.data : err.message);
        }

        // 2. Signup Admin (Should Fail)
        console.log('\n2. Testing Admin Signup Block...');
        try {
            await axios.post(`${API_URL}/signup`, {
                name: 'Fake Admin',
                email: ADMIN_EMAIL,
                password: 'password123',
                phone: '1234567890'
            });
            console.error('❌ Admin Signup SHOULD HAVE FAILED but succeeded.');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log('✅ Admin Signup Blocked correctly:', err.response.data.message);
            } else {
                console.error('❌ Admin Signup Failed with unexpected error:', err.message);
            }
        }

        // 3. Login Customer
        console.log('\n3. Testing Customer Login...');
        let customerToken = '';
        try {
            const loginRes = await axios.post(`${API_URL}/login`, {
                email: customerEmail,
                password: customerPassword
            });
            console.log('✅ Login Success:', loginRes.data.success);
            customerToken = loginRes.data.token;
        } catch (err) {
            console.error('❌ Login Failed:', err.response ? err.response.data : err.message);
        }

        // 4. Login Admin (Pre-seeded)
        console.log('\n4. Testing Admin Login...');
        try {
            const adminRes = await axios.post(`${API_URL}/login`, {
                email: ADMIN_EMAIL,
                password: 'admin123' // Assuming default from seed
            });
            console.log('✅ Admin Login Success. Role:', adminRes.data.user.role);
        } catch (err) {
            console.error('❌ Admin Login Failed (Make sure seed script ran and password is correct):', err.response ? err.response.data : err.message);
        }

        // 5. Verify Protected Route /me
        console.log('\n5. Testing Protected Route /me...');
        try {
            const meRes = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${customerToken}` }
            });
            console.log('✅ Protected Route Access Success. User:', meRes.data.email);
        } catch (err) {
            console.error('❌ Protected Route Access Failed:', err.response ? err.response.data : err.message);
        }

        console.log('\n--- VERIFICATION COMPLETE ---');

    } catch (error) {
        console.error('Unexpected Error:', error);
    }
};

testAuth();
