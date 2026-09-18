(function () {
  const LANG_LABELS = { en: 'EN', th: 'TH', ru: 'RU', zh: '中文', ar: 'AR' };
  const RTL_LANGS = new Set(['ar']);

  const UI_STRINGS = {
    en: { menu: 'Menu', itemsCount: (n) => `${n} item${n === 1 ? '' : 's'}`, soldOut: 'Sold out', prepTime: (m) => `${m} min`, loadError: 'Could not load the menu. Please check your connection and try again.', empty: 'No items in this category yet.', foodMenu: 'Food Menu', drinksMenu: 'Drinks Menu', promotionMenu: 'Promotion', back: 'Back', noPromotions: 'No promotions right now.' },
    th: { menu: 'เมนู', itemsCount: (n) => `${n} รายการ`, soldOut: 'หมดชั่วคราว', prepTime: (m) => `${m} นาที`, loadError: 'ไม่สามารถโหลดเมนูได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่', empty: 'ยังไม่มีรายการในหมวดนี้', foodMenu: 'เมนูอาหาร', drinksMenu: 'เมนูเครื่องดื่ม', promotionMenu: 'โปรโมชั่น', back: 'กลับ', noPromotions: 'ยังไม่มีโปรโมชั่นในโขณะนี้' },
    ru: { menu: 'Меню', itemsCount: (n) => `${n} поз.`, soldOut: 'Нет в наличии', prepTime: (m) => `${m} мин`, loadError: 'Не удалось загрузить меню. Проверьте соединение и попробуйте снова.', empty: 'В этой категории пока нет блюд.', foodMenu: 'Меню блюд', drinksMenu: 'Меню напитков', promotionMenu: 'Акции', back: 'Назад', noPromotions: 'Сейчас нет активных акций.' },
    zh: { menu: '菜单', itemsCount: (n) => `${n} 项`, soldOut: '暂时缺货', prepTime: (m) => `${m} 分钟`, loadError: '无法加载菜单，请检查网络连接后重试。', empty: '该分类暂无项目。', foodMenu: '餐食菜单', drinksMenu: '饮品菜单', promotionMenu: '优惠活动', back: '返回', noPromotions: '暂无优惠活动。' },
    ar: { menu: 'القائمة', itemsCount: (n) => `${n} صنف`, soldOut: 'غير متوفر حالياً', prepTime: (m) => `${m} دقيقة`, loadError: 'تعذر تحميل القائمة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.', empty: 'لا توجد عناصر في هذا القسم بعد.', foodMenu: 'قائمة الطعام', drinksMenu: 'قائمة المشروبات', promotionMenu: 'العروض', back: 'رجوع', noPromotions: 'لا توجد عروض حالياً.' },
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
    view: 'home', // 'home' | 'menu' | 'promotions'
    menuGroup: 'food', // 'food' | 'drink', only used when view === 'menu'
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

    if (state.view === 'home') return renderHome();
    if (state.view === 'promotions') return renderPromotions();
    return renderMenu();
  }

  function renderLangSwitcher(active) {
    return `
      <div class="lang-switcher" id="lang-switcher">
        ${(state.menu.languages || Object.keys(LANG_LABELS)).map((l) => `
          <button class="lang-btn ${l === state.lang ? 'active' : ''}" data-lang="${l}">${LANG_LABELS[l] || l.toUpperCase()}</button>
        `).join('')}
      </div>
    `;
  }

  function bindLangSwitcher(root) {
    root.querySelector('#lang-switcher')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      state.lang = btn.dataset.lang;
      localStorage.setItem('menu_lang', state.lang);
      render();
    });
  }

  // ---------------- Home screen ----------------
  function renderHome() {
    const app = document.getElementById('app');
    const bg = state.menu.home_background_image;
    const promoCount = (state.menu.promotions || []).length;
    app.innerHTML = `
      <div class="home-screen" ${bg ? `style="background-image:url('${bg}')"` : ''}>
        <div class="home-top">${renderLangSwitcher()}</div>
        <div class="home-overlay">
          <div class="home-brand">
            <div class="home-hotel">${escapeHtml(state.menu.hotel_name || '')}</div>
            <div class="home-name">${escapeHtml(state.menu.restaurant_name || 'Menu')}</div>
          </div>
          <div class="home-buttons">
            <button class="home-btn" data-go="food">${escapeHtml(t('foodMenu'))}</button>
            <button class="home-btn" data-go="drink">${escapeHtml(t('drinksMenu'))}</button>
            ${promoCount ? `<button class="home-btn home-btn-accent" data-go="promotions">${escapeHtml(t('promotionMenu'))}</button>` : ''}
          </div>
        </div>
      </div>
    `;
    bindLangSwitcher(app);
    app.querySelectorAll('[data-go]').forEach((btn) => btn.addEventListener('click', () => {
      const go = btn.dataset.go;
      if (go === 'promotions') { state.view = 'promotions'; }
      else { state.view = 'menu'; state.menuGroup = go; state.activeCategoryId = null; }
      render();
    }));
  }

  // ---------------- Menu (food / drinks) ----------------
  function renderMenu() {
    const app = document.getElementById('app');
    const categories = (state.menu.categories || []).filter((c) => (c.menu_group || 'food') === state.menuGroup);
    if (!state.activeCategoryId || !categories.some((c) => c.id === state.activeCategoryId)) {
      state.activeCategoryId = categories.length ? categories[0].id : null;
    }
    const activeCategory = categories.find((c) => c.id === state.activeCategoryId);

    app.innerHTML = `
      <div class="header">
        <button class="back-btn" id="back-home" aria-label="${escapeHtml(t('back'))}">←</button>
        <div class="brand">
          <div class="brand-hotel">${escapeHtml(state.menu.hotel_name || '')}</div>
          <div class="brand-name">${escapeHtml(state.menu.restaurant_name || 'Menu')}</div>
        </div>
        ${renderLangSwitcher()}
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
          ${renderPromoBanner()}
          ${renderCategoryContent(activeCategory)}
        </div>
      </div>
    `;

    bindLangSwitcher(app);
    document.getElementById('back-home').addEventListener('click', () => { state.view = 'home'; render(); });

    document.getElementById('category-rail').addEventListener('click', (e) => {
      const btn = e.target.closest('.category-btn');
      if (!btn) return;
      state.activeCategoryId = Number(btn.dataset.cat);
      render();
    });

    document.getElementById('content').addEventListener('click', (e) => {
      const promoCard = e.target.closest('.promo-banner-card');
      if (promoCard) {
        const promotions = state.menu.promotions || [];
        const promo = promotions.find((p) => p.id === Number(promoCard.dataset.promo));
        if (promo) openPromoModal(promo);
        return;
      }
      const card = e.target.closest('.item-card');
      if (!card || !activeCategory) return;
      const item = activeCategory.items.find((i) => i.id === Number(card.dataset.item));
      if (item) openItemModal(item);
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

  function openItemModal(item) {
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

  // ---------------- Promo banner (inline on the food/drinks menu) ----------------
  function renderPromoBanner() {
    // Only show promotions tagged for whichever menu (food/drink) the guest
    // is currently viewing, so a food promo never appears on the drinks menu
    // and vice versa.
    const promotions = (state.menu.promotions || []).filter((p) => (p.menu_group || 'food') === state.menuGroup);
    if (!promotions.length) return '';
    return `
      <div class="promo-banner-strip" id="promo-banner-strip">
        ${promotions.map(renderPromoBannerCard).join('')}
      </div>
    `;
  }

  function renderPromoBannerCard(promo) {
    const title = fmt(promo.title);
    const subtitle = fmt(promo.subtitle);
    return `
      <div class="promo-banner-card" data-promo="${promo.id}">
        <div class="promo-banner-image" style="${promo.image ? `background-image:url('${promo.image}')` : ''}">
          ${title || subtitle ? `
            <div class="promo-banner-scrim">
              ${title ? `<div class="promo-banner-title">${escapeHtml(title)}</div>` : ''}
              ${subtitle ? `<div class="promo-banner-subtitle">${escapeHtml(subtitle)}</div>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ---------------- Promotions ----------------
  function renderPromotions() {
    const app = document.getElementById('app');
    const promotions = state.menu.promotions || [];
    app.innerHTML = `
      <div class="header">
        <button class="back-btn" id="back-home" aria-label="${escapeHtml(t('back'))}">←</button>
        <div class="brand">
          <div class="brand-hotel">${escapeHtml(state.menu.hotel_name || '')}</div>
          <div class="brand-name">${escapeHtml(state.menu.restaurant_name || 'Menu')}</div>
        </div>
        ${renderLangSwitcher()}
      </div>
      <div class="content promo-content">
        ${promotions.length ? `
          <div class="promo-feed" id="promo-feed">
            ${promotions.map(renderPromoCard).join('')}
          </div>
        ` : `<div class="empty-state">${escapeHtml(t('noPromotions'))}</div>`}
      </div>
    `;
    bindLangSwitcher(app);
    document.getElementById('back-home').addEventListener('click', () => { state.view = 'home'; render(); });
    document.getElementById('promo-feed')?.addEventListener('click', (e) => {
      const card = e.target.closest('.promo-card');
      if (!card) return;
      const promo = promotions.find((p) => p.id === Number(card.dataset.promo));
      if (promo) openPromoModal(promo);
    });
  }

  function renderPromoCard(promo) {
    return `
      <div class="promo-card" data-promo="${promo.id}">
        <div class="promo-card-image" style="${promo.image ? `background-image:url('${promo.image}')` : ''}">
          <div class="promo-card-scrim">
            <div class="promo-card-title">${escapeHtml(fmt(promo.title))}</div>
            ${fmt(promo.subtitle) ? `<div class="promo-card-subtitle">${escapeHtml(fmt(promo.subtitle))}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function openPromoModal(promo) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop promo-modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal promo-modal">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="promo-modal-image" style="${promo.image ? `background-image:url('${promo.image}')` : ''}"></div>
        <div class="modal-body">
          <div class="item-name">${escapeHtml(fmt(promo.title))}</div>
          ${fmt(promo.subtitle) ? `<div class="item-desc">${escapeHtml(fmt(promo.subtitle))}</div>` : ''}
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
