const express = require('express');
const { authGuard, requireRole } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');
const {
  createBooking,
  getMyBookings,
  getDjBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

const router = express.Router();
router.use(authGuard);

router.post(
  '/',
  requireRole(['CUSTOMER']),
  requireFields(['dj_id', 'event_type', 'start_at', 'end_at', 'quoted_price']),
  createBooking
);

router.get('/me', getMyBookings);
router.get('/dj', requireRole(['DJ']), getDjBookings);

router.post('/:bookingId/status', requireFields(['status']), updateBookingStatus);

module.exports = router;

