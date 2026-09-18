const express = require('express');
const db = require('../db');
const { nestCategory, nestItem, nestPromotion, imageUrl } = require('../helpers');

const router = express.Router();

// Full published menu tree, nested by category, ready for the tablet app.
router.get('/menu', async (req, res) => {
  const categories = await db.all('SELECT * FROM categories WHERE published = 1 ORDER BY sort_order ASC, id ASC');
  const items = await db.all('SELECT * FROM items WHERE published = 1 ORDER BY sort_order ASC, id ASC');
  const promotions = await db.all('SELECT * FROM promotions WHERE published = 1 ORDER BY sort_order ASC, id ASC');

  const itemsByCategory = {};
  for (const it of items) {
    if (!itemsByCategory[it.category_id]) itemsByCategory[it.category_id] = [];
    itemsByCategory[it.category_id].push(nestItem(it));
  }

  const tree = categories.map((c) => ({
    ...nestCategory(c),
    items: itemsByCategory[c.id] || [],
  })).filter((c) => c.items.length > 0); // hide empty categories on the guest-facing app

  const [restaurantName, hotelName, currency, languagesRaw, homeBg, tagline, logoText] = await Promise.all([
    getSetting('restaurant_name'),
    getSetting('hotel_name'),
    getSetting('currency'),
    getSetting('languages'),
    getSetting('home_background_image'),
    getSetting('tagline'),
    getSetting('logo_text'),
  ]);

  res.json({
    restaurant_name: restaurantName,
    hotel_name: hotelName,
    currency,
    languages: JSON.parse(languagesRaw || '["en"]'),
    home_background_image: imageUrl(homeBg),
    tagline: tagline || '',
    logo_text: logoText || '',
    categories: tree,
    promotions: promotions.map(nestPromotion),
  });
});

async function getSetting(key) {
  const row = await db.get('SELECT value FROM settings WHERE key = ?', [key]);
  return row ? row.value : null;
}

module.exports = router;
