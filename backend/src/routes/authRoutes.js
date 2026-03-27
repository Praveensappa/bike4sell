const express = require('express');
const { register, login, verifyOtp, forgotPassword, resetPassword } = require('../controllers/authController');
const { requireFields } = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/register', requireFields(['name', 'email', 'mobile', 'password']), register);
router.post('/verify-otp', requireFields(['email', 'otp']), verifyOtp);
router.post('/login', requireFields(['email', 'password']), login);
router.post('/forgot-password', requireFields(['email']), forgotPassword);
router.post('/reset-password', requireFields(['email', 'otp', 'newPassword']), resetPassword);

module.exports = router;
