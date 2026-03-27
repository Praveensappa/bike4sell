const pool = require('../config/db');

exports.addBike = async (req, res, next) => {
  try {
    const { title, brand, year, price, category_id, location_id, fuel_type, specs } = req.body;
    const seller_id = req.user.id;
    const [dup] = await pool.query(
      'SELECT id FROM bikes WHERE seller_id=? AND title=? AND brand=? AND year=? AND price=?',
      [seller_id, title, brand, year, price]
    );
    if (dup.length) return res.status(409).json({ message: 'Duplicate listing not allowed' });
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await pool.query(
      'INSERT INTO bikes(title,brand,year,price,category_id,location_id,fuel_type,specs,image_url,seller_id,is_available) VALUES(?,?,?,?,?,?,?,?,?,?,1)',
      [title, brand, year, price, category_id, location_id, fuel_type, specs, image_url, seller_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Bike listed' });
  } catch (e) { next(e); }
};

exports.updateBike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;
    const { title, brand, year, price, fuel_type, specs, is_available } = req.body;
    await pool.query(
      'UPDATE bikes SET title=?,brand=?,year=?,price=?,fuel_type=?,specs=?,is_available=? WHERE id=? AND seller_id=?',
      [title, brand, year, price, fuel_type, specs, is_available, id, seller_id]
    );
    res.json({ message: 'Bike updated' });
  } catch (e) { next(e); }
};

exports.deleteBike = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM bikes WHERE id=? AND seller_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'Bike deleted' });
  } catch (e) { next(e); }
};

exports.getBikes = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 10, brand, minPrice, maxPrice, location_id, fuel_type, year, category_id, search
    } = req.query;
    const where = ['b.is_available=1'];
    const params = [];
    if (brand) { where.push('b.brand=?'); params.push(brand); }
    if (minPrice) { where.push('b.price>=?'); params.push(minPrice); }
    if (maxPrice) { where.push('b.price<=?'); params.push(maxPrice); }
    if (location_id) { where.push('b.location_id=?'); params.push(location_id); }
    if (fuel_type) { where.push('b.fuel_type=?'); params.push(fuel_type); }
    if (year) { where.push('b.year=?'); params.push(year); }
    if (category_id) { where.push('b.category_id=?'); params.push(category_id); }
    if (search) { where.push('(b.title LIKE ? OR b.brand LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    const offset = (Number(page) - 1) * Number(limit);
    const sql = `
      SELECT b.*, u.name seller_name, c.name category_name, l.city location_name
      FROM bikes b
      JOIN users u ON b.seller_id=u.id
      LEFT JOIN categories c ON b.category_id=c.id
      LEFT JOIN locations l ON b.location_id=l.id
      WHERE ${where.join(' AND ')}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [...params, Number(limit), Number(offset)]);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getBikeById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, u.name seller_name, u.mobile seller_mobile, c.name category_name, l.city location_name
       FROM bikes b JOIN users u ON b.seller_id=u.id
       LEFT JOIN categories c ON b.category_id=c.id
       LEFT JOIN locations l ON b.location_id=l.id WHERE b.id=?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Bike not found' });
    const [reviews] = await pool.query(
      'SELECT r.*,u.name reviewer FROM reviews r JOIN users u ON u.id=r.user_id WHERE bike_id=? ORDER BY r.created_at DESC',
      [req.params.id]
    );
    res.json({ ...rows[0], reviews });
  } catch (e) { next(e); }
};
