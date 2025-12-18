const express = require('express');
const router = express.Router();
const {
    getMe,
    addAddress,
    updateAddress,
    deleteAddress,
    getMessages,
    markMessagesRead
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/me', getMe);
router.get('/messages', getMessages);
router.put('/messages/mark-read', markMessagesRead);

router.post('/address', addAddress);
router.put('/address/:index', updateAddress); // Using index since addresses are array of objects w/o explicit IDs usually unless subdocument
router.delete('/address/:index', deleteAddress);

module.exports = router;
