// Shared import logic for the vendor-style "Section" + "Item" worksheet
// template (matches the exact column layout used by the hotel's existing
// menu spreadsheet), used by both the CLI script and the admin upload route.

const XLSX = require('xlsx');
const db = require('./db');

const LANGS = ['en', 'th', 'ru', 'zh', 'ar'];

function yesNo(v) {
  if (v === undefined || v === null) return 0;
  const s = String(v).trim().toLowerCase();
  return s === 'yes' || s === 'true' || s === '1' ? 1 : 0;
}

function numOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function strOrEmpty(v) {
  return v === undefined || v === null ? '' : String(v).trim();
}

function importWorkbook(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sectionSheet = wb.Sheets['Section'];
  const itemSheet = wb.Sheets['Item'];
  if (!sectionSheet || !itemSheet) {
    throw new Error('Workbook must contain both a "Section" sheet and an "Item" sheet (same layout as the export template).');
  }

  const sectionRows = XLSX.utils.sheet_to_json(sectionSheet, { defval: '' });
  const itemRows = XLSX.utils.sheet_to_json(itemSheet, { defval: '' });

  const result = { categories: { created: 0, updated: 0 }, items: { created: 0, updated: 0, skipped: [] } };

  const sectionKeyToCategoryId = {};

  const findCategoryByExternal = db.prepare('SELECT id FROM categories WHERE external_id = ? AND external_id != \'\'');
  const findCategoryByName = db.prepare('SELECT id FROM categories WHERE name_en = ?');
  const insertCategory = db.prepare(`
    INSERT INTO categories (external_id, name_en, name_th, name_ru, name_zh, name_ar,
      desc_en, desc_th, desc_ru, desc_zh, desc_ar, is_new, is_signature, published, sort_order)
    VALUES (@external_id, @name_en, @name_th, @name_ru, @name_zh, @name_ar,
      @desc_en, @desc_th, @desc_ru, @desc_zh, @desc_ar, @is_new, @is_signature, @published, @sort_order)
  `);
  const updateCategory = db.prepare(`
    UPDATE categories SET name_en=@name_en, name_th=@name_th, name_ru=@name_ru, name_zh=@name_zh, name_ar=@name_ar,
      desc_en=@desc_en, desc_th=@desc_th, desc_ru=@desc_ru, desc_zh=@desc_zh, desc_ar=@desc_ar,
      is_new=@is_new, is_signature=@is_signature, published=@published, updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `);

  const importCategories = db.transaction((rows) => {
    rows.forEach((row, idx) => {
      const sectionKey = strOrEmpty(row.section) || strOrEmpty(row.name_en);
      if (!sectionKey) return;
      const external_id = strOrEmpty(row.id_external);
      const data = {
        external_id: external_id || null,
        name_en: strOrEmpty(row.name_en), name_th: strOrEmpty(row.name_th), name_ru: strOrEmpty(row.name_ru),
        name_zh: strOrEmpty(row.name_zh), name_ar: strOrEmpty(row.name_ar),
        desc_en: strOrEmpty(row.desc_en), desc_th: strOrEmpty(row.desc_th), desc_ru: strOrEmpty(row.desc_ru),
        desc_zh: strOrEmpty(row.desc_zh), desc_ar: strOrEmpty(row.desc_ar),
        is_new: yesNo(row.is_new), is_signature: yesNo(row.is_signature),
        published: row.published === '' ? 1 : yesNo(row.published),
        sort_order: idx,
      };

      let existing = external_id ? findCategoryByExternal.get(external_id) : null;
      if (!existing) existing = findCategoryByName.get(data.name_en);

      if (existing) {
        updateCategory.run({ ...data, id: existing.id });
        sectionKeyToCategoryId[sectionKey] = existing.id;
        result.categories.updated++;
      } else {
        const info = insertCategory.run(data);
        sectionKeyToCategoryId[sectionKey] = info.lastInsertRowid;
        result.categories.created++;
      }
    });
  });
  importCategories(sectionRows);

  const findItemByExternal = db.prepare('SELECT id FROM items WHERE external_id = ? AND external_id != \'\'');
  const findItemByNameAndCategory = db.prepare('SELECT id FROM items WHERE name_en = ? AND category_id = ?');
  const insertItem = db.prepare(`
    INSERT INTO items (external_id, category_id, name_en, name_th, name_ru, name_zh, name_ar,
      desc_en, desc_th, desc_ru, desc_zh, desc_ar, price, price_calorie,
      price_note_en, price_note_th, price_note_ru, price_note_zh, food_color_code,
      is_new, is_signature, is_chefs_special, is_must_try, is_best_seller, is_our_favorite,
      is_healthy, is_snooze, preparation_time, stock, published, sort_order)
    VALUES (@external_id, @category_id, @name_en, @name_th, @name_ru, @name_zh, @name_ar,
      @desc_en, @desc_th, @desc_ru, @desc_zh, @desc_ar, @price, @price_calorie,
      @price_note_en, @price_note_th, @price_note_ru, @price_note_zh, @food_color_code,
      @is_new, @is_signature, @is_chefs_special, @is_must_try, @is_best_seller, @is_our_favorite,
      @is_healthy, @is_snooze, @preparation_time, @stock, @published, @sort_order)
  `);
  const updateItem = db.prepare(`
    UPDATE items SET category_id=@category_id, name_en=@name_en, name_th=@name_th, name_ru=@name_ru,
      name_zh=@name_zh, name_ar=@name_ar, desc_en=@desc_en, desc_th=@desc_th, desc_ru=@desc_ru,
      desc_zh=@desc_zh, desc_ar=@desc_ar, price=@price, price_calorie=@price_calorie,
      price_note_en=@price_note_en, price_note_th=@price_note_th, price_note_ru=@price_note_ru, price_note_zh=@price_note_zh,
      food_color_code=@food_color_code, is_new=@is_new, is_signature=@is_signature, is_chefs_special=@is_chefs_special,
      is_must_try=@is_must_try, is_best_seller=@is_best_seller, is_our_favorite=@is_our_favorite, is_healthy=@is_healthy,
      is_snooze=@is_snooze, preparation_time=@preparation_time, stock=@stock, published=@published,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `);

  const importItems = db.transaction((rows) => {
    rows.forEach((row, idx) => {
      const name_en = strOrEmpty(row.name_en);
      if (!name_en) return;
      const sectionKey = strOrEmpty(row.section);
      const category_id = sectionKeyToCategoryId[sectionKey] || null;
      if (!category_id) {
        result.items.skipped.push({ name_en, reason: `Unknown section "${sectionKey}"` });
        return;
      }
      const external_id = strOrEmpty(row.id_external);
      const data = {
        external_id: external_id || null,
        category_id,
        name_en, name_th: strOrEmpty(row.name_th), name_ru: strOrEmpty(row.name_ru),
        name_zh: strOrEmpty(row.name_zh), name_ar: strOrEmpty(row.name_ar),
        desc_en: strOrEmpty(row.desc_en), desc_th: strOrEmpty(row.desc_th), desc_ru: strOrEmpty(row.desc_ru),
        desc_zh: strOrEmpty(row.desc_zh), desc_ar: strOrEmpty(row.desc_ar),
        price: numOrNull(row.price_1),
        price_calorie: strOrEmpty(row.price_1_calorie) || null,
        price_note_en: strOrEmpty(row.price_1_desc_en), price_note_th: strOrEmpty(row.price_1_desc_th),
        price_note_ru: strOrEmpty(row.price_1_desc_ru), price_note_zh: strOrEmpty(row.price_1_desc_zh),
        food_color_code: numOrNull(row.food_color_code),
        is_new: yesNo(row.is_new), is_signature: yesNo(row.is_signature), is_chefs_special: yesNo(row.is_chefs_special),
        is_must_try: yesNo(row.is_must_try), is_best_seller: yesNo(row.is_best_seller), is_our_favorite: yesNo(row.is_our_favorite),
        is_healthy: yesNo(row.is_healthy), is_snooze: yesNo(row.is_snooze),
        preparation_time: numOrNull(row.preparation_time),
        stock: numOrNull(row.stock),
        published: row.published === '' ? 1 : yesNo(row.published),
        sort_order: idx,
      };

      let existing = external_id ? findItemByExternal.get(external_id) : null;
      if (!existing) existing = findItemByNameAndCategory.get(name_en, category_id);

      if (existing) {
        updateItem.run({ ...data, id: existing.id });
        result.items.updated++;
      } else {
        insertItem.run(data);
        result.items.created++;
      }
    });
  });
  importItems(itemRows);

  return result;
}

module.exports = { importWorkbook };

