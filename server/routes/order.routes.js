const express = require('express');
const router = express.Router();
const { getMyOrders, createOrder } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/my', getMyOrders);
router.post('/', createOrder);

module.exports = router;
