const pool = require('../config/db');

exports.listDjsForApproval = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.id, d.stage_name, d.location, d.base_price, d.is_approved, u.email, u.status, d.created_at
       FROM djs d JOIN users u ON u.id=d.user_id
       ORDER BY d.is_approved ASC, d.created_at DESC`
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.approveDj = async (req, res, next) => {
  try {
    const { djId } = req.params;
    const val = Number(req.body.is_approved);
    if (![0, 1].includes(val)) return res.status(400).json({ message: 'is_approved must be 0 or 1' });
    await pool.query('UPDATE djs SET is_approved=? WHERE id=?', [val, Number(djId)]);
    res.json({ message: 'DJ approval updated' });
  } catch (e) { next(e); }
};

exports.listAllBookings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         b.id, b.event_type, b.start_at, b.end_at, b.quoted_price, b.created_at,
         d.stage_name, d.location,
         cu.name AS customer_name, cu.email AS customer_email,
         (SELECT bs.status FROM booking_status bs WHERE bs.booking_id=b.id ORDER BY bs.created_at DESC, bs.id DESC LIMIT 1) AS current_status
       FROM bookings b
       JOIN djs d ON d.id=b.dj_id
       JOIN users cu ON cu.id=b.customer_id
       ORDER BY b.created_at DESC`
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.listAllReviews = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.booking_id, r.dj_id, r.user_id, r.rating, r.comment, r.moderation_status, r.moderation_reason, r.created_at,
              d.stage_name, u.name AS reviewer
       FROM reviews r
       JOIN djs d ON d.id=r.dj_id
       JOIN users u ON u.id=r.user_id
       ORDER BY r.created_at DESC`
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.moderateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { moderation_status, moderation_reason = '' } = req.body;
    const ms = String(moderation_status).toUpperCase();
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(ms)) {
      return res.status(400).json({ message: 'Invalid moderation_status' });
    }
    await pool.query(
      'UPDATE reviews SET moderation_status=?, moderation_reason=? WHERE id=?',
      [ms, moderation_reason || null, Number(reviewId)]
    );
    res.json({ message: 'Review moderated' });
  } catch (e) { next(e); }
};

