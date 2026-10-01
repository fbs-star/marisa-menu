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

// Loose name key used ONLY as a last-resort match fallback (see below): trims,
// lowercases, and collapses internal whitespace runs to a single space. This
// exists because re-uploading an older copy of the source spreadsheet kept
// creating brand-new duplicate rows (missing image/unit) whenever its name
// differed from the current admin-panel name by nothing but casing or stray
// double-spaces (e.g. "Massaman Beef " vs "Massaman Beef", "TAWANDANG ROSE
// (490 ml.)" vs "Tawandang Rose (490 ml.)"). It deliberately does NOT do any
// fuzzy/substring matching beyond that: two genuinely different names (e.g.
// a combined "Chicken or Prawns" item vs a spreadsheet that still lists them
// as two separate rows) must NOT be silently merged, so those still require
// the spreadsheet itself to be reconciled with the current admin names.
function looseNameKey(v) {
  return strOrEmpty(v).toLowerCase().replace(/\s+/g, ' ');
}

// Categories that belong under the guest-facing "Drinks Menu" landing button.
// Everything else defaults to "Food Menu". Matched case-insensitively against
// the English category name so re-imports keep classifying the same way.
const DRINK_CATEGORY_NAMES = new Set([
  'beers', 'fresh cold pressed juice', 'fruit juices', 'soft drinks', 'mineral water',
  'blended', 'fruit shakes smoothie', 'homemade mocktails', 'phuket local craft beer',
  'aperitifs', 'vodka', 'rum', 'tequila', 'scotch whiskeys', 'bourbon & whiskeys',
  'cognac', 'liqueurs', 'premium gin', 'cocktails', 'premium cocktails',
  'hot coffee', 'iced coffee', 'tea',
]);

function classifyMenuGroup(row, nameEn) {
  const explicit = strOrEmpty(row.menu_group).toLowerCase();
  if (explicit === 'drink' || explicit === 'food') return explicit;
  return DRINK_CATEGORY_NAMES.has(nameEn.trim().toLowerCase()) ? 'drink' : 'food';
}

