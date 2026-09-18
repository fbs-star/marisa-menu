(function () {
  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'th', label: 'ไทย' },
    { code: 'ru', label: 'Русский' },
    { code: 'zh', label: '中文' },
    { code: 'ar', label: 'العربية' },
  ];
  const BADGES = [
    ['is_new', 'New'], ['is_signature', 'Signature'], ['is_chefs_special', "Chef's Special"],
    ['is_must_try', 'Must Try'], ['is_best_seller', 'Best Seller'], ['is_our_favorite', 'Our Favorite'],
    ['is_healthy', 'Healthy'],
  ];

  let state = { user: null, page: 'categories', categories: [], items: [], promotions: [], settings: {}, activeCategoryId: null };

  const app = document.getElementById('app');

  async function api(path, opts = {}) {
    const res = await fetch('/api' + path, {
      credentials: 'include',
      headers: opts.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      ...opts,
    });
    if (res.status === 401) { state.user = null; renderLogin(); throw new Error('Not authenticated'); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  // ---------------- Login ----------------
  function renderLogin(error) {
    app.innerHTML = `
      <div class="login-screen">
        <form class="login-card" id="login-form">
          <h1>Marisa Menu — Admin</h1>
          <p>Sign in to manage the guest tablet menu.</p>
          ${error ? `<div class="error-msg">${escapeHtml(error)}</div>` : ''}
          <div class="field"><label>Username</label><input name="username" autofocus required /></div>
          <div class="field"><label>Password</label><input name="password" type="password" required /></div>
          <button class="btn btn-primary btn-block" type="submit">Sign in</button>
        </form>
      </div>
    `;
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ username: fd.get('username'), password: fd.get('password') }) });
        state.user = data.user;
        await loadAll();
        renderShell();
      } catch (err) {
        renderLogin(err.message);
      }
    });
  }

  // ---------------- Data loading ----------------
  async function loadAll() {
    const [categories, items, promotions, settings] = await Promise.all([
      api('/admin/categories'), api('/admin/items'), api('/admin/promotions'), api('/admin/settings'),
    ]);
    state.categories = categories;
    state.items = items;
    state.promotions = promotions;
    state.settings = settings;
    if (!state.activeCategoryId && categories.length) state.activeCategoryId = categories[0].id;
  }

  // ---------------- Shell ----------------
  function renderShell() {
    app.innerHTML = `
      <div class="shell">
        <div class="sidebar">
          <div class="brand">Marisa Menu<small>Admin panel</small></div>
          <button class="nav-item ${state.page === 'categories' ? 'active' : ''}" data-page="categories">📂 Categories</button>
          <button class="nav-item ${state.page === 'items' ? 'active' : ''}" data-page="items">🍽 Menu Items</button>
          <button class="nav-item ${state.page === 'promotions' ? 'active' : ''}" data-page="promotions">🎉 Promotions</button>
          <button class="nav-item ${state.page === 'home' ? 'active' : ''}" data-page="home">🏠 Home Screen</button>
          <button class="nav-item ${state.page === 'import' ? 'active' : ''}" data-page="import">⬆️ Import Menu</button>
          <div class="spacer"></div>
          <div class="logout">Signed in as ${escapeHtml(state.user.username)}<br/><button class="icon-btn" id="logout-btn">Log out</button></div>
        </div>
        <div class="main" id="main"></div>
      </div>
    `;
    document.querySelectorAll('.nav-item').forEach((btn) => btn.addEventListener('click', () => { state.page = btn.dataset.page; renderShell(); }));
    document.getElementById('logout-btn').addEventListener('click', async () => { await api('/auth/logout', { method: 'POST' }); state.user = null; renderLogin(); });

    if (state.page === 'categories') renderCategoriesPage();
    else if (state.page === 'items') renderItemsPage();
    else if (state.page === 'promotions') renderPromotionsPage();
    else if (state.page === 'home') renderHomeSettingsPage();
    else if (state.page === 'import') renderImportPage();
  }

  // ---------------- Categories page ----------------
  function renderCategoriesPage() {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="page-header">
        <div><h1>Categories</h1><p>${state.categories.length} categories · drag isn't supported yet, use the arrows to reorder</p></div>
        <button class="btn btn-primary" id="add-cat-btn">+ New Category</button>
      </div>
      <div class="card">
        <table>
          <thead><tr><th>Name (EN)</th><th>Name (TH)</th><th>Group</th><th>Items</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${state.categories.map((c, idx) => `
              <tr>
                <td>${escapeHtml(c.name.en)}</td>
                <td>${escapeHtml(c.name.th)}</td>
                <td><span class="pill ${c.menu_group === 'drink' ? 'pill-off' : 'pill-on'}">${c.menu_group === 'drink' ? 'Drinks' : 'Food'}</span></td>
                <td>${state.items.filter((i) => i.category_id === c.id).length}</td>
                <td><span class="pill ${c.published ? 'pill-on' : 'pill-off'}">${c.published ? 'Published' : 'Hidden'}</span></td>
                <td>
                  <button class="icon-btn" data-move-up="${c.id}" ${idx === 0 ? 'disabled' : ''}>↑</button>
                  <button class="icon-btn" data-move-down="${c.id}" ${idx === state.categories.length - 1 ? 'disabled' : ''}>↓</button>
                  <button class="icon-btn" data-toggle-cat="${c.id}">${c.published ? 'Hide' : 'Show'}</button>
                  <button class="icon-btn" data-edit-cat="${c.id}">Edit</button>
                  <button class="icon-btn" data-del-cat="${c.id}">Delete</button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="6" class="empty-hint">No categories yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
    main.querySelector('#add-cat-btn').addEventListener('click', () => openCategoryModal());
    main.querySelectorAll('[data-edit-cat]').forEach((b) => b.addEventListener('click', () => openCategoryModal(state.categories.find((c) => c.id === Number(b.dataset.editCat)))));
    main.querySelectorAll('[data-del-cat]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Delete this category? Items in it will become uncategorized.')) return;
      await api(`/admin/categories/${b.dataset.delCat}`, { method: 'DELETE' });
      await loadAll(); renderShell();
    }));
    main.querySelectorAll('[data-toggle-cat]').forEach((b) => b.addEventListener('click', async () => {
      await api(`/admin/categories/${b.dataset.toggleCat}/toggle-published`, { method: 'PATCH' });
      await loadAll(); renderShell();
    }));
    main.querySelectorAll('[data-move-up],[data-move-down]').forEach((b) => b.addEventListener('click', async () => {
      const id = Number(b.dataset.moveUp || b.dataset.moveDown);
      const dir = b.dataset.moveUp ? -1 : 1;
      const ids = state.categories.map((c) => c.id);
      const i = ids.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= ids.length) return;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      await api('/admin/categories/reorder', { method: 'POST', body: JSON.stringify({ order: ids }) });
      await loadAll(); renderShell();
    }));
  }

  function openCategoryModal(category) {
    const isNew = !category;
    const data = category || { name: {}, description: {}, is_new: false, is_signature: false, menu_group: 'food' };
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal">
        <h2>${isNew ? 'New Category' : 'Edit Category'}</h2>
        <div class="field">
          <label>Menu Group</label>
          <select data-field="menu_group">
            <option value="food" ${data.menu_group !== 'drink' ? 'selected' : ''}>Food Menu</option>
            <option value="drink" ${data.menu_group === 'drink' ? 'selected' : ''}>Drinks Menu</option>
          </select>
        </div>
        <div class="tabs">${LANGS.map((l, i) => `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${l.code}">${l.label}</button>`).join('')}</div>
        ${LANGS.map((l, i) => `
          <div class="tab-panel ${i === 0 ? 'active' : ''}" data-panel="${l.code}">
            <div class="field"><label>Name (${l.label})</label><input data-field="name_${l.code}" value="${escapeAttr(data.name[l.code] || '')}" /></div>
            <div class="field"><label>Description (${l.label})</label><textarea rows="2" data-field="desc_${l.code}">${escapeHtml(data.description[l.code] || '')}</textarea></div>
          </div>
        `).join('')}
        <div class="badge-grid">
          <label class="checkbox-row"><input type="checkbox" data-field="is_new" ${data.is_new ? 'checked' : ''}/> Mark as New</label>
          <label class="checkbox-row"><input type="checkbox" data-field="is_signature" ${data.is_signature ? 'checked' : ''}/> Signature category</label>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" data-cancel>Cancel</button>
          <button class="btn btn-primary" data-save>Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    setupTabs(backdrop);
    backdrop.querySelector('[data-cancel]').addEventListener('click', () => backdrop.remove());
    backdrop.querySelector('[data-save]').addEventListener('click', async () => {
      const payload = collectTranslatable(backdrop);
      payload.menu_group = backdrop.querySelector('[data-field="menu_group"]').value;
      payload.is_new = backdrop.querySelector('[data-field="is_new"]').checked;
      payload.is_signature = backdrop.querySelector('[data-field="is_signature"]').checked;
      try {
        if (isNew) await api('/admin/categories', { method: 'POST', body: JSON.stringify(payload) });
        else await api(`/admin/categories/${category.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        backdrop.remove();
        await loadAll(); renderShell();
      } catch (e) { alert(e.message); }
    });
  }

  // ---------------- Items page ----------------
  function renderItemsPage() {
    const main = document.getElementById('main');
    const cat = state.categories.find((c) => c.id === state.activeCategoryId) || state.categories[0];
    const items = state.items.filter((i) => cat && i.category_id === cat.id);
    main.innerHTML = `
      <div class="page-header">
        <div><h1>Menu Items</h1><p>Choose a category, then manage its dishes.</p></div>
        <button class="btn btn-primary" id="add-item-btn" ${cat ? '' : 'disabled'}>+ New Item</button>
      </div>
      <div class="toolbar">
        <select id="cat-select">
          ${state.categories.map((c) => `<option value="${c.id}" ${cat && c.id === cat.id ? 'selected' : ''}>${escapeHtml(c.name.en)}</option>`).join('')}
        </select>
      </div>
      <div class="card">
        <table>
          <thead><tr><th>Name (EN)</th><th>Price</th><th>Badges</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${items.map((i) => `
              <tr class="${i.published ? '' : 'row-draft'}">
                <td>${escapeHtml(i.name.en)}</td>
                <td>${i.price ?? '—'}</td>
                <td>${Object.entries(i.badges).filter(([, v]) => v).map(([k]) => (BADGES.find((b) => b[0] === k) || [k, k])[1]).join(', ') || '—'}</td>
                <td>
                  <span class="pill ${i.published ? 'pill-on' : 'pill-off'}">${i.published ? 'Published' : 'Hidden'}</span>
                  ${i.sold_out ? '<span class="pill pill-sold">Sold out</span>' : ''}
                </td>
                <td>
                  <button class="icon-btn" data-toggle-sold="${i.id}">${i.sold_out ? 'Mark available' : 'Mark sold out'}</button>
                  <button class="icon-btn" data-toggle-item="${i.id}">${i.published ? 'Hide' : 'Show'}</button>
                  <button class="icon-btn" data-edit-item="${i.id}">Edit</button>
                  <button class="icon-btn" data-del-item="${i.id}">Delete</button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="5" class="empty-hint">No items in this category yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
    main.querySelector('#cat-select').addEventListener('change', (e) => { state.activeCategoryId = Number(e.target.value); renderItemsPage(); });
    main.querySelector('#add-item-btn')?.addEventListener('click', () => openItemModal(null, cat));
    main.querySelectorAll('[data-edit-item]').forEach((b) => b.addEventListener('click', () => openItemModal(state.items.find((i) => i.id === Number(b.dataset.editItem)), cat)));
    main.querySelectorAll('[data-del-item]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Delete this item?')) return;
      await api(`/admin/items/${b.dataset.delItem}`, { method: 'DELETE' });
      await loadAll(); renderItemsPage();
    }));
    main.querySelectorAll('[data-toggle-item]').forEach((b) => b.addEventListener('click', async () => {
      await api(`/admin/items/${b.dataset.toggleItem}/toggle-published`, { method: 'PATCH' });
      await loadAll(); renderItemsPage();
    }));
    main.querySelectorAll('[data-toggle-sold]').forEach((b) => b.addEventListener('click', async () => {
      await api(`/admin/items/${b.dataset.toggleSold}/toggle-sold-out`, { method: 'PATCH' });
      await loadAll(); renderItemsPage();
    }));
  }

  function openItemModal(item, defaultCategory) {
    const isNew = !item;
    const data = item || { name: {}, description: {}, price_note: {}, badges: {}, category_id: defaultCategory && defaultCategory.id, image: null };
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal">
        <h2>${isNew ? 'New Item' : 'Edit Item'}</h2>
        <div class="field">
          <label>Category</label>
          <select data-field="category_id">
            ${state.categories.map((c) => `<option value="${c.id}" ${data.category_id === c.id ? 'selected' : ''}>${escapeHtml(c.name.en)}</option>`).join('')}
          </select>
        </div>
        <div class="tabs">${LANGS.map((l, i) => `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${l.code}">${l.label}</button>`).join('')}</div>
        ${LANGS.map((l, i) => `
          <div class="tab-panel ${i === 0 ? 'active' : ''}" data-panel="${l.code}">
            <div class="field"><label>Name (${l.label})</label><input data-field="name_${l.code}" value="${escapeAttr(data.name[l.code] || '')}" /></div>
            <div class="field"><label>Description (${l.label})</label><textarea rows="2" data-field="desc_${l.code}">${escapeHtml(data.description[l.code] || '')}</textarea></div>
            ${l.code !== 'ar' ? `<div class="field"><label>Price note (${l.label})</label><input data-field="price_note_${l.code}" value="${escapeAttr((data.price_note && data.price_note[l.code]) || '')}" placeholder="e.g. Tomato 100.- / Bolognese 150.-" /></div>` : ''}
          </div>
        `).join('')}
        <div class="grid-2">
          <div class="field"><label>Price (THB)</label><input type="number" step="1" data-field="price" value="${data.price ?? ''}" /></div>
          <div class="field"><label>Preparation time (minutes)</label><input type="number" step="1" data-field="preparation_time" value="${data.preparation_time ?? ''}" /></div>
        </div>
        <div class="field">
          <label>Photo</label>
          <div class="image-upload">
            <div class="image-preview" id="img-preview" style="${data.image ? `background-image:url('${data.image}')` : ''}">${data.image ? '' : '🍽'}</div>
            <input type="file" accept="image/*" id="img-input" />
          </div>
          <input type="hidden" data-field="image" value="${escapeAttr(data.image || '')}" />
        </div>
        <div class="field"><label>Badges</label>
          <div class="badge-grid">
            ${BADGES.map(([key, label]) => `<label class="checkbox-row"><input type="checkbox" data-field="${key}" ${data.badges && data.badges[key] ? 'checked' : ''}/> ${label}</label>`).join('')}
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" data-cancel>Cancel</button>
          <button class="btn btn-primary" data-save>Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    setupTabs(backdrop);

    let uploading = false;
    const saveBtn = backdrop.querySelector('[data-save]');
    const savedSaveLabel = saveBtn.textContent;

    backdrop.querySelector('#img-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('image', file);
      uploading = true;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Uploading photo…';
      const preview = backdrop.querySelector('#img-preview');
      const prevPreviewText = preview.textContent;
      preview.textContent = 'Uploading…';
      try {
        const res = await api('/admin/upload', { method: 'POST', body: fd });
        backdrop.querySelector('[data-field="image"]').value = res.url;
        preview.style.backgroundImage = `url('${res.url}')`;
        preview.textContent = '';
      } catch (err) {
        preview.textContent = prevPreviewText;
        alert('Image upload failed: ' + err.message);
      } finally {
        uploading = false;
        saveBtn.disabled = false;
        saveBtn.textContent = savedSaveLabel;
      }
    });

    backdrop.querySelector('[data-cancel]').addEventListener('click', () => backdrop.remove());
    saveBtn.addEventListener('click', async () => {
      if (uploading) { alert('Please wait for the photo to finish uploading before saving.'); return; }
      const payload = collectTranslatable(backdrop, true);
      payload.category_id = Number(backdrop.querySelector('[data-field="category_id"]').value);
      payload.price = numOrNull(backdrop.querySelector('[data-field="price"]').value);
      payload.preparation_time = numOrNull(backdrop.querySelector('[data-field="preparation_time"]').value);
      payload.image = backdrop.querySelector('[data-field="image"]').value || null;
      BADGES.forEach(([key]) => { payload[key] = backdrop.querySelector(`[data-field="${key}"]`).checked; });
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';
      try {
        if (isNew) await api('/admin/items', { method: 'POST', body: JSON.stringify(payload) });
        else await api(`/admin/items/${item.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        backdrop.remove();
        await loadAll(); renderItemsPage();
      } catch (e) {
        alert(e.message);
        saveBtn.disabled = false;
        saveBtn.textContent = savedSaveLabel;
      }
    });
  }

  // ---------------- Promotions page ----------------
  function renderPromotionsPage() {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="page-header">
        <div><h1>Promotions</h1><p>Banner-style promotions shown on the Food or Drinks menu page (pick which one below), and on the "Promotion" tab from the home screen.</p></div>
        <button class="btn btn-primary" id="add-promo-btn">+ New Promotion</button>
      </div>
      <div class="card">
        <table>
          <thead><tr><th>Banner</th><th>Title (EN)</th><th>Group</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${state.promotions.map((p, idx) => `
              <tr>
                <td><div class="promo-thumb" style="${p.image ? `background-image:url('${p.image}')` : ''}">${p.image ? '' : '🎉'}</div></td>
                <td>${escapeHtml(p.title.en)}</td>
                <td><span class="pill ${p.menu_group === 'drink' ? 'pill-off' : 'pill-on'}">${p.menu_group === 'drink' ? 'Drinks' : 'Food'}</span></td>
                <td><span class="pill ${p.published ? 'pill-on' : 'pill-off'}">${p.published ? 'Published' : 'Hidden'}</span></td>
                <td>
                  <button class="icon-btn" data-move-up="${p.id}" ${idx === 0 ? 'disabled' : ''}>↑</button>
                  <button class="icon-btn" data-move-down="${p.id}" ${idx === state.promotions.length - 1 ? 'disabled' : ''}>↓</button>
                  <button class="icon-btn" data-toggle-promo="${p.id}">${p.published ? 'Hide' : 'Show'}</button>
                  <button class="icon-btn" data-edit-promo="${p.id}">Edit</button>
                  <button class="icon-btn" data-del-promo="${p.id}">Delete</button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="5" class="empty-hint">No promotions yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
    main.querySelector('#add-promo-btn').addEventListener('click', () => openPromotionModal());
    main.querySelectorAll('[data-edit-promo]').forEach((b) => b.addEventListener('click', () => openPromotionModal(state.promotions.find((p) => p.id === Number(b.dataset.editPromo)))));
    main.querySelectorAll('[data-del-promo]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Delete this promotion?')) return;
      await api(`/admin/promotions/${b.dataset.delPromo}`, { method: 'DELETE' });
      await loadAll(); renderPromotionsPage();
    }));
    main.querySelectorAll('[data-toggle-promo]').forEach((b) => b.addEventListener('click', async () => {
      await api(`/admin/promotions/${b.dataset.togglePromo}/toggle-published`, { method: 'PATCH' });
      await loadAll(); renderPromotionsPage();
    }));
    main.querySelectorAll('[data-move-up],[data-move-down]').forEach((b) => b.addEventListener('click', async () => {
      const id = Number(b.dataset.moveUp || b.dataset.moveDown);
      const dir = b.dataset.moveUp ? -1 : 1;
      const ids = state.promotions.map((p) => p.id);
      const i = ids.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= ids.length) return;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      await api('/admin/promotions/reorder', { method: 'POST', body: JSON.stringify({ order: ids }) });
      await loadAll(); renderPromotionsPage();
    }));
  }

  function openPromotionModal(promo) {
    const isNew = !promo;
    const data = promo || { title: {}, subtitle: {}, image: null, menu_group: 'food' };
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal">
        <h2>${isNew ? 'New Promotion' : 'Edit Promotion'}</h2>
        <div class="field">
          <label>Show on</label>
          <select data-field="menu_group">
            <option value="food" ${data.menu_group !== 'drink' ? 'selected' : ''}>Food Menu</option>
            <option value="drink" ${data.menu_group === 'drink' ? 'selected' : ''}>Drinks Menu</option>
          </select>
        </div>
        <div class="field">
          <label>Banner image</label>
          <div class="image-upload">
            <div class="image-preview promo-preview" id="img-preview" style="${data.image ? `background-image:url('${data.image}')` : ''}">${data.image ? '' : '🎉'}</div>
            <input type="file" accept="image/*" id="img-input" />
          </div>
          <input type="hidden" data-field="image" value="${escapeAttr(data.image || '')}" />
        </div>
        <div class="tabs">${LANGS.map((l, i) => `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${l.code}">${l.label}</button>`).join('')}</div>
        ${LANGS.map((l, i) => `
          <div class="tab-panel ${i === 0 ? 'active' : ''}" data-panel="${l.code}">
            <div class="field"><label>Title (${l.label})</label><input data-field="title_${l.code}" value="${escapeAttr(data.title[l.code] || '')}" placeholder="e.g. Friday Night Brunch" /></div>
            <div class="field"><label>Subtitle (${l.label})</label><input data-field="subtitle_${l.code}" value="${escapeAttr((data.subtitle && data.subtitle[l.code]) || '')}" placeholder="e.g. Starting from THB 999" /></div>
          </div>
        `).join('')}
        <div class="modal-actions">
          <button class="btn btn-secondary" data-cancel>Cancel</button>
          <button class="btn btn-primary" data-save>Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    setupTabs(backdrop);

    let uploading = false;
    const saveBtn = backdrop.querySelector('[data-save]');
    const savedSaveLabel = saveBtn.textContent;

    backdrop.querySelector('#img-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('image', file);
      uploading = true;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Uploading photo…';
      const preview = backdrop.querySelector('#img-preview');
      const prevPreviewText = preview.textContent;
      preview.textContent = 'Uploading…';
      try {
        const res = await api('/admin/upload', { method: 'POST', body: fd });
        backdrop.querySelector('[data-field="image"]').value = res.url;
        preview.style.backgroundImage = `url('${res.url}')`;
        preview.textContent = '';
      } catch (err) {
        preview.textContent = prevPreviewText;
        alert('Image upload failed: ' + err.message);
      } finally {
        uploading = false;
        saveBtn.disabled = false;
        saveBtn.textContent = savedSaveLabel;
      }
    });

    backdrop.querySelector('[data-cancel]').addEventListener('click', () => backdrop.remove());
    saveBtn.addEventListener('click', async () => {
      if (uploading) { alert('Please wait for the banner photo to finish uploading before saving.'); return; }
      const title = {}, subtitle = {};
      LANGS.forEach((l) => {
        title[l.code] = backdrop.querySelector(`[data-field="title_${l.code}"]`)?.value || '';
        subtitle[l.code] = backdrop.querySelector(`[data-field="subtitle_${l.code}"]`)?.value || '';
      });
      const payload = {
        title,
        subtitle,
        image: backdrop.querySelector('[data-field="image"]').value || null,
        menu_group: backdrop.querySelector('[data-field="menu_group"]').value,
      };
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';
      try {
        if (isNew) await api('/admin/promotions', { method: 'POST', body: JSON.stringify(payload) });
        else await api(`/admin/promotions/${promo.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        backdrop.remove();
        await loadAll(); renderPromotionsPage();
      } catch (e) {
        alert(e.message);
        saveBtn.disabled = false;
        saveBtn.textContent = savedSaveLabel;
      }
    });
  }

  // ---------------- Home screen settings page ----------------
  function renderHomeSettingsPage() {
    const main = document.getElementById('main');
    const bg = state.settings.home_background_image;
    main.innerHTML = `
      <div class="page-header">
        <div><h1>Home Screen</h1><p>The background photo guests see on the welcome screen, before they pick Food Menu / Drinks Menu / Promotion.</p></div>
      </div>
      <div class="card" style="padding:24px;max-width:520px;">
        <div class="field">
          <label>Background photo</label>
          <div class="image-upload">
            <div class="image-preview home-bg-preview" id="bg-preview" style="${bg ? `background-image:url('${bg}')` : ''}">${bg ? '' : '🏨'}</div>
            <input type="file" accept="image/*" id="bg-input" />
          </div>
          <input type="hidden" id="bg-value" value="${escapeAttr(bg || '')}" />
        </div>
        <div class="modal-actions" style="border-top:none;justify-content:flex-start;padding-top:6px;">
          <button class="btn btn-primary" id="save-home-btn">Save</button>
          <span id="home-save-msg" style="font-size:13px;color:var(--ink-soft);"></span>
        </div>
      </div>
    `;
    let uploading = false;
    const saveBtn = main.querySelector('#save-home-btn');
    main.querySelector('#bg-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('image', file);
      uploading = true;
      saveBtn.disabled = true;
      const preview = main.querySelector('#bg-preview');
      preview.textContent = 'Uploading…';
      try {
        const res = await api('/admin/upload', { method: 'POST', body: fd });
        main.querySelector('#bg-value').value = res.url;
        preview.style.backgroundImage = `url('${res.url}')`;
        preview.textContent = '';
      } catch (err) {
        alert('Image upload failed: ' + err.message);
      } finally {
        uploading = false;
        saveBtn.disabled = false;
      }
    });
    saveBtn.addEventListener('click', async () => {
      if (uploading) { alert('Please wait for the photo to finish uploading before saving.'); return; }
      const msg = main.querySelector('#home-save-msg');
      try {
        await api('/admin/settings', { method: 'PUT', body: JSON.stringify({ home_background_image: main.querySelector('#bg-value').value || '' }) });
        await loadAll();
        msg.textContent = 'Saved ✓';
        setTimeout(() => { if (msg) msg.textContent = ''; }, 2500);
      } catch (e) { alert(e.message); }
    });
  }

  // ---------------- Import page ----------------
  function renderImportPage() {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="page-header"><div><h1>Import Menu</h1><p>Upload an .xlsx file with "Section" and "Item" sheets (same layout as your existing menu template) to bulk-load or update the menu.</p></div></div>
      <div class="card">
        <div class="import-drop">
          <p>📄 Choose an .xlsx file exported from Google Sheets or Excel</p>
          <input type="file" id="import-file" accept=".xlsx,.xls" />
        </div>
        <div id="import-result" class="import-result"></div>
      </div>
    `;
    main.querySelector('#import-file').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const resultBox = main.querySelector('#import-result');
      resultBox.innerHTML = '<p>Importing…</p>';
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await api('/admin/import', { method: 'POST', body: fd });
        const r = res.result;
        resultBox.innerHTML = `
          <div class="success-msg">Import complete.</div>
          <p><strong>Categories:</strong> ${r.categories.created} created, ${r.categories.updated} updated</p>
          <p><strong>Items:</strong> ${r.items.created} created, ${r.items.updated} updated</p>
          ${r.items.skipped.length ? `<p><strong>Skipped (${r.items.skipped.length}):</strong></p><ul>${r.items.skipped.map((s) => `<li>${escapeHtml(s.name_en)} — ${escapeHtml(s.reason)}</li>`).join('')}</ul>` : ''}
        `;
        await loadAll();
      } catch (err) {
        resultBox.innerHTML = `<div class="error-msg">${escapeHtml(err.message)}</div>`;
      }
    });
  }

  // ---------------- Helpers ----------------
  function setupTabs(root) {
    root.querySelectorAll('.tab-btn').forEach((btn) => btn.addEventListener('click', () => {
      root.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      root.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      root.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    }));
  }

  function collectTranslatable(root, withPriceNote) {
    const name = {}, description = {}, price_note = {};
    LANGS.forEach((l) => {
      name[l.code] = root.querySelector(`[data-field="name_${l.code}"]`)?.value || '';
      description[l.code] = root.querySelector(`[data-field="desc_${l.code}"]`)?.value || '';
      if (withPriceNote) price_note[l.code] = root.querySelector(`[data-field="price_note_${l.code}"]`)?.value || '';
    });
    const payload = { name, description };
    if (withPriceNote) payload.price_note = price_note;
    return payload;
  }

  function numOrNull(v) { return v === '' || v === null || v === undefined ? null : Number(v); }

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }

  // ---------------- Boot ----------------
  (async function init() {
    try {
      const me = await api('/auth/me');
      state.user = me.user;
      await loadAll();
      renderShell();
    } catch (e) {
      renderLogin();
    }
  })();
})();
