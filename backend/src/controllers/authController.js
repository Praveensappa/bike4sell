const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, role = 'CUSTOMER' } = req.body;
    const allowedRoles = ['CUSTOMER', 'DJ'];
    if (!allowedRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const [exists] = await pool.query('SELECT id FROM users WHERE email=? OR mobile=?', [email, mobile]);
    if (exists.length) return res.status(409).json({ message: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users(name,email,mobile,password_hash,otp_verified,role,status) VALUES(?,?,?,?,?,?,?)',
      [name, email, mobile, hash, 0, role, 'ACTIVE']
    );
    if (role === 'DJ') {
      await pool.query(
        'INSERT INTO djs(user_id,stage_name,location,base_price,avg_rating,rating_count,is_approved) VALUES(?,?,?,?,?,?,?)',
        [result.insertId, name, 'Unknown', 0, 0, 0, 0]
      );
    }
    return res.status(201).json({ message: 'Registered. Verify OTP.', otp_hint: '123456' });
  } catch (e) { next(e); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (otp !== '123456') return res.status(400).json({ message: 'Invalid OTP' });
    await pool.query('UPDATE users SET otp_verified=1 WHERE email=?', [email]);
    return res.json({ message: 'OTP verified' });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    const user = rows[0];
    if (user.status !== 'ACTIVE') return res.status(403).json({ message: 'Account not active' });
    if (!user.otp_verified) return res.status(403).json({ message: 'OTP not verified' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'Reset OTP sent (simulated)', otp_hint: '123456' });
  } catch (e) { next(e); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (otp !== '123456') return res.status(400).json({ message: 'Invalid OTP' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash=? WHERE email=?', [hash, email]);
    return res.json({ message: 'Password reset successful' });
  } catch (e) { next(e); }
};
