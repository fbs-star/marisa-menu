const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { nestItem, flattenTranslatable, boolInt } = require('../helpers');

const router = express.Router();

const TRANSLATABLE_FIELDS = [
  ['name', 'name'],
  ['desc', 'description'],
];
const PRICE_NOTE_FIELDS = [['price_note', 'price_note']]; // en/th/ru/zh only, no ar in source template

const BADGE_FIELDS = [
  'is_new', 'is_signature', 'is_chefs_special', 'is_must_try',
  'is_best_seller', 'is_our_favorite', 'is_healthy', 'is_snooze',
];

router.get('/', requireAuth, (req, res) => {
  const { category_id } = req.query;
  let rows;
  if (category_id) {
    rows = db.prepare('SELECT * FROM items WHERE category_id = ? ORDER BY sort_order ASC, id ASC').all(category_id);
  } else {
    rows = db.prepare('SELECT * FROM items ORDER BY category_id ASC, sort_order ASC, id ASC').all();
  }
  res.json(rows.map(nestItem));
});

router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(nestItem(row));
});

function buildBadgeValues(body) {
  const out = {};
  for (const b of BADGE_FIELDS) out[b] = boolInt(body[b]);
  return out;
}

router.post('/', requireAuth, (req, res) => {
  const body = req.body || {};
  const flatNames = flattenTranslatable(body, TRANSLATABLE_FIELDS);
  const priceNotes = flattenTranslatable(body, PRICE_NOTE_FIELDS);
  const maxOrder = db.prepare('SELECT MAX(sort_order) AS m FROM items WHERE category_id = ?').get(body.category_id)?.m || 0;

  const stmt = db.prepare(`
    INSERT INTO items (external_id, category_id, name_en, name_th, name_ru, name_zh, name_ar,
      desc_en, desc_th, desc_ru, desc_zh, desc_ar, price, price_calorie,
      price_note_en, price_note_th, price_note_ru, price_note_zh, image, food_color_code,
      is_new, is_signature, is_chefs_special, is_must_try, is_best_seller, is_our_favorite,
      is_healthy, is_snooze, preparation_time, stock, published, sort_order)
    VALUES (@external_id, @category_id, @name_en, @name_th, @name_ru, @name_zh, @name_ar,
      @desc_en, @desc_th, @desc_ru, @desc_zh, @desc_ar, @price, @price_calorie,
      @price_note_en, @price_note_th, @price_note_ru, @price_note_zh, @image, @food_color_code,
      @is_new, @is_signature, @is_chefs_special, @is_must_try, @is_best_seller, @is_our_favorite,
      @is_healthy, @is_snooze, @preparation_time, @stock, @published, @sort_order)
  `);
  const info = stmt.run({
    external_id: body.external_id || null,
    category_id: body.category_id || null,
    ...flatNames,
    price: body.price ?? null,
    price_calorie: body.price_calorie || null,
    ...priceNotes,
    image: body.image || null,
    food_color_code: body.food_color_code ?? null,
    ...buildBadgeValues(body),
    preparation_time: body.preparation_time ?? null,
    stock: body.stock ?? null,
    published: body.published === undefined ? 1 : boolInt(body.published),
    sort_order: body.sort_order ?? maxOrder + 1,
  });
  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(nestItem(row));
});

router.put('/:id', requireAuth, (req, res) => {
  const body = req.body || {};
  const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const flatNames = flattenTranslatable(body, TRANSLATABLE_FIELDS);
  const priceNotes = flattenTranslatable(body, PRICE_NOTE_FIELDS);

  db.prepare(`
    UPDATE items SET
      category_id=@category_id, name_en=@name_en, name_th=@name_th, name_ru=@name_ru, name_zh=@name_zh, name_ar=@name_ar,
      desc_en=@desc_en, desc_th=@desc_th, desc_ru=@desc_ru, desc_zh=@desc_zh, desc_ar=@desc_ar,
      price=@price, price_calorie=@price_calorie,
      price_note_en=@price_note_en, price_note_th=@price_note_th, price_note_ru=@price_note_ru, price_note_zh=@price_note_zh,
      image=@image, food_color_code=@food_color_code,
      is_new=@is_new, is_signature=@is_signature, is_chefs_special=@is_chefs_special, is_must_try=@is_must_try,
      is_best_seller=@is_best_seller, is_our_favorite=@is_our_favorite, is_healthy=@is_healthy, is_snooze=@is_snooze,
      preparation_time=@preparation_time, stock=@stock, published=@published, sort_order=@sort_order,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `).run({
    id: req.params.id,
    category_id: body.category_id ?? existing.category_id,
    ...flatNames,
    price: body.price ?? existing.price,
    price_calorie: body.price_calorie ?? existing.price_calorie,
    ...priceNotes,
    image: body.image !== undefined ? body.image : existing.image,
    food_color_code: body.food_color_code ?? existing.food_color_code,
    ...buildBadgeValues(body),
    preparation_time: body.preparation_time ?? existing.preparation_time,
    stock: body.stock ?? existing.stock,
    published: body.published === undefined ? existing.published : boolInt(body.published),
    sort_order: body.sort_order ?? existing.sort_order,
  });
  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  res.json(nestItem(row));
});

router.patch('/:id/toggle-sold-out', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const next = row.is_snooze ? 0 : 1;
  db.prepare('UPDATE items SET is_snooze=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next, req.params.id);
  res.json({ ok: true, sold_out: !!next });
});

router.patch('/:id/toggle-published', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const next = row.published ? 0 : 1;
  db.prepare('UPDATE items SET published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next, req.params.id);
  res.json({ ok: true, published: !!next });
});

router.post('/reorder', requireAuth, (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array of ids' });
  const stmt = db.prepare('UPDATE items SET sort_order=? WHERE id=?');
  const txn = db.transaction((ids) => {
    ids.forEach((id, idx) => stmt.run(idx, id));
  });
  txn(order);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;

