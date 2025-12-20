/**
 * Activity Logs Integration Test Script
 * 
 * This script tests the backend API endpoints and Socket.IO functionality
 * Run with: node test-activity-logs.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/admin';

// Test log data
const testLogs = [
    { message: 'Product "Gaming Laptop" added to inventory', type: 'product' },
    { message: 'User "john@example.com" registered', type: 'user' },
    { message: 'Order #ORD-001 placed successfully', type: 'order' },
    { message: 'Admin authentication successful', type: 'auth' },
    { message: 'Database backup completed', type: 'system' }
];

async function runTests() {
    console.log('🧪 Starting Activity Logs Integration Tests...\n');

    // Test 1: Create Activity Logs
    console.log('📝 Test 1: Creating test activity logs...');
    try {
        for (const log of testLogs) {
            const response = await axios.post(`${BASE_URL}/activity-logs`, log);
            console.log(`   ✅ Created: ${log.message}`);
            // Wait 500ms between each log to simulate real-time flow
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('   ✅ All test logs created successfully\n');
    } catch (error) {
        console.error('   ❌ Error creating logs:', error.response?.data || error.message);
        console.log('');
    }

    // Test 2: Fetch All Activity Logs
    console.log('📥 Test 2: Fetching all activity logs...');
    try {
        const response = await axios.get(`${BASE_URL}/activity-logs`);
        console.log(`   ✅ Fetched ${response.data.length} logs`);
        console.log('   Sample logs:');
        response.data.slice(-3).forEach(log => {
            console.log(`      - [${log.type}] ${log.time}: ${log.message}`);
        });
        console.log('');
    } catch (error) {
        console.error('   ❌ Error fetching logs:', error.response?.data || error.message);
        console.log('');
    }

    // Test 3: Fetch Latest Logs (polling endpoint)
    console.log('🔄 Test 3: Testing polling endpoint (latest logs)...');
    try {
        const response = await axios.get(`${BASE_URL}/activity-logs/latest`);
        console.log(`   ✅ Fetched ${response.data.length} recent logs (last 30s)`);
        response.data.forEach(log => {
            console.log(`      - [${log.type}] ${log.time}: ${log.message}`);
        });
        console.log('');
    } catch (error) {
        console.error('   ❌ Error fetching latest logs:', error.response?.data || error.message);
        console.log('');
    }

    // Socket.IO Connection Test
    console.log('🔌 Test 4: Socket.IO Real-Time Test');
    console.log('   ℹ️  Open your browser to http://localhost:3000/admin');
    console.log('   ℹ️  Watch the Activity Logs section for real-time updates');
    console.log('   ℹ️  Creating a test log in 3 seconds...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        const testLog = {
            message: 'Real-time test log via Socket.IO',
            type: 'system'
        };
        await axios.post(`${BASE_URL}/activity-logs`, testLog);
        console.log('   ✅ Real-time log emitted! Check your browser.\n');
    } catch (error) {
        console.error('   ❌ Error emitting real-time log:', error.response?.data || error.message);
        console.log('');
    }

    console.log('✅ All tests completed!\n');
    console.log('📌 Next Steps:');
    console.log('   1. Ensure backend is running: cd server && npm run dev');
    console.log('   2. Ensure frontend is running: cd client && npm run dev');
    console.log('   3. Visit: http://localhost:3000/admin');
    console.log('   4. Check Activity Logs section for real-time updates');
}

// Check if server is running before tests
async function checkServer() {
    try {
        await axios.get('http://localhost:5000/api/health');
        console.log('✅ Server is running!\n');
        return true;
    } catch (error) {
        console.error('❌ Server is not running!');
        console.error('   Please start the server first: cd server && npm run dev\n');
        return false;
    }
}

(async () => {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await runTests();
    }
    process.exit(0);
})();
