const express = require('express');
const multer = require('multer');
const { authGuard } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');
const {
  addBike, updateBike, deleteBike, getBikes, getBikeById
} = require('../controllers/bikeController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });
const router = express.Router();

router.get('/', getBikes);
router.get('/:id', getBikeById);
router.post('/', authGuard, upload.single('image'), requireFields(['title', 'brand', 'year', 'price']), addBike);
router.put('/:id', authGuard, updateBike);
router.delete('/:id', authGuard, deleteBike);

module.exports = router;
