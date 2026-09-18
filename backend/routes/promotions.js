const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { nestPromotion, flattenTranslatable, boolInt, normalizeImage } = require('../helpers');

const router = express.Router();

const TRANSLATABLE_FIELDS = [
  ['title', 'title'],
  ['subtitle', 'subtitle'],
];

router.get('/', requireAuth, async (req, res) => {
  const rows = await db.all('SELECT * FROM promotions ORDER BY sort_order ASC, id ASC');
  res.json(rows.map(nestPromotion));
});

router.get('/:id', requireAuth, async (req, res) => {
  const row = await db.get('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(nestPromotion(row));
});

router.post('/', requireAuth, async (req, res) => {
  const body = req.body || {};
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);
  const maxOrderRow = await db.get('SELECT MAX(sort_order) AS m FROM promotions');
  const maxOrder = maxOrderRow.m || 0;

  const values = {
    ...flat,
    image: normalizeImage(body.image),
    menu_group: body.menu_group === 'drink' ? 'drink' : 'food',
    published: body.published === undefined ? 1 : boolInt(body.published),
    sort_order: body.sort_order ?? maxOrder + 1,
  };
  const info = await db.run(`
    INSERT INTO promotions (title_en, title_th, title_ru, title_zh, title_ar,
      subtitle_en, subtitle_th, subtitle_ru, subtitle_zh, subtitle_ar, image, menu_group, published, sort_order)
    VALUES (@title_en, @title_th, @title_ru, @title_zh, @title_ar,
      @subtitle_en, @subtitle_th, @subtitle_ru, @subtitle_zh, @subtitle_ar, @image, @menu_group, @published, @sort_order)
  `, values);
  const row = await db.get('SELECT * FROM promotions WHERE id = ?', [info.lastInsertRowid]);
  res.status(201).json(nestPromotion(row));
});

router.put('/:id', requireAuth, async (req, res) => {
  const body = req.body || {};
  const existing = await db.get('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);

  const values = {
    id: req.params.id,
    ...flat,
    image: body.image !== undefined ? normalizeImage(body.image) : existing.image,
    menu_group: body.menu_group === undefined ? existing.menu_group : (body.menu_group === 'drink' ? 'drink' : 'food'),
    published: body.published === undefined ? existing.published : boolInt(body.published),
    sort_order: body.sort_order ?? existing.sort_order,
  };
  await db.run(`
    UPDATE promotions SET
      title_en=@title_en, title_th=@title_th, title_ru=@title_ru, title_zh=@title_zh, title_ar=@title_ar,
      subtitle_en=@subtitle_en, subtitle_th=@subtitle_th, subtitle_ru=@subtitle_ru, subtitle_zh=@subtitle_zh, subtitle_ar=@subtitle_ar,
      image=@image, menu_group=@menu_group, published=@published, sort_order=@sort_order, updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `, values);
  const row = await db.get('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
  res.json(nestPromotion(row));
});

router.patch('/:id/toggle-published', requireAuth, async (req, res) => {
  const row = await db.get('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const next = row.published ? 0 : 1;
  await db.run('UPDATE promotions SET published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [next, req.params.id]);
  res.json({ ok: true, published: !!next });
});

router.post('/reorder', requireAuth, async (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array of ids' });
  await db.batchRun(order.map((id, idx) => ({
    sql: 'UPDATE promotions SET sort_order=? WHERE id=?',
    args: [idx, id],
  })));
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const existing = await db.get('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  await db.run('DELETE FROM promotions WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
