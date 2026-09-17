require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const itemRoutes = require('./routes/items');
const publicRoutes = require('./routes/public');
const uploadRoutes = require('./routes/upload');
const importRoutes = require('./routes/import');
const promotionRoutes = require('./routes/promotions');
const settingsRoutes = require('./routes/settings');

require('./db'); // ensure DB + default admin user are initialized

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/items', itemRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/import', importRoutes);
app.use('/api/admin/promotions', promotionRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/public', publicRoutes);

// Static frontends
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use('/', express.static(path.join(__dirname, '..', 'tablet')));

app.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`\nThavorn / Marisa menu app running:`);
  console.log(`  Guest tablet menu:  http://localhost:${PORT}/`);
  console.log(`  Admin panel:        http://localhost:${PORT}/admin/`);
  console.log(`  API health check:   http://localhost:${PORT}/health\n`);
});
