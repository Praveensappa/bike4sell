const pool = require('../config/db');

function normalizePaymentType(value) {
  if (!value) return null;
  const t = String(value).toUpperCase();
  return t === 'ADVANCE' || t === 'FULL' ? t : null;
}

exports.simulatePayment = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { booking_id, payment_type, amount, simulate } = req.body;
    const type = normalizePaymentType(payment_type);
    if (!type) return res.status(400).json({ message: 'Invalid payment type' });

    const sim = String(simulate || '').toUpperCase();
    if (!['SUCCESS', 'FAIL'].includes(sim)) return res.status(400).json({ message: 'simulate must be SUCCESS or FAIL' });

    await conn.beginTransaction();
    const [bookings] = await conn.query('SELECT * FROM bookings WHERE id=? FOR UPDATE', [Number(booking_id)]);
    if (!bookings.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only booking customer or admin can pay (simple rule)
    if (req.user.role !== 'ADMIN' && bookings[0].customer_id !== req.user.id) {
      await conn.rollback();
      return res.status(403).json({ message: 'Forbidden' });
    }

    const providerTxnId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const status = sim === 'SUCCESS' ? 'SUCCESS' : 'FAILED';
    const failureReason = status === 'FAILED' ? 'Simulated payment failure' : null;

    await conn.query(
      `INSERT INTO payments(booking_id,amount,payment_type,status,failure_reason,provider_txn_id)
       VALUES(?,?,?,?,?,?)`,
      [Number(booking_id), Number(amount), type, status, failureReason, providerTxnId]
    );

    await conn.commit();
    res.status(status === 'SUCCESS' ? 201 : 402).json({
      message: status === 'SUCCESS' ? 'Payment successful' : 'Payment failed',
      status,
      providerTxnId,
      failureReason
    });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
};

