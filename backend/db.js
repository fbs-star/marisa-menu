const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.warn('\n[db] TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are not set. The app will not be able to reach the database.\n');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT,
  name_en TEXT NOT NULL DEFAULT '',
  name_th TEXT NOT NULL DEFAULT '',
  name_ru TEXT NOT NULL DEFAULT '',
  name_zh TEXT NOT NULL DEFAULT '',
  name_ar TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  desc_th TEXT NOT NULL DEFAULT '',
  desc_ru TEXT NOT NULL DEFAULT '',
  desc_zh TEXT NOT NULL DEFAULT '',
  desc_ar TEXT NOT NULL DEFAULT '',
  image TEXT,
  is_new INTEGER NOT NULL DEFAULT 0,
  is_signature INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name_en TEXT NOT NULL DEFAULT '',
  name_th TEXT NOT NULL DEFAULT '',
  name_ru TEXT NOT NULL DEFAULT '',
  name_zh TEXT NOT NULL DEFAULT '',
  name_ar TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  desc_th TEXT NOT NULL DEFAULT '',
  desc_ru TEXT NOT NULL DEFAULT '',
  desc_zh TEXT NOT NULL DEFAULT '',
  desc_ar TEXT NOT NULL DEFAULT '',
  price REAL,
  price_calorie TEXT,
  price_note_en TEXT NOT NULL DEFAULT '',
  price_note_th TEXT NOT NULL DEFAULT '',
  price_note_ru TEXT NOT NULL DEFAULT '',
  price_note_zh TEXT NOT NULL DEFAULT '',
  image TEXT,
  food_color_code INTEGER,
  is_new INTEGER NOT NULL DEFAULT 0,
  is_signature INTEGER NOT NULL DEFAULT 0,
  is_chefs_special INTEGER NOT NULL DEFAULT 0,
  is_must_try INTEGER NOT NULL DEFAULT 0,
  is_best_seller INTEGER NOT NULL DEFAULT 0,
  is_our_favorite INTEGER NOT NULL DEFAULT 0,
  is_healthy INTEGER NOT NULL DEFAULT 0,
  is_snooze INTEGER NOT NULL DEFAULT 0,
  preparation_time INTEGER,
  stock INTEGER,
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_en TEXT NOT NULL DEFAULT '',
  title_th TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  title_zh TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  subtitle_en TEXT NOT NULL DEFAULT '',
  subtitle_th TEXT NOT NULL DEFAULT '',
  subtitle_ru TEXT NOT NULL DEFAULT '',
  subtitle_zh TEXT NOT NULL DEFAULT '',
  subtitle_ar TEXT NOT NULL DEFAULT '',
  image TEXT,
  menu_group TEXT NOT NULL DEFAULT 'food',
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
`;

// libSQL's named-parameter binding is strict: it requires the args object to
// have exactly the same set of keys as the @name placeholders used in the
// SQL, and throws "Number of arguments mismatch" on any extra key. The old
// better-sqlite3 driver silently ignored unused keys in a named-params
// object, and some call sites (e.g. flattenTranslatable spreading all 5
// LANGS even when a column set only uses 4) rely on that leniency. Rather
// than audit every call site, filter any plain-object args down to just the
// keys the SQL actually references, restoring the old forgiving behavior.
function filterNamedArgs(sql, args) {
  if (!args || Array.isArray(args)) return args;
  const used = new Set();
  const re = /[@:$]([A-Za-z_][A-Za-z0-9_]*)/g;
  let m;
  while ((m = re.exec(sql))) used.add(m[1]);
  const out = {};
  for (const k of used) {
    if (Object.prototype.hasOwnProperty.call(args, k)) out[k] = args[k];
  }
  return out;
}

// Run a single statement, returning the raw ResultSet.
async function exec(sql, args = []) {
  return client.execute({ sql, args: filterNamedArgs(sql, args) });
}

// Convenience helpers mirroring the better-sqlite3 API we used to have, so
// the rest of the codebase only needs `await` added rather than a full
// rewrite of every query.
async function get(sql, args = []) {
  const res = await exec(sql, args);
  return res.rows[0];
}

async function all(sql, args = []) {
  const res = await exec(sql, args);
  return res.rows;
}

async function run(sql, args = []) {
  const res = await exec(sql, args);
  return {
    lastInsertRowid: res.lastInsertRowid === undefined || res.lastInsertRowid === null
      ? undefined
      : Number(res.lastInsertRowid),
    changes: res.rowsAffected,
  };
}

// Runs a list of {sql, args} statements as a single atomic write batch.
// Use this for simple fire-and-forget writes (e.g. reorder endpoints) where
// every statement is known up-front. For flows that need to branch based on
// a SELECT result mid-way (e.g. the xlsx importer), use runInTransaction
// instead.
async function batchRun(statements) {
  if (!statements.length) return;
  await client.batch(statements.map((s) => ({ sql: s.sql, args: filterNamedArgs(s.sql, s.args || []) })), 'write');
}

// Runs `fn(tx)` inside an interactive transaction, where `tx` exposes the
// same get/all/run helpers bound to the transaction. Commits on success,
// rolls back on error.
async function runInTransaction(fn) {
  const tx = await client.transaction('write');
  const txHelpers = {
    get: async (sql, args = []) => (await tx.execute({ sql, args: filterNamedArgs(sql, args) })).rows[0],
    all: async (sql, args = []) => (await tx.execute({ sql, args: filterNamedArgs(sql, args) })).rows,
    run: async (sql, args = []) => {
      const res = await tx.execute({ sql, args: filterNamedArgs(sql, args) });
      return {
        lastInsertRowid: res.lastInsertRowid === undefined || res.lastInsertRowid === null
          ? undefined
          : Number(res.lastInsertRowid),
        changes: res.rowsAffected,
      };
    },
  };
  try {
    const result = await fn(txHelpers);
    await tx.commit();
    return result;
  } catch (e) {
    try { await tx.rollback(); } catch (_) { /* already closed */ }
    throw e;
  }
}

let initialized = null;

// Ensures tables/columns/default rows exist. Safe to call multiple times;
// subsequent calls reuse the same in-flight/completed promise.
function initDb() {
  if (!initialized) {
    initialized = (async () => {
      await client.executeMultiple(SCHEMA);

      // Migration: add categories.menu_group ('food' | 'drink') for existing
      // databases created before this column existed. Safe to run every boot.
      const cols = await all("PRAGMA table_info(categories)");
      const colNames = cols.map((c) => c.name);
      if (!colNames.includes('menu_group')) {
        await exec("ALTER TABLE categories ADD COLUMN menu_group TEXT NOT NULL DEFAULT 'food'");
      }

      // Same migration for promotions.menu_group, so Food/Drink promo banners
      // can be scoped independently on databases created before this column
      // existed.
      const promoCols = await all("PRAGMA table_info(promotions)");
      const promoColNames = promoCols.map((c) => c.name);
      if (!promoColNames.includes('menu_group')) {
        await exec("ALTER TABLE promotions ADD COLUMN menu_group TEXT NOT NULL DEFAULT 'food'");
      }

      // Seed a default admin user if none exists yet.
      const adminCountRow = await get('SELECT COUNT(*) AS c FROM admin_users');
      const adminCount = Number(adminCountRow.c);
      if (adminCount === 0) {
        const defaultUser = process.env.ADMIN_USER || 'admin';
        const defaultPass = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
        const hash = bcrypt.hashSync(defaultPass, 10);
        await run('INSERT INTO admin_users (username, password_hash, display_name) VALUES (?, ?, ?)',
          [defaultUser, hash, 'Administrator']);
        console.log(`\n[setup] Created default admin user "${defaultUser}". Please log in and change the password, or set ADMIN_USER / ADMIN_PASSWORD in .env before first run.\n`);
      }

      // Default settings
      const defaultSettings = {
        restaurant_name: 'Marisa Restaurant',
        hotel_name: 'Thavorn Beach Village',
        languages: JSON.stringify(['en', 'th', 'ru', 'zh', 'ar']),
        default_language: 'en',
        currency: 'THB',
        home_background_image: '',
      };
      for (const [k, v] of Object.entries(defaultSettings)) {
        await run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', [k, v]);
      }
    })();
  }
  return initialized;
}

module.exports = { client, get, all, run, exec, batchRun, runInTransaction, initDb };
