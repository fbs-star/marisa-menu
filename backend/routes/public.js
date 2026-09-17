const express = require('express');
const db = require('../db');
const { nestCategory, nestItem } = require('../helpers');

const router = express.Router();

// Full published menu tree, nested by category, ready for the tablet app.
router.get('/menu', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories WHERE published = 1 ORDER BY sort_order ASC, id ASC').all();
  const items = db.prepare('SELECT * FROM items WHERE published = 1 ORDER BY sort_order ASC, id ASC').all();

  const itemsByCategory = {};
  for (const it of items) {
    if (!itemsByCategory[it.category_id]) itemsByCategory[it.category_id] = [];
    itemsByCategory[it.category_id].push(nestItem(it));
  }

  const tree = categories.map((c) => ({
    ...nestCategory(c),
    items: itemsByCategory[c.id] || [],
  })).filter((c) => c.items.length > 0); // hide empty categories on the guest-facing app

  res.json({
    restaurant_name: getSetting('restaurant_name'),
    hotel_name: getSetting('hotel_name'),
    currency: getSetting('currency'),
    languages: JSON.parse(getSetting('languages') || '["en"]'),
    categories: tree,
  });
});

function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : null;
}

module.exports = router;

