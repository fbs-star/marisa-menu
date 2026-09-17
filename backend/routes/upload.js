const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
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

// Phone/camera photos routinely come in at 8-15MB, well over Cloudinary's
// 10MB per-file limit on this (free) account, and far larger than a tablet
// menu display needs anyway. Resize to a sane max dimension and re-compress
// before upload. Animated GIFs are passed through untouched (resizing would
// collapse them to a single frame); if processing fails for any other
// reason, fall back to the original buffer rather than blocking the upload.
async function processImage(buffer, mimetype) {
  if (mimetype === 'image/gif') return buffer;
  try {
    const resized = sharp(buffer).rotate().resize({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    });
    if (mimetype === 'image/png') return await resized.png({ quality: 82, compressionLevel: 9 }).toBuffer();
    if (mimetype === 'image/webp') return await resized.webp({ quality: 82 }).toBuffer();
    return await resized.jpeg({ quality: 82 }).toBuffer();
  } catch (e) {
    console.error('Image processing failed, uploading original file instead:', e.message);
    return buffer;
  }
}

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
      const processed = await processImage(req.file.buffer, req.file.mimetype);
      const result = await uploadBufferToCloudinary(processed);
      res.json({ filename: result.public_id, url: result.secure_url });
    } catch (uploadErr) {
      console.error('Cloudinary upload failed:', uploadErr);
      const tooLarge = uploadErr && /file size too large/i.test(uploadErr.message || '');
      const message = tooLarge
        ? 'Image is still too large after compression. Please use a smaller photo.'
        : 'Image upload failed. Please try again.';
      res.status(tooLarge ? 400 : 500).json({ error: message });
    }
  });
});

module.exports = router;
