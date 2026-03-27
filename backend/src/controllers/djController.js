const pool = require('../config/db');

function safeJsonParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

exports.listDjs = async (req, res, next) => {
  try {
    const {
      location,
      genre,
      minPrice,
      maxPrice,
      minRating,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const where = ['d.is_approved=1'];
    const params = [];

    if (location) { where.push('d.location=?'); params.push(location); }
    if (minPrice) { where.push('d.base_price>=?'); params.push(Number(minPrice)); }
    if (maxPrice) { where.push('d.base_price<=?'); params.push(Number(maxPrice)); }
    if (minRating) { where.push('d.avg_rating>=?'); params.push(Number(minRating)); }
    if (search) { where.push('(d.stage_name LIKE ? OR u.name LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (genre) {
      where.push(`EXISTS (
        SELECT 1 FROM dj_profiles p
        WHERE p.dj_id=d.id AND JSON_CONTAINS(p.genres_json, JSON_QUOTE(?))
      )`);
      params.push(genre);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const sql = `
      SELECT d.id, d.stage_name, d.location, d.base_price, d.avg_rating, d.rating_count,
             COALESCE(JSON_UNQUOTE(JSON_EXTRACT(p.images_json,'$[0]')), NULL) AS hero_image
      FROM djs d
      JOIN users u ON u.id=d.user_id
      LEFT JOIN dj_profiles p ON p.dj_id=d.id
      WHERE ${where.join(' AND ')}
      ORDER BY d.avg_rating DESC, d.rating_count DESC, d.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [...params, Number(limit), Number(offset)]);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getDjById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.id, d.stage_name, d.location, d.base_price, d.avg_rating, d.rating_count, d.is_approved,
              u.name AS full_name,
              p.bio, p.experience_years, p.genres_json, p.images_json, p.videos_json, p.packages_json
       FROM djs d
       JOIN users u ON u.id=d.user_id
       LEFT JOIN dj_profiles p ON p.dj_id=d.id
       WHERE d.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'DJ not found' });

    const dj = rows[0];
    const [reviews] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.moderation_status, r.created_at, u.name AS reviewer
       FROM reviews r
       JOIN users u ON u.id=r.user_id
       WHERE r.dj_id=? AND r.moderation_status='APPROVED'
       ORDER BY r.created_at DESC
       LIMIT 50`,
      [req.params.id]
    );

    res.json({
      ...dj,
      genres: safeJsonParse(dj.genres_json, []),
      images: safeJsonParse(dj.images_json, []),
      videos: safeJsonParse(dj.videos_json, []),
      packages: safeJsonParse(dj.packages_json, []),
      reviews
    });
  } catch (e) { next(e); }
};

exports.getDjAvailability = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const params = [req.params.id];
    const where = ['dj_id=?'];
    if (from) { where.push('start_at >= ?'); params.push(from); }
    if (to) { where.push('end_at <= ?'); params.push(to); }
    const [rows] = await pool.query(
      `SELECT id,start_at,end_at,is_booked
       FROM availability_slots
       WHERE ${where.join(' AND ')}
       ORDER BY start_at ASC`,
      params
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.upsertMyDjProfile = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;
    const {
      stage_name,
      location,
      base_price,
      bio = '',
      experience_years,
      genres,
      images = [],
      videos = [],
      packages
    } = req.body;

    const genresArr = Array.isArray(genres) ? genres : safeJsonParse(genres, []);
    const packagesArr = Array.isArray(packages) ? packages : safeJsonParse(packages, []);
    const imagesArr = Array.isArray(images) ? images : safeJsonParse(images, []);
    const videosArr = Array.isArray(videos) ? videos : safeJsonParse(videos, []);

    if (!genresArr.length) return res.status(400).json({ message: 'At least one genre is required' });
    if (!packagesArr.length) return res.status(400).json({ message: 'At least one package is required' });

    await conn.beginTransaction();
    const [djs] = await conn.query('SELECT id,is_approved FROM djs WHERE user_id=? FOR UPDATE', [userId]);
    if (!djs.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'DJ record not found' });
    }
    const djId = djs[0].id;

    await conn.query(
      'UPDATE djs SET stage_name=?, location=?, base_price=? WHERE id=?',
      [stage_name, location, Number(base_price), djId]
    );

    const [existingProfile] = await conn.query('SELECT id FROM dj_profiles WHERE dj_id=?', [djId]);
    if (existingProfile.length) {
      await conn.query(
        `UPDATE dj_profiles
         SET bio=?, experience_years=?, genres_json=?, images_json=?, videos_json=?, packages_json=?
         WHERE dj_id=?`,
        [
          bio,
          Number(experience_years),
          JSON.stringify(genresArr),
          JSON.stringify(imagesArr),
          JSON.stringify(videosArr),
          JSON.stringify(packagesArr),
          djId
        ]
      );
    } else {
      await conn.query(
        `INSERT INTO dj_profiles(dj_id,bio,experience_years,genres_json,images_json,videos_json,packages_json)
         VALUES(?,?,?,?,?,?,?)`,
        [
          djId,
          bio,
          Number(experience_years),
          JSON.stringify(genresArr),
          JSON.stringify(imagesArr),
          JSON.stringify(videosArr),
          JSON.stringify(packagesArr)
        ]
      );
    }

    await conn.commit();
    res.json({ message: 'Profile saved. Await admin approval if required.' });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
};

