const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { requireAuth } = require('../middleware/auth');

if (process.env.CLOUDINARY_URL) {
  // cloudinary.config() auto-reads CLOUDINARY_URL from the environment, but
  // calling it explicitly makes that dependency visible here too.
  cloudinary.config(true);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Images are received into memory (never written to Render's ephemeral
// local disk) and streamed straight through to Cloudinary, which persists
// them independently of the app's own filesystem.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const ALLOWED = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!ALLOWED.includes(ext)) return cb(new Error('Only image files are allowed (jpg, png, webp, gif)'));
    cb(null, true);
  },
});

const router = express.Router();

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'marisa-menu', resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

router.post('/', requireAuth, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image is too large. Please use a photo under 20MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    try {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      res.json({ filename: result.public_id, url: result.secure_url });
    } catch (uploadErr) {
      console.error('Cloudinary upload failed:', uploadErr);
      res.status(500).json({ error: 'Image upload failed. Please try again.' });
    }
  });
});

module.exports = router;
