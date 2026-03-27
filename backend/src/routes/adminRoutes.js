const express = require('express');
const { authGuard, requireRole } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');
const {
  listDjsForApproval,
  approveDj,
  listAllBookings,
  listAllReviews,
  moderateReview
} = require('../controllers/adminController');

const router = express.Router();
router.use(authGuard);
router.use(requireRole(['ADMIN']));

router.get('/djs', listDjsForApproval);
router.post('/djs/:djId/approve', requireFields(['is_approved']), approveDj);

router.get('/bookings', listAllBookings);
router.get('/reviews', listAllReviews);
router.post('/reviews/:reviewId/moderate', requireFields(['moderation_status']), moderateReview);

module.exports = router;

