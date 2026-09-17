const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { normalizeImage, imageUrl } = require('../helpers');

const router = express.Router();

// Settings a client is allowed to read/write through this admin endpoint.
const ALLOWED_KEYS = ['restaurant_name', 'hotel_name', 'currency', 'home_background_image'];

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const out = {};
  for (const row of rows) out[row.key] = row.value;
  out.home_background_image = imageUrl(out.home_background_image);
  res.json(out);
});

router.put('/', requireAuth, (req, res) => {
  const body = req.body || {};
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');
  for (const key of ALLOWED_KEYS) {
    if (body[key] === undefined) continue;
    const value = key === 'home_background_image' ? (normalizeImage(body[key]) || '') : String(body[key]);
    upsert.run(key, value);
  }
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const out = {};
  for (const row of rows) out[row.key] = row.value;
  out.home_background_image = imageUrl(out.home_background_image);
  res.json(out);
});

module.exports = router;
