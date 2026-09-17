# Marisa Restaurant — Digital Tablet Menu

A self-hosted digital menu system for **Marisa Restaurant** at **Thavorn Beach Village**, built specifically for you — no monthly subscription to a third-party vendor.

It has two parts:

1. **Guest tablet menu** (`/`) — a touch-friendly, view-only menu for guests to browse on a tablet at the table. Supports **Thai, English, Russian, Chinese, and Arabic** (with right-to-left layout for Arabic).
2. **Admin panel** (`/admin`) — a password-protected page where staff manage categories, dishes, prices, photos, badges (New / Signature / Chef's Special / Must Try / Best Seller / Our Favorite / Healthy), and mark items sold out in real time.

The app already comes pre-loaded with your real Marisa menu — 38 categories and 185 dishes/drinks, translated into all 5 languages — captured from your existing `MyMenu_Marisa` spreadsheet. **Please re-import the authoritative file from the Import tab once you have it exported as .xlsx**, so every translation is guaranteed byte-for-byte accurate (see "Importing your menu" below).

## Quick start (local test)

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
cp .env.example .env      # edit .env — set a real ADMIN_PASSWORD and JWT_SECRET
npm run seed               # loads the starter menu data (only needed once)
npm start
```

Then open:
- Guest menu: `http://localhost:3000/`
- Admin panel: `http://localhost:3000/admin/` — log in with the `ADMIN_USER` / `ADMIN_PASSWORD` from your `.env`

**Change the admin password immediately** after first login (there's no in-app screen for this yet — use the API: `POST /api/auth/change-password` with `{"current_password":"...","new_password":"..."}`, or ask whoever deploys this to add a settings page).

## Importing your menu

Once you export your existing Google Sheet as `.xlsx` (File → Download → Microsoft Excel `.xlsx`), go to **Admin → Import Menu** and upload it. The importer expects the same two sheets as your current template:

- **Section** sheet — one row per category
- **Item** sheet — one row per dish/drink, with a `section` column matching a category name

It matches existing rows by `id_external` if present, otherwise by name, so you can re-import the same file after edits and it will update rather than duplicate. You can also run it from the command line:

```bash
npm run import -- /path/to/your-menu.xlsx
```

## Managing the menu day-to-day

- **Sold out right now?** Admin → Menu Items → "Mark sold out" — takes effect on the tablet instantly (guests refresh or the item already shows greyed out).
- **New dish added mid-season?** Admin → Menu Items → "+ New Item", fill in each language tab, upload a photo, save.
- **Hide a whole category temporarily** (e.g. seasonal menu)? Admin → Categories → "Hide".
- **Reorder categories** with the ↑ / ↓ buttons so they match your physical menu's flow.

## Hosting this yourself

You don't have a server yet, so here are two simple, low-cost options. Either is enough for a restaurant menu app — it's lightweight (SQLite database, no heavy traffic).

### Option A — a small VPS (more control, cheapest long-term)
Providers like **DigitalOcean** or **Vultr** offer basic virtual servers from about **$4–6/month**. You (or whoever sets it up) would:
1. Create a droplet (Ubuntu, cheapest tier is fine).
2. Install Node.js, copy this project over, run `npm install --production`.
3. Run the app with a process manager so it restarts automatically, e.g. [PM2](https://pm2.keymetrics.io/): `pm2 start backend/server.js --name marisa-menu`.
4. Put [Caddy](https://caddyserver.com/) or Nginx in front of it for free automatic HTTPS with a domain name (Caddy is the simplest — a 3-line config gives you HTTPS automatically).

### Option B — a "push to deploy" platform (less setup, a bit more expensive)
Services like **Railway** (hobby plan ~$5/month of usage credits) or **Render** let you connect a Git repository and they build & run it for you — no server administration, but slightly less control and typically a bit pricier at scale than a raw VPS.

Either way, plan for:
- **A domain name** (~$10–15/year) so the tablets can load a memorable URL, and so it works over HTTPS.
- **Backups**: the entire menu lives in one file, `backend/data/menu.db`. Back this up regularly (a daily copy to cloud storage is enough) — losing it means re-entering the menu.
- **Tablet setup**: put each tablet's browser in "kiosk mode" (full-screen, locked to one URL) so guests can't navigate away — both iOS (Guided Access) and Android (kiosk launcher apps) support this natively.

If you'd rather not manage any of this yourselves, a local web-hosting company or freelance developer in Phuket can typically set up Option A for you in under an hour — this README has everything they need.

## Project structure

```
backend/         Express API + SQLite database + image uploads
  server.js      entry point
  db.js          database schema & default admin user
  importMenu.js  shared import logic (Section + Item sheet → database)
  routes/        auth, categories, items, upload, import, public (guest-facing)
admin/           admin panel (static HTML/CSS/JS, talks to the API)
tablet/          guest-facing tablet menu (static HTML/CSS/JS)
scripts/
  seed.js        loads the starter menu (scripts/seed_data/*.csv)
  import_menu.js CLI wrapper for bulk-importing an .xlsx file
```

## Notes on the data model

The database mirrors the columns from your own menu template, so re-importing is lossless:
`name_*` / `desc_*` per language, `price_1`, `food_color_code`, `preparation_time`, `stock`, and the badge flags (`is_new`, `is_signature`, `is_chefs_special`, `is_must_try`, `is_best_seller`, `is_our_favorite`, `is_healthy`, `is_snooze` for "temporarily unavailable"). Menu items also support a `price_note` per language for variable pricing (e.g. "Tomato 100.- / Bolognese 150.-"), matching an item already in your menu (Spider Man's Spaghetti Web).
