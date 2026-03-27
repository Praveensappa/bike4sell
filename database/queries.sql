USE dj_booking;

-- =========================
-- CRUD validation queries
-- =========================

-- USERS
INSERT INTO users(name,email,mobile,password_hash,otp_verified,role,status)
VALUES ('Temp User','temp.user@example.com','9000099999','$2a$10$abcdefghijklmnopqrstuv',0,'CUSTOMER','ACTIVE');

SELECT id,name,email,role,otp_verified,status FROM users WHERE email='temp.user@example.com';

UPDATE users SET otp_verified=1 WHERE email='temp.user@example.com';
DELETE FROM users WHERE email='temp.user@example.com';

-- DJ + PROFILE
SELECT d.id,d.stage_name,d.location,d.base_price,d.avg_rating,d.is_approved,u.email
FROM djs d JOIN users u ON u.id=d.user_id
ORDER BY d.created_at DESC;

SELECT p.dj_id, p.experience_years, JSON_EXTRACT(p.genres_json,'$') AS genres
FROM dj_profiles p;

-- AVAILABILITY
SELECT dj_id,start_at,end_at,is_booked
FROM availability_slots
WHERE dj_id = (SELECT id FROM djs WHERE stage_name='DJ Aryan')
ORDER BY start_at;

-- BOOKINGS (CRUD + joins)
SELECT b.id, u.name AS customer, d.stage_name, b.event_type, b.start_at, b.end_at, b.quoted_price
FROM bookings b
JOIN users u ON u.id=b.customer_id
JOIN djs d ON d.id=b.dj_id
ORDER BY b.created_at DESC;

-- BOOKING STATUS HISTORY
SELECT booking_id,status,remarks,created_at
FROM booking_status
WHERE booking_id = 1
ORDER BY created_at ASC;

-- PAYMENTS
SELECT booking_id,payment_type,amount,status,failure_reason,provider_txn_id
FROM payments
ORDER BY created_at DESC;

-- REVIEWS (UI vs DB validation)
SELECT
  r.id AS review_id,
  d.stage_name,
  u.name AS reviewer,
  r.rating,
  r.moderation_status,
  r.created_at
FROM reviews r
JOIN djs d ON d.id=r.dj_id
JOIN users u ON u.id=r.user_id
ORDER BY r.created_at DESC;

-- =========================
-- Booking validation queries
-- =========================

-- Conflict check: any overlapping booking windows for a DJ
-- Overlap logic: existing.start < requested.end AND existing.end > requested.start
SET @djId := (SELECT id FROM djs WHERE stage_name='DJ Aryan');
SET @reqStart := DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR;
SET @reqEnd := DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 21 HOUR;

SELECT id,start_at,end_at
FROM bookings
WHERE dj_id=@djId
  AND start_at < @reqEnd
  AND end_at > @reqStart;

-- Slot availability check (recommended for UI booking calendar)
SELECT id,start_at,end_at,is_booked
FROM availability_slots
WHERE dj_id=@djId
  AND start_at <= @reqStart
  AND end_at >= @reqEnd
  AND is_booked=0;

-- =========================
-- Admin / monitoring joins
-- =========================

-- DJ approvals dashboard
SELECT d.id, d.stage_name, d.location, d.base_price, d.is_approved, u.email, u.status
FROM djs d JOIN users u ON u.id=d.user_id
ORDER BY d.is_approved ASC, d.created_at DESC;

-- Bookings dashboard with latest status and last payment
SELECT
  b.id AS booking_id,
  d.stage_name,
  cu.name AS customer_name,
  b.event_type,
  b.start_at,
  b.end_at,
  (SELECT bs.status FROM booking_status bs WHERE bs.booking_id=b.id ORDER BY bs.created_at DESC LIMIT 1) AS current_status,
  (SELECT p.status FROM payments p WHERE p.booking_id=b.id ORDER BY p.created_at DESC LIMIT 1) AS last_payment_status
FROM bookings b
JOIN djs d ON d.id=b.dj_id
JOIN users cu ON cu.id=b.customer_id
ORDER BY b.created_at DESC;
