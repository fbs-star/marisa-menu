#!/usr/bin/env node
// Seeds the database with the real Marisa restaurant menu (38 categories,
// 185 items, 5 languages) captured from the hotel's existing menu template.
// This is provisional data pending the hotel's own .xlsx upload for a
// guaranteed byte-perfect import (see backend/importMenu.js / admin Import tab).
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { importWorkbook } = require('../backend/importMenu');
const { initDb } = require('../backend/db');

function readCsv(file) {
  return fs.readFileSync(path.join(__dirname, 'seed_data', file), 'utf-8');
}

function csvToSheet(csvText) {
  const wb = XLSX.read(csvText, { type: 'string' });
  return wb.Sheets[wb.SheetNames[0]];
}

const sectionSheet = csvToSheet(readCsv('Section.csv'));
const itemSheet = csvToSheet(readCsv('Item.csv'));

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, sectionSheet, 'Section');
XLSX.utils.book_append_sheet(wb, itemSheet, 'Item');

const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

// Also save the assembled workbook so it can be inspected / reused directly.
fs.writeFileSync(path.join(__dirname, 'seed_data', 'marisa_menu_seed.xlsx'), buffer);

(async () => {
  try {
    await initDb();
    const result = await importWorkbook(buffer);
    console.log('Seed complete:');
    console.log(`  Categories: ${result.categories.created} created, ${result.categories.updated} updated`);
    console.log(`  Items:      ${result.items.created} created, ${result.items.updated} updated`);
    if (result.items.skipped.length) {
      console.log(`  Skipped ${result.items.skipped.length} item(s):`);
      result.items.skipped.forEach((s) => console.log(`    - ${s.name_en}: ${s.reason}`));
    }
    process.exit(0);
  } catch (e) {
    console.error('Seed failed:', e);
    process.exit(1);
  }
})();

