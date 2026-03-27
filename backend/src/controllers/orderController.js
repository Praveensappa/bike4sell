const pool = require('../config/db');

exports.checkout = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { address, payment_mode = 'UPI' } = req.body;
    await conn.beginTransaction();
    const [cartItems] = await conn.query('SELECT * FROM cart WHERE user_id=? AND saved_for_later=0', [userId]);
    if (!cartItems.length) return res.status(400).json({ message: 'Cart empty' });

    for (const item of cartItems) {
      const [bikes] = await conn.query('SELECT is_available FROM bikes WHERE id=? FOR UPDATE', [item.bike_id]);
      if (!bikes.length || bikes[0].is_available === 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'Checkout blocked: bike unavailable' });
      }
    }

    const [orderResult] = await conn.query(
      'INSERT INTO orders(user_id,address,payment_mode,payment_status,total_amount) VALUES(?,?,?,?,0)',
      [userId, address, payment_mode, 'SUCCESS']
    );
    const orderId = orderResult.insertId;
    let total = 0;
    for (const item of cartItems) {
      const [bikeRows] = await conn.query('SELECT price FROM bikes WHERE id=?', [item.bike_id]);
      const price = bikeRows[0].price;
      total += price;
      await conn.query('INSERT INTO order_items(order_id,bike_id,price) VALUES(?,?,?)', [orderId, item.bike_id, price]);
      await conn.query('UPDATE bikes SET is_available=0 WHERE id=?', [item.bike_id]);
    }
    await conn.query('UPDATE orders SET total_amount=? WHERE id=?', [total, orderId]);
    await conn.query('INSERT INTO order_status(order_id,status,remarks) VALUES(?,?,?)', [orderId, 'CONFIRMED', 'Booking confirmed']);
    await conn.query('DELETE FROM cart WHERE user_id=?', [userId]);
    await conn.commit();
    res.status(201).json({ message: 'Order placed', orderId });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC', [req.user.id]);
    res.json(orders);
  } catch (e) { next(e); }
};

exports.getOrderStatus = async (req, res, next) => {
  try {
    const [status] = await pool.query('SELECT * FROM order_status WHERE order_id=? ORDER BY created_at DESC', [req.params.orderId]);
    res.json(status);
  } catch (e) { next(e); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, remarks = '' } = req.body;
    await pool.query('INSERT INTO order_status(order_id,status,remarks) VALUES(?,?,?)', [orderId, status, remarks]);
    res.json({ message: 'Order status updated' });
  } catch (e) { next(e); }
};
