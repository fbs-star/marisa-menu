const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { nestPromotion, flattenTranslatable, boolInt, normalizeImage } = require('../helpers');

const router = express.Router();

const TRANSLATABLE_FIELDS = [
  ['title', 'title'],
  ['subtitle', 'subtitle'],
];

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM promotions ORDER BY sort_order ASC, id ASC').all();
  res.json(rows.map(nestPromotion));
});

router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM promotions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(nestPromotion(row));
});

router.post('/', requireAuth, (req, res) => {
  const body = req.body || {};
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);
  const maxOrder = db.prepare('SELECT MAX(sort_order) AS m FROM promotions').get().m || 0;

  const stmt = db.prepare(`
    INSERT INTO promotions (title_en, title_th, title_ru, title_zh, title_ar,
      subtitle_en, subtitle_th, subtitle_ru, subtitle_zh, subtitle_ar, image, published, sort_order)
    VALUES (@title_en, @title_th, @title_ru, @title_zh, @title_ar,
      @subtitle_en, @subtitle_th, @subtitle_ru, @subtitle_zh, @subtitle_ar, @image, @published, @sort_order)
  `);
  const info = stmt.run({
    ...flat,
    image: normalizeImage(body.image),
    published: body.published === undefined ? 1 : boolInt(body.published),
    sort_order: body.sort_order ?? maxOrder + 1,
  });
  const row = db.prepare('SELECT * FROM promotions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(nestPromotion(row));
});

router.put('/:id', requireAuth, (req, res) => {
  const body = req.body || {};
  const existing = db.prepare('SELECT * FROM promotions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);

  db.prepare(`
    UPDATE promotions SET
      title_en=@title_en, title_th=@title_th, title_ru=@title_ru, title_zh=@title_zh, title_ar=@title_ar,
      subtitle_en=@subtitle_en, subtitle_th=@subtitle_th, subtitle_ru=@subtitle_ru, subtitle_zh=@subtitle_zh, subtitle_ar=@subtitle_ar,
      image=@image, published=@published, sort_order=@sort_order, updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `).run({
    id: req.params.id,
    ...flat,
    image: body.image !== undefined ? normalizeImage(body.image) : existing.image,
    published: body.published === undefined ? existing.published : boolInt(body.published),
    sort_order: body.sort_order ?? existing.sort_order,
  });
  const row = db.prepare('SELECT * FROM promotions WHERE id = ?').get(req.params.id);
  res.json(nestPromotion(row));
});

router.patch('/:id/toggle-published', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM promotions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const next = row.published ? 0 : 1;
  db.prepare('UPDATE promotions SET published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next, req.params.id);
  res.json({ ok: true, published: !!next });
});

router.post('/reorder', requireAuth, (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array of ids' });
  const stmt = db.prepare('UPDATE promotions SET sort_order=? WHERE id=?');
  const txn = db.transaction((ids) => {
    ids.forEach((id, idx) => stmt.run(idx, id));
  });
  txn(order);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM promotions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM promotions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
