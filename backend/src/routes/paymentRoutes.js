const express = require('express');
const { authGuard } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');
const { simulatePayment } = require('../controllers/paymentController');

const router = express.Router();
router.use(authGuard);

router.post('/', requireFields(['booking_id', 'payment_type', 'amount', 'simulate']), simulatePayment);

module.exports = router;

