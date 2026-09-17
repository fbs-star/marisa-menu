const LANGS = ['en', 'th', 'ru', 'zh', 'ar'];

// The DB always stores a bare filename (e.g. "abc123.jpg") in the `image`
// column. These two helpers keep that true even if a caller accidentally
// hands us a value that already has the "/uploads/" prefix on it (or a full
// URL), so a save can never compound the prefix.
function normalizeImage(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;
  return str.replace(/^\/?uploads\//, '');
}

function imageUrl(value) {
  const name = normalizeImage(value);
  return name ? `/uploads/${name}` : null;
}

// Convert a DB row (flat name_en/name_th/... columns) into a nested shape
// {name: {en, th, ru, zh, ar}, ...} that's easier for the frontends to consume.
function nestCategory(row) {
  if (!row) return row;
  return {
    id: row.id,
    external_id: row.external_id,
    name: pick(row, 'name'),
    description: pick(row, 'desc'),
    image: imageUrl(row.image),
    is_new: !!row.is_new,
    is_signature: !!row.is_signature,
    published: !!row.published,
    sort_order: row.sort_order,
  };
}

function nestItem(row) {
  if (!row) return row;
  return {
    id: row.id,
    external_id: row.external_id,
    category_id: row.category_id,
    name: pick(row, 'name'),
    description: pick(row, 'desc'),
    price: row.price,
    price_calorie: row.price_calorie,
    price_note: pick(row, 'price_note'),
    image: imageUrl(row.image),
    food_color_code: row.food_color_code,
    badges: {
      is_new: !!row.is_new,
      is_signature: !!row.is_signature,
      is_chefs_special: !!row.is_chefs_special,
      is_must_try: !!row.is_must_try,
      is_best_seller: !!row.is_best_seller,
      is_our_favorite: !!row.is_our_favorite,
      is_healthy: !!row.is_healthy,
    },
    is_snooze: !!row.is_snooze,
    preparation_time: row.preparation_time,
    stock: row.stock,
    sold_out: !!row.is_snooze || row.stock === 0,
    published: !!row.published,
    sort_order: row.sort_order,
  };
}

function pick(row, prefix) {
  const out = {};
  for (const lang of LANGS) out[lang] = row[`${prefix}_${lang}`] || '';
  return out;
}

// Flatten a nested {name:{en,th,...}, description:{en,...}} payload from the
// admin UI back into flat columns for the DB.
function flattenTranslatable(body, fields) {
  const out = {};
  for (const [dbPrefix, bodyKey] of fields) {
    const obj = body[bodyKey] || {};
    for (const lang of LANGS) out[`${dbPrefix}_${lang}`] = obj[lang] || '';
  }
  return out;
}

function boolInt(v) {
  return v ? 1 : 0;
}

module.exports = { LANGS, nestCategory, nestItem, flattenTranslatable, boolInt, normalizeImage, imageUrl };
