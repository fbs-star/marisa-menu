(function () {
  const LANG_LABELS = { en: 'EN', th: 'TH', ru: 'RU', zh: '中文', ar: 'AR' };
  const RTL_LANGS = new Set(['ar']);

  const UI_STRINGS = {
    en: { menu: 'Menu', itemsCount: (n) => `${n} item${n === 1 ? '' : 's'}`, soldOut: 'Sold out', prepTime: (m) => `${m} min`, loadError: 'Could not load the menu. Please check your connection and try again.', empty: 'No items in this category yet.' },
    th: { menu: 'เมนู', itemsCount: (n) => `${n} รายการ`, soldOut: 'หมดชั่วคราว', prepTime: (m) => `${m} นาที`, loadError: 'ไม่สามารถโหลดเมนูได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่', empty: 'ยังไม่มีรายการในหมวดนี้' },
    ru: { menu: 'Меню', itemsCount: (n) => `${n} поз.`, soldOut: 'Нет в наличии', prepTime: (m) => `${m} мин`, loadError: 'Не удалось загрузить меню. Проверьте соединение и попробуйте снова.', empty: 'В этой категории пока нет блюд.' },
    zh: { menu: '菜单', itemsCount: (n) => `${n} 项`, soldOut: '暂时缺货', prepTime: (m) => `${m} 分钟`, loadError: '无法加载菜单，请检查网络连接后重试。', empty: '该分类暂无项目。' },
    ar: { menu: 'القائمة', itemsCount: (n) => `${n} صنف`, soldOut: 'غير متوفر حالياً', prepTime: (m) => `${m} دقيقة`, loadError: 'تعذر تحميل القائمة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.', empty: 'لا توجد عناصر في هذا القسم بعد.' },
  };

  const BADGE_LABELS = {
    is_new: { en: 'New', th: 'ใหม่', ru: 'Новинка', zh: '新品', ar: 'جديد', cls: 'badge-new' },
    is_signature: { en: 'Signature', th: 'ซิกเนเจอร์', ru: 'Фирменное', zh: '招牌', ar: 'مميز', cls: '' },
    is_chefs_special: { en: "Chef's Special", th: 'เชฟแนะนำ', ru: 'От шефа', zh: '主厨推荐', ar: 'اختيار الشيف', cls: 'badge-chef' },
    is_must_try: { en: 'Must Try', th: 'ต้องลอง', ru: 'Стоит попробовать', zh: '必试', ar: 'يجب تجربته', cls: '' },
    is_best_seller: { en: 'Best Seller', th: 'ขายดี', ru: 'Хит продаж', zh: '畅销', ar: 'الأكثر مبيعاً', cls: '' },
    is_our_favorite: { en: 'Our Favorite', th: 'ร้านแนะนำ', ru: 'Наш любимый', zh: '店家最爱', ar: 'المفضل لدينا', cls: '' },
    is_healthy: { en: 'Healthy', th: 'เพื่อสุขภาพ', ru: 'Полезно', zh: '健康', ar: 'صحي', cls: 'badge-healthy' },
  };

  const FOOD_ICONS = ['🍽️', '🥗', '🌶️', '🍜', '🥩', '🍹', '🍰', '☕', '🍺', '🍹'];

  let state = {
    lang: localStorage.getItem('menu_lang') || 'en',
    menu: null,
    activeCategoryId: null,
  };

  function t(key, ...args) {
    const s = UI_STRINGS[state.lang] || UI_STRINGS.en;
    const v = s[key];
    return typeof v === 'function' ? v(...args) : v;
  }

  function fmt(obj) {
    if (!obj) return '';
    return obj[state.lang] || obj.en || '';
  }

  async function fetchMenu() {
    const res = await fetch('/api/public/menu');
    if (!res.ok) throw new Error('Failed to load menu');
    return res.json();
  }

  function render() {
    const app = document.getElementById('app');
    document.body.setAttribute('data-lang', state.lang);
    document.body.setAttribute('dir', RTL_LANGS.has(state.lang) ? 'rtl' : 'ltr');

    if (!state.menu) {
      app.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';
      return;
    }

    const categories = state.menu.categories || [];
    if (!state.activeCategoryId && categories.length) state.activeCategoryId = categories[0].id;
    const activeCategory = categories.find((c) => c.id === state.activeCategoryId) || categories[0];

    app.innerHTML = `
      <div class="header">
        <div class="brand">
          <div class="brand-hotel">${escapeHtml(state.menu.hotel_name || '')}</div>
          <div class="brand-name">${escapeHtml(state.menu.restaurant_name || 'Menu')}</div>
        </div>
        <div class="lang-switcher" id="lang-switcher">
          ${(state.menu.languages || Object.keys(LANG_LABELS)).map((l) => `
            <button class="lang-btn ${l === state.lang ? 'active' : ''}" data-lang="${l}">${LANG_LABELS[l] || l.toUpperCase()}</button>
          `).join('')}
        </div>
      </div>
      <div class="main">
        <nav class="category-rail" id="category-rail">
          ${categories.map((c) => `
            <button class="category-btn ${c.id === (activeCategory && activeCategory.id) ? 'active' : ''}" data-cat="${c.id}">
              <span class="cat-name">${escapeHtml(fmt(c.name))}</span>
              <span class="cat-count">${escapeHtml(t('itemsCount', c.items.length))}</span>
            </button>
          `).join('')}
        </nav>
        <div class="content" id="content">
          ${renderCategoryContent(activeCategory)}
        </div>
      </div>
    `;

    document.getElementById('lang-switcher').addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      state.lang = btn.dataset.lang;
      localStorage.setItem('menu_lang', state.lang);
      render();
    });

    document.getElementById('category-rail').addEventListener('click', (e) => {
      const btn = e.target.closest('.category-btn');
      if (!btn) return;
      state.activeCategoryId = Number(btn.dataset.cat);
      render();
    });

    document.getElementById('content').addEventListener('click', (e) => {
      const card = e.target.closest('.item-card');
      if (!card) return;
      const item = activeCategory.items.find((i) => i.id === Number(card.dataset.item));
      if (item) openModal(item);
    });
  }

  function renderCategoryContent(category) {
    if (!category) return `<div class="empty-state">${escapeHtml(t('empty'))}</div>`;
    return `
      <div class="category-heading">
        <h2>${escapeHtml(fmt(category.name))}</h2>
        ${fmt(category.description) ? `<p>${escapeHtml(fmt(category.description))}</p>` : ''}
      </div>
      <div class="item-grid">
        ${category.items.map(renderItemCard).join('')}
      </div>
    `;
  }

  function renderItemCard(item) {
    const icon = FOOD_ICONS[(item.food_color_code || 0) % FOOD_ICONS.length];
    return `
      <div class="item-card ${item.sold_out ? 'sold-out' : ''}" data-item="${item.id}">
        ${item.sold_out ? `<span class="sold-out-tag">${escapeHtml(t('soldOut'))}</span>` : ''}
        <div class="item-image" style="${item.image ? `background-image:url('${item.image}')` : ''}">
          ${item.image ? '' : icon}
        </div>
        <div class="item-body">
          ${renderBadges(item.badges)}
          <div class="item-name">${escapeHtml(fmt(item.name))}</div>
          ${fmt(item.description) ? `<div class="item-desc">${escapeHtml(fmt(item.description))}</div>` : ''}
          <div class="item-footer">
            ${renderPrice(item)}
          </div>
        </div>
      </div>
    `;
  }

  function renderPrice(item) {
    if (item.price === null || item.price === undefined) return '<span></span>';
    return `<span class="item-price">${formatNumber(item.price)}<span class="currency">${escapeHtml(state.menu.currency || 'THB')}</span></span>`;
  }

  function renderBadges(badges) {
    if (!badges) return '';
    const active = Object.entries(badges).filter(([, v]) => v).map(([k]) => k);
    if (!active.length) return '';
    return `<div class="item-badges">${active.map((k) => {
      const b = BADGE_LABELS[k];
      if (!b) return '';
      return `<span class="badge ${b.cls}">${escapeHtml(b[state.lang] || b.en)}</span>`;
    }).join('')}</div>`;
  }

  function openModal(item) {
    const icon = FOOD_ICONS[(item.food_color_code || 0) % FOOD_ICONS.length];
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="modal-image" style="${item.image ? `background-image:url('${item.image}')` : ''}">
          ${item.image ? '' : icon}
        </div>
        <div class="modal-body">
          ${renderBadges(item.badges)}
          <div class="item-name">${escapeHtml(fmt(item.name))}</div>
          ${fmt(item.description) ? `<div class="item-desc">${escapeHtml(fmt(item.description))}</div>` : ''}
          ${item.sold_out ? `<div class="sold-out-tag" style="position:static;display:inline-block;">${escapeHtml(t('soldOut'))}</div>` : ''}
          <div class="modal-price-row">
            ${renderPrice(item)}
          </div>
          ${fmt(item.price_note) ? `<div class="price-note">${escapeHtml(fmt(item.price_note))}</div>` : ''}
          <div class="meta-row">
            ${item.preparation_time ? `<span>⏱ ${escapeHtml(t('prepTime', item.preparation_time))}</span>` : ''}
          </div>
        </div>
      </div>
    `;
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.closest('.modal-close')) backdrop.remove();
    });
    document.body.appendChild(backdrop);
  }

  function formatNumber(n) {
    return Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  async function init() {
    try {
      state.menu = await fetchMenu();
      render();
    } catch (e) {
      document.getElementById('app').innerHTML = `<div class="empty-state" style="padding-top:120px">${escapeHtml(t('loadError'))}</div>`;
    }
  }

  init();
})();

