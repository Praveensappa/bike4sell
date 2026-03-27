const express = require('express');
const { authGuard, requireRole } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');
const {
  listDjs,
  getDjById,
  getDjAvailability,
  upsertMyDjProfile
} = require('../controllers/djController');

const router = express.Router();

router.get('/', listDjs);
router.get('/:id', getDjById);
router.get('/:id/availability', getDjAvailability);

// DJ self-service profile management
router.post(
  '/me/profile',
  authGuard,
  requireRole(['DJ']),
  requireFields(['stage_name', 'location', 'base_price', 'experience_years', 'genres', 'packages']),
  upsertMyDjProfile
);

module.exports = router;

