const pool = require('../config/db');

const allowedStatus = new Set(['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
const terminalStatuses = new Set(['COMPLETED', 'CANCELLED']);

function asDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toMysqlDatetime(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function getCurrentStatus(conn, bookingId) {
  const [rows] = await conn.query(
    'SELECT status FROM booking_status WHERE booking_id=? ORDER BY created_at DESC, id DESC LIMIT 1',
    [bookingId]
  );
  return rows.length ? rows[0].status : null;
}

function canTransition(from, to, actorRole) {
  if (!from) return to === 'REQUESTED';
  if (terminalStatuses.has(from)) return false;
  if (from === to) return false;

  if (actorRole === 'ADMIN') return true;
  if (actorRole === 'DJ') {
    return ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(to);
  }
  if (actorRole === 'CUSTOMER') {
    return to === 'CANCELLED' && ['REQUESTED', 'CONFIRMED'].includes(from);
  }
  return false;
}

exports.createBooking = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const customerId = req.user.id;
    const { dj_id, event_type, start_at, end_at, quoted_price, notes = '' } = req.body;

    const start = asDate(start_at);
    const end = asDate(end_at);
    if (!start || !end) return res.status(400).json({ message: 'Invalid date/time' });
    if (end <= start) return res.status(400).json({ message: 'End time must be after start time' });
    if (!['WEDDING', 'PARTY', 'CORPORATE'].includes(event_type)) return res.status(400).json({ message: 'Invalid event type' });

    await conn.beginTransaction();

    // DJ must be approved
    const [djRows] = await conn.query('SELECT id,is_approved FROM djs WHERE id=? FOR UPDATE', [Number(dj_id)]);
    if (!djRows.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'DJ not found' });
    }
    if (djRows[0].is_approved !== 1) {
      await conn.rollback();
      return res.status(403).json({ message: 'DJ profile not approved yet' });
    }

    // Validate requested window is inside an available slot that is not booked
    const startSql = toMysqlDatetime(start);
    const endSql = toMysqlDatetime(end);
    const [slots] = await conn.query(
      `SELECT id FROM availability_slots
       WHERE dj_id=?
         AND start_at <= ?
         AND end_at >= ?
         AND is_booked=0
       ORDER BY start_at ASC
       LIMIT 1
       FOR UPDATE`,
      [Number(dj_id), startSql, endSql]
    );
    if (!slots.length) {
      await conn.rollback();
      return res.status(409).json({ message: 'Selected time is not available' });
    }

    // Conflict check against non-cancelled bookings
    const [conflicts] = await conn.query(
      `SELECT b.id FROM bookings b
       WHERE b.dj_id=?
         AND b.start_at < ?
         AND b.end_at > ?
         AND (SELECT bs.status FROM booking_status bs WHERE bs.booking_id=b.id ORDER BY bs.created_at DESC, bs.id DESC LIMIT 1) <> 'CANCELLED'
       LIMIT 1
       FOR UPDATE`,
      [Number(dj_id), endSql, startSql]
    );
    if (conflicts.length) {
      await conn.rollback();
      return res.status(409).json({ message: 'Booking conflict detected' });
    }

    const [bookingResult] = await conn.query(
      `INSERT INTO bookings(customer_id,dj_id,event_type,start_at,end_at,quoted_price,notes)
       VALUES(?,?,?,?,?,?,?)`,
      [customerId, Number(dj_id), event_type, startSql, endSql, Number(quoted_price), notes]
    );
    const bookingId = bookingResult.insertId;

    await conn.query(
      'INSERT INTO booking_status(booking_id,status,remarks) VALUES(?,?,?)',
      [bookingId, 'REQUESTED', 'Booking requested']
    );

    // Mark slot booked to prevent double booking via calendar
    await conn.query('UPDATE availability_slots SET is_booked=1 WHERE id=?', [slots[0].id]);

    await conn.commit();
    res.status(201).json({ message: 'Booking requested', bookingId });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT
         b.*,
         d.stage_name,
         d.location,
         (SELECT bs.status FROM booking_status bs WHERE bs.booking_id=b.id ORDER BY bs.created_at DESC, bs.id DESC LIMIT 1) AS current_status
       FROM bookings b
       JOIN djs d ON d.id=b.dj_id
       WHERE b.customer_id=?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getDjBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [djRows] = await pool.query('SELECT id FROM djs WHERE user_id=?', [userId]);
    if (!djRows.length) return res.status(404).json({ message: 'DJ record not found' });
    const djId = djRows[0].id;

    const [rows] = await pool.query(
      `SELECT
         b.*,
         u.name AS customer_name,
         u.email AS customer_email,
         (SELECT bs.status FROM booking_status bs WHERE bs.booking_id=b.id ORDER BY bs.created_at DESC, bs.id DESC LIMIT 1) AS current_status
       FROM bookings b
       JOIN users u ON u.id=b.customer_id
       WHERE b.dj_id=?
       ORDER BY b.created_at DESC`,
      [djId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.updateBookingStatus = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { bookingId } = req.params;
    const { status, remarks = '' } = req.body;
    const actorRole = req.user.role;

    if (!allowedStatus.has(status)) return res.status(400).json({ message: 'Invalid status' });

    await conn.beginTransaction();
    const [bookings] = await conn.query('SELECT * FROM bookings WHERE id=? FOR UPDATE', [Number(bookingId)]);
    if (!bookings.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization by ownership unless admin
    if (actorRole !== 'ADMIN') {
      if (actorRole === 'CUSTOMER' && bookings[0].customer_id !== req.user.id) {
        await conn.rollback();
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (actorRole === 'DJ') {
        const [djRows] = await conn.query('SELECT id FROM djs WHERE user_id=?', [req.user.id]);
        if (!djRows.length || djRows[0].id !== bookings[0].dj_id) {
          await conn.rollback();
          return res.status(403).json({ message: 'Forbidden' });
        }
      }
    }

    const current = await getCurrentStatus(conn, Number(bookingId));
    if (!canTransition(current, status, actorRole)) {
      await conn.rollback();
      return res.status(409).json({ message: `Invalid transition from ${current || 'NONE'} to ${status}` });
    }

    await conn.query(
      'INSERT INTO booking_status(booking_id,status,remarks) VALUES(?,?,?)',
      [Number(bookingId), status, remarks]
    );

    await conn.commit();
    res.json({ message: 'Booking status updated' });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
};

