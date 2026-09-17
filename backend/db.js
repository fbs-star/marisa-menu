const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'menu.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
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

CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
`);

// Seed a default admin user if none exists yet.
const adminCount = db.prepare('SELECT COUNT(*) AS c FROM admin_users').get().c;
if (adminCount === 0) {
  const defaultUser = process.env.ADMIN_USER || 'admin';
  const defaultPass = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const hash = bcrypt.hashSync(defaultPass, 10);
  db.prepare('INSERT INTO admin_users (username, password_hash, display_name) VALUES (?, ?, ?)')
    .run(defaultUser, hash, 'Administrator');
  console.log(`\n[setup] Created default admin user "${defaultUser}". Please log in and change the password, or set ADMIN_USER / ADMIN_PASSWORD in .env before first run.\n`);
}

// Default settings
const defaultSettings = {
  restaurant_name: 'Marisa Restaurant',
  hotel_name: 'Thavorn Beach Village',
  languages: JSON.stringify(['en', 'th', 'ru', 'zh', 'ar']),
  default_language: 'en',
  currency: 'THB',
};
const upsertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [k, v] of Object.entries(defaultSettings)) upsertSetting.run(k, v);

module.exports = db;

