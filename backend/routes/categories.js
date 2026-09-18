const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { nestCategory, flattenTranslatable, boolInt, normalizeImage, normalizeMenuGroup } = require('../helpers');

const router = express.Router();

const TRANSLATABLE_FIELDS = [
  ['name', 'name'],
  ['desc', 'description'],
];

router.get('/', requireAuth, async (req, res) => {
  const rows = await db.all('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
  res.json(rows.map(nestCategory));
});

router.get('/:id', requireAuth, async (req, res) => {
  const row = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(nestCategory(row));
});

router.post('/', requireAuth, async (req, res) => {
  const body = req.body || {};
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);
  const maxOrderRow = await db.get('SELECT MAX(sort_order) AS m FROM categories');
  const maxOrder = maxOrderRow.m || 0;

  const values = {
    external_id: body.external_id || null,
    ...flat,
    image: normalizeImage(body.image),
    menu_group: normalizeMenuGroup(body.menu_group),
    is_new: boolInt(body.is_new),
    is_signature: boolInt(body.is_signature),
    published: body.published === undefined ? 1 : boolInt(body.published),
    sort_order: body.sort_order ?? maxOrder + 1,
  };
  const info = await db.run(`
    INSERT INTO categories (external_id, name_en, name_th, name_ru, name_zh, name_ar,
      desc_en, desc_th, desc_ru, desc_zh, desc_ar, image, menu_group, is_new, is_signature, published, sort_order)
    VALUES (@external_id, @name_en, @name_th, @name_ru, @name_zh, @name_ar,
      @desc_en, @desc_th, @desc_ru, @desc_zh, @desc_ar, @image, @menu_group, @is_new, @is_signature, @published, @sort_order)
  `, values);
  const row = await db.get('SELECT * FROM categories WHERE id = ?', [info.lastInsertRowid]);
  res.status(201).json(nestCategory(row));
});

router.put('/:id', requireAuth, async (req, res) => {
  const body = req.body || {};
  const existing = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const flat = flattenTranslatable(body, TRANSLATABLE_FIELDS);

  const values = {
    id: req.params.id,
    ...flat,
    image: body.image !== undefined ? normalizeImage(body.image) : existing.image,
    menu_group: body.menu_group !== undefined ? normalizeMenuGroup(body.menu_group) : existing.menu_group,
    is_new: boolInt(body.is_new),
    is_signature: boolInt(body.is_signature),
    published: body.published === undefined ? existing.published : boolInt(body.published),
    sort_order: body.sort_order ?? existing.sort_order,
  };
  await db.run(`
    UPDATE categories SET
      name_en=@name_en, name_th=@name_th, name_ru=@name_ru, name_zh=@name_zh, name_ar=@name_ar,
      desc_en=@desc_en, desc_th=@desc_th, desc_ru=@desc_ru, desc_zh=@desc_zh, desc_ar=@desc_ar,
      image=@image, menu_group=@menu_group, is_new=@is_new, is_signature=@is_signature, published=@published,
      sort_order=@sort_order, updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `, values);
  const row = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  res.json(nestCategory(row));
});

router.patch('/:id/toggle-published', requireAuth, async (req, res) => {
  const row = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const next = row.published ? 0 : 1;
  await db.run('UPDATE categories SET published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [next, req.params.id]);
  res.json({ ok: true, published: !!next });
});

router.post('/reorder', requireAuth, async (req, res) => {
  const { order } = req.body || {}; // array of category ids in desired order
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array of ids' });
  await db.batchRun(order.map((id, idx) => ({
    sql: 'UPDATE categories SET sort_order=? WHERE id=?',
    args: [idx, id],
  })));
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const existing = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  await db.run('UPDATE items SET category_id = NULL WHERE category_id = ?', [req.params.id]);
  await db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
