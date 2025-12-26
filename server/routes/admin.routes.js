const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, resetUserPassword, sendMessageToUser } = require('../controllers/user.controller');
const { getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { getAllCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { getAllNotifications, toggleNotificationRead, deleteNotification, createAnnouncement } = require('../controllers/notification.controller');
const { getNotificationSettings, updateEmailSettings, updateSmsSettings } = require('../controllers/notificationSettings.controller');
const { getAllActivityLogs, getLatestActivityLogs, createActivityLog } = require('../controllers/activityLog.controller');
const { bulkCreateProducts, addProduct } = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all admin routes
router.use(protect);

// User management routes
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.post('/users/:id/reset-password', resetUserPassword);

// Admin messaging route
router.post('/send-message', sendMessageToUser);

// Order management routes
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Category management routes
router.get('/categories', getAllCategories);
router.post('/categories', addCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Notification management routes
router.get('/notifications', getAllNotifications);
router.patch('/notifications/:id/read', toggleNotificationRead);
router.delete('/notifications/:id', deleteNotification);
router.post('/notifications/announcement', createAnnouncement);

// Notification settings routes (Email/SMS configuration)
router.get('/notification-settings', getNotificationSettings);
router.put('/notification-settings/email', updateEmailSettings);
router.put('/notification-settings/sms', updateSmsSettings);

// Activity log routes
router.get('/activity-logs', getAllActivityLogs);
router.get('/activity-logs/latest', getLatestActivityLogs);
router.post('/activity-logs', createActivityLog);

// Product routes
router.get('/products', require('../controllers/product.controller').getAllProductsAdmin);
router.post('/products', addProduct);
router.post('/products/bulk', bulkCreateProducts);
router.put('/products/:id', require('../controllers/product.controller').updateProduct);

// Analytics routes
const { getDashboardStats, getSalesHistory, getDailySalesHistory, getTopProducts } = require('../controllers/analytics.controller');
router.get('/analytics/stats', getDashboardStats);
router.get('/analytics/sales-history', getSalesHistory);
router.get('/analytics/daily-sales', getDailySalesHistory);
router.get('/analytics/top-products', getTopProducts);

module.exports = router;


