const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth, signToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const user = await db.get('SELECT * FROM admin_users WHERE username = ?', [username]);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = signToken({ id: user.id, username: user.username });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 12 * 60 * 60 * 1000,
  });
  res.json({ ok: true, user: { id: user.id, username: user.username, display_name: user.display_name } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await db.get('SELECT id, username, display_name FROM admin_users WHERE id = ?', [req.user.id]);
  res.json({ user });
});

router.post('/change-password', requireAuth, async (req, res) => {
  const { current_password, new_password } = req.body || {};
  if (!current_password || !new_password || new_password.length < 6) {
    return res.status(400).json({ error: 'Current password and a new password (min 6 chars) are required' });
  }
  const user = await db.get('SELECT * FROM admin_users WHERE id = ?', [req.user.id]);
  if (!user || !bcrypt.compareSync(current_password, user.password_hash)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  const hash = bcrypt.hashSync(new_password, 10);
  await db.run('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, user.id]);
  res.json({ ok: true });
});

module.exports = router;
