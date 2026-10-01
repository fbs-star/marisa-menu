const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { importWorkbook } = require('../importMenu');
const db = require('../db');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const router = express.Router();

// Every import attempt (success or failure) is logged to import_logs — see
// the schema comment in backend/db.js for why: this is the only record of
// when/how an admin -> Import Menu upload happened, since the app has no
// general request logging and Render doesn't retain per-request access logs
// for this service. req.ip resolves to the real client address because
// server.js sets `trust proxy` (Render sits in front of the app behind a
// reverse proxy, so without that, every request would log the proxy's own
// address instead of the uploader's).
async function logImportAttempt({ filename, ip, status, errorMessage, result }) {
  try {
    await db.run(`
      INSERT INTO import_logs (filename, ip_address, status, error_message,
        categories_created, categories_updated, items_created, items_updated,
        items_skipped, created_item_names)
      VALUES (@filename, @ip, @status, @errorMessage,
        @categoriesCreated, @categoriesUpdated, @itemsCreated, @itemsUpdated,
        @itemsSkipped, @createdItemNames)
    `, {
      filename: filename || null,
      ip: ip || null,
      status,
      errorMessage: errorMessage || null,
      categoriesCreated: result?.categories?.created || 0,
      categoriesUpdated: result?.categories?.updated || 0,
      itemsCreated: result?.items?.created || 0,
      itemsUpdated: result?.items?.updated || 0,
      itemsSkipped: result?.items?.skipped?.length || 0,
      createdItemNames: result?.items?.createdNames?.length ? JSON.stringify(result.items.createdNames) : null,
    });
  } catch (e) {
    // Logging must never be the reason an import fails or appears to fail —
    // swallow and report to the server console only.
    console.error('[import] failed to write import_logs row:', e);
  }
}

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filename = req.file.originalname;
  const ip = req.ip;
  try {
    const result = await importWorkbook(req.file.buffer);
    await logImportAttempt({ filename, ip, status: 'success', result });
    res.json({ ok: true, result });
  } catch (e) {
    await logImportAttempt({ filename, ip, status: 'error', errorMessage: e.message });
    res.status(400).json({ error: e.message });
  }
});

// Import history, newest first — lets admin staff see when a re-upload
// happened (and, via created_item_names, recognize a stale-spreadsheet
// re-import at a glance) without needing server/hosting access.
router.get('/logs', requireAuth, async (req, res) => {
  const rows = await db.all('SELECT * FROM import_logs ORDER BY id DESC LIMIT 50');
  const logs = rows.map((r) => ({
    id: r.id,
    filename: r.filename,
    ip_address: r.ip_address,
    status: r.status,
    error_message: r.error_message,
    categories_created: r.categories_created,
    categories_updated: r.categories_updated,
    items_created: r.items_created,
    items_updated: r.items_updated,
    items_skipped: r.items_skipped,
    created_item_names: r.created_item_names ? JSON.parse(r.created_item_names) : [],
    created_at: r.created_at,
  }));
  res.json({ logs });
});

module.exports = router;
