const pool = require('../config/db');
const CART_LIMIT = 5;

exports.getCart = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.*, b.title, b.price, b.image_url FROM cart c JOIN bikes b ON b.id=c.bike_id WHERE c.user_id=?',
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { bike_id, saved_for_later = 0 } = req.body;
    const [items] = await pool.query('SELECT id FROM cart WHERE user_id=?', [req.user.id]);
    if (items.length >= CART_LIMIT) return res.status(400).json({ message: 'Cart limit reached' });
    const [dup] = await pool.query('SELECT id FROM cart WHERE user_id=? AND bike_id=?', [req.user.id, bike_id]);
    if (dup.length) return res.status(409).json({ message: 'Bike already in cart/wishlist' });
    await pool.query('INSERT INTO cart(user_id,bike_id,saved_for_later) VALUES(?,?,?)', [req.user.id, bike_id, saved_for_later]);
    res.status(201).json({ message: 'Added to cart' });
  } catch (e) { next(e); }
};

exports.toggleSaveForLater = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { saved_for_later } = req.body;
    await pool.query('UPDATE cart SET saved_for_later=? WHERE id=? AND user_id=?', [saved_for_later, id, req.user.id]);
    res.json({ message: 'Updated save for later' });
  } catch (e) { next(e); }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM cart WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'Removed from cart' });
  } catch (e) { next(e); }
};
