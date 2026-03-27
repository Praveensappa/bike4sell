const express = require('express');
const { authGuard } = require('../middleware/authMiddleware');
const { getCart, addToCart, toggleSaveForLater, removeCartItem } = require('../controllers/cartController');

const router = express.Router();
router.use(authGuard);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id/save', toggleSaveForLater);
router.delete('/:id', removeCartItem);
module.exports = router;
