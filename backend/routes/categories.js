const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { nestCategory, flattenTranslatable, boolInt } = require('../helpers');

const router = express.Router();

const TRANSLATABLE_FIELDS = [
  ['name', 'name'],
  ['desc', 'description'],
];

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, id ASC').all();
  res.json(rows.map(nestCategory));
});

router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(nestCategory(row));
});

router.post('/', requireAuth, (req, res) => {
  const body = req.body || {};
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);
  const maxOrder = db.prepare('SELECT MAX(sort_order) AS m FROM categories').get().m || 0;

  const stmt = db.prepare(`
    INSERT INTO categories (external_id, name_en, name_th, name_ru, name_zh, name_ar,
      desc_en, desc_th, desc_ru, desc_zh, desc_ar, image, is_new, is_signature, published, sort_order)
    VALUES (@external_id, @name_en, @name_th, @name_ru, @name_zh, @name_ar,
      @desc_en, @desc_th, @desc_ru, @desc_zh, @desc_ar, @image, @is_new, @is_signature, @published, @sort_order)
  `);
  const info = stmt.run({
    external_id: body.external_id || null,
    ...flat,
    image: body.image || null,
    is_new: boolInt(body.is_new),
    is_signature: boolInt(body.is_signature),
    published: body.published === undefined ? 1 : boolInt(body.published),
    sort_order: body.sort_order ?? maxOrder + 1,
  });
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(nestCategory(row));
});

router.put('/:id', requireAuth, (req, res) => {
  const body = req.body || {};
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);

  db.prepare(`
    UPDATE categories SET
      name_en=@name_en, name_th=@name_th, name_ru=@name_ru, name_zh=@name_zh, name_ar=@name_ar,
      desc_en=@desc_en, desc_th=@desc_th, desc_ru=@desc_ru, desc_zh=@desc_zh, desc_ar=@desc_ar,
      image=@image, is_new=@is_new, is_signature=@is_signature, published=@published,
      sort_order=@sort_order, updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `).run({
    id: req.params.id,
    ...flat,
    image: body.image !== undefined ? body.image : existing.image,
    is_new: boolInt(body.is_new),
    is_signature: boolInt(body.is_signature),
    published: body.published === undefined ? existing.published : boolInt(body.published),
    sort_order: body.sort_order ?? existing.sort_order,
  });
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  res.json(nestCategory(row));
});

router.patch('/:id/toggle-published', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const next = row.published ? 0 : 1;
  db.prepare('UPDATE categories SET published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next, req.params.id);
  res.json({ ok: true, published: !!next });
});

router.post('/reorder', requireAuth, (req, res) => {
  const { order } = req.body || {}; // array of category ids in desired order
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array of ids' });
  const stmt = db.prepare('UPDATE categories SET sort_order=? WHERE id=?');
  const txn = db.transaction((ids) => {
    ids.forEach((id, idx) => stmt.run(idx, id));
  });
  txn(order);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE items SET category_id = NULL WHERE category_id = ?').run(req.params.id);
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;

