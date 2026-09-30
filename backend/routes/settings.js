const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { normalizeImage, imageUrl } = require('../helpers');

const router = express.Router();

// Settings a client is allowed to read/write through this admin endpoint.
const ALLOWED_KEYS = ['restaurant_name', 'hotel_name', 'currency', 'home_background_image', 'tagline', 'logo_text', 'logo_image'];
// Keys stored as an uploaded-image reference (normalized on write, resolved to a full URL on read) rather than plain text.
const IMAGE_KEYS = new Set(['home_background_image', 'logo_image']);

router.get('/', requireAuth, async (req, res) => {
  const rows = await db.all('SELECT key, value FROM settings');
  const out = {};
  for (const row of rows) out[row.key] = row.value;
  for (const key of IMAGE_KEYS) out[key] = imageUrl(out[key]);
  res.json(out);
});

router.put('/', requireAuth, async (req, res) => {
  const body = req.body || {};
  for (const key of ALLOWED_KEYS) {
    if (body[key] === undefined) continue;
    const value = IMAGE_KEYS.has(key) ? (normalizeImage(body[key]) || '') : String(body[key]);
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', [key, value]);
  }
  const rows = await db.all('SELECT key, value FROM settings');
  const out = {};
  for (const row of rows) out[row.key] = row.value;
  for (const key of IMAGE_KEYS) out[key] = imageUrl(out[key]);
  res.json(out);
});

module.exports = router;
