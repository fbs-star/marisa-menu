#!/usr/bin/env node
// Usage: node scripts/import_menu.js /path/to/menu.xlsx
const fs = require('fs');
const path = require('path');
const { importWorkbook } = require('../backend/importMenu');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/import_menu.js /path/to/menu.xlsx');
  process.exit(1);
}
const fullPath = path.resolve(file);
if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`);
  process.exit(1);
}

const buffer = fs.readFileSync(fullPath);
try {
  const result = importWorkbook(buffer);
  console.log('Import complete:');
  console.log(`  Categories: ${result.categories.created} created, ${result.categories.updated} updated`);
  console.log(`  Items:      ${result.items.created} created, ${result.items.updated} updated`);
  if (result.items.skipped.length) {
    console.log(`  Skipped ${result.items.skipped.length} item(s):`);
    result.items.skipped.forEach((s) => console.log(`    - ${s.name_en}: ${s.reason}`));
  }
} catch (e) {
  console.error('Import failed:', e.message);
  process.exit(1);
}

