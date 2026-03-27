const express = require('express');
const { authGuard } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');
const { checkout, getOrders, getOrderStatus, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();
router.use(authGuard);
router.post('/checkout', requireFields(['address']), checkout);
router.get('/', getOrders);
router.get('/:orderId/status', getOrderStatus);
router.post('/:orderId/status', requireFields(['status']), updateOrderStatus);
module.exports = router;
