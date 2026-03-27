const express = require('express');
const { authGuard } = require('../middleware/authMiddleware');
const { addReview } = require('../controllers/reviewController');

const router = express.Router();
router.post('/', authGuard, addReview);
module.exports = router;
