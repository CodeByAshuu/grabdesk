const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, bulkCreateProducts, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/admin/products', protect, addProduct);
router.post('/admin/products/bulk', protect, bulkCreateProducts);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
