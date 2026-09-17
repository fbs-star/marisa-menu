const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { importWorkbook } = require('../importMenu');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const router = express.Router();

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await importWorkbook(req.file.buffer);
    res.json({ ok: true, result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;

