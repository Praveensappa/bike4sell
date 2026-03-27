const pool = require('../config/db');

exports.addReview = async (req, res, next) => {
  try {
    const { booking_id, rating, comment = '' } = req.body;
    const [rows] = await pool.query(
      `SELECT b.id, b.dj_id, b.customer_id,
        (SELECT bs.status FROM booking_status bs WHERE bs.booking_id=b.id ORDER BY bs.created_at DESC, bs.id DESC LIMIT 1) AS current_status
       FROM bookings b WHERE b.id=?`,
      [Number(booking_id)]
    );
    if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
    const booking = rows[0];

    if (booking.customer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Review allowed only for the booking customer' });
    }
    if (booking.current_status !== 'COMPLETED') return res.status(409).json({ message: 'Review allowed only after booking is completed' });

    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) return res.status(400).json({ message: 'Rating must be 1..5' });

    const lower = String(comment).toLowerCase();
    const banned = ['abuse', 'spam', 'scam'];
    const hasBanned = banned.some((w) => lower.includes(w));
    const moderation_status = hasBanned ? 'PENDING' : 'APPROVED';
    const moderation_reason = hasBanned ? 'Contains restricted terms (auto-flag)' : null;

    await pool.query(
      `INSERT INTO reviews(booking_id,dj_id,user_id,rating,comment,moderation_status,moderation_reason)
       VALUES(?,?,?,?,?,?,?)`,
      [Number(booking_id), booking.dj_id, req.user.id, r, comment, moderation_status, moderation_reason]
    );

    if (moderation_status === 'APPROVED') {
      // Update DJ aggregates
      await pool.query(
        `UPDATE djs
         SET rating_count = rating_count + 1,
             avg_rating = ROUND(((avg_rating * rating_count) + ?) / (rating_count + 1), 2)
         WHERE id=?`,
        [r, booking.dj_id]
      );
    }

    res.status(201).json({ message: 'Review submitted', moderation_status });
  } catch (e) { next(e); }
};