async function importWorkbook(buffer) {
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

  await db.runInTransaction(async (tx) => {
    for (const [idx, row] of sectionRows.entries()) {
      const sectionKey = strOrEmpty(row.section) || strOrEmpty(row.name_en);
      if (!sectionKey) continue;
      const external_id = strOrEmpty(row.id_external);
      const name_en = strOrEmpty(row.name_en);
      const data = {
        external_id: external_id || null,
        name_en, name_th: strOrEmpty(row.name_th), name_ru: strOrEmpty(row.name_ru),
        name_zh: strOrEmpty(row.name_zh), name_ar: strOrEmpty(row.name_ar),
        desc_en: strOrEmpty(row.desc_en), desc_th: strOrEmpty(row.desc_th), desc_ru: strOrEmpty(row.desc_ru),
        desc_zh: strOrEmpty(row.desc_zh), desc_ar: strOrEmpty(row.desc_ar),
        menu_group: classifyMenuGroup(row, name_en),
        is_new: yesNo(row.is_new), is_signature: yesNo(row.is_signature),
        published: row.published === '' ? 1 : yesNo(row.published),
        sort_order: idx,
      };

      let existing = external_id
        ? await tx.get("SELECT id FROM categories WHERE external_id = ? AND external_id != ''", [external_id])
        : null;
      if (!existing) existing = await tx.get('SELECT id FROM categories WHERE name_en = ?', [data.name_en]);
      if (!existing) {
        // Last-resort fallback: match ignoring case/whitespace differences
        // only (see looseNameKey above) so a re-uploaded spreadsheet with
        // slightly different formatting updates the existing category
        // instead of creating a duplicate.
        const key = looseNameKey(data.name_en);
        if (key) {
          const candidates = await tx.all('SELECT id, name_en FROM categories', []);
          const match = candidates.find((c) => looseNameKey(c.name_en) === key);
          if (match) existing = { id: match.id };
        }
      }

      if (existing) {
        await tx.run(`
          UPDATE categories SET name_en=@name_en, name_th=@name_th, name_ru=@name_ru, name_zh=@name_zh, name_ar=@name_ar,
            desc_en=@desc_en, desc_th=@desc_th, desc_ru=@desc_ru, desc_zh=@desc_zh, desc_ar=@desc_ar,
            menu_group=@menu_group, is_new=@is_new, is_signature=@is_signature, published=@published, updated_at=CURRENT_TIMESTAMP
          WHERE id=@id
        `, { ...data, id: existing.id });
        sectionKeyToCategoryId[sectionKey] = existing.id;
        result.categories.updated++;
      } else {
        const info = await tx.run(`
          INSERT INTO categories (external_id, name_en, name_th, name_ru, name_zh, name_ar,
            desc_en, desc_th, desc_ru, desc_zh, desc_ar, menu_group, is_new, is_signature, published, sort_order)
          VALUES (@external_id, @name_en, @name_th, @name_ru, @name_zh, @name_ar,
            @desc_en, @desc_th, @desc_ru, @desc_zh, @desc_ar, @menu_group, @is_new, @is_signature, @published, @sort_order)
        `, data);
        sectionKeyToCategoryId[sectionKey] = info.lastInsertRowid;
        result.categories.created++;
      }
    }

    for (const [idx, row] of itemRows.entries()) {
      const name_en = strOrEmpty(row.name_en);
      if (!name_en) continue;
      const sectionKey = strOrEmpty(row.section);
      const category_id = sectionKeyToCategoryId[sectionKey] || null;
      if (!category_id) {
        result.items.skipped.push({ name_en, reason: `Unknown section "${sectionKey}"` });
        continue;
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

      let existing = external_id
        ? await tx.get("SELECT id FROM items WHERE external_id = ? AND external_id != ''", [external_id])
        : null;
      if (!existing) existing = await tx.get('SELECT id FROM items WHERE name_en = ? AND category_id = ?', [name_en, category_id]);
      if (!existing) {
        // Last-resort fallback: match ignoring case/whitespace differences
        // only (see looseNameKey above), scoped to the same category, so a
        // re-uploaded spreadsheet with slightly different formatting (extra
        // spaces, different casing) updates the existing item in place
        // instead of inserting a new duplicate row with no image/unit. This
        // intentionally does NOT attempt substring/fuzzy matching beyond
        // that — a spreadsheet row whose name has actually changed (e.g. an
        // item that was since renamed or split/merged in the admin panel)
        // still needs the spreadsheet reconciled by hand rather than being
        // silently merged into a possibly-wrong item.
        const key = looseNameKey(name_en);
        if (key) {
          const candidates = await tx.all('SELECT id, name_en FROM items WHERE category_id = ?', [category_id]);
          const match = candidates.find((c) => looseNameKey(c.name_en) === key);
          if (match) existing = { id: match.id };
        }
      }

      if (existing) {
        await tx.run(`
          UPDATE items SET category_id=@category_id, name_en=@name_en, name_th=@name_th, name_ru=@name_ru,
            name_zh=@name_zh, name_ar=@name_ar, desc_en=@desc_en, desc_th=@desc_th, desc_ru=@desc_ru,
            desc_zh=@desc_zh, desc_ar=@desc_ar, price=@price, price_calorie=@price_calorie,
            price_note_en=@price_note_en, price_note_th=@price_note_th, price_note_ru=@price_note_ru, price_note_zh=@price_note_zh,
            food_color_code=@food_color_code, is_new=@is_new, is_signature=@is_signature, is_chefs_special=@is_chefs_special,
            is_must_try=@is_must_try, is_best_seller=@is_best_seller, is_our_favorite=@is_our_favorite, is_healthy=@is_healthy,
            is_snooze=@is_snooze, preparation_time=@preparation_time, stock=@stock, published=@published,
            updated_at=CURRENT_TIMESTAMP
          WHERE id=@id
        `, { ...data, id: existing.id });
        result.items.updated++;
      } else {
        await tx.run(`
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
        `, data);
        result.items.created++;
      }
    }
  });

  return result;
}

module.exports = { importWorkbook };
