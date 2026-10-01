(function () {
  const LANG_LABELS = { en: 'EN', th: 'TH', ru: 'RU', zh: '中文', ar: 'AR' };
  const RTL_LANGS = new Set(['ar']);

  const UI_STRINGS = {
    en: { menu: 'Menu', itemsCount: (n) => `${n} item${n === 1 ? '' : 's'}`, soldOut: 'Sold out', prepTime: (m) => `${m} min`, loadError: 'Could not load the menu. Please check your connection and try again.', empty: 'No items in this category yet.', foodMenu: 'Food Menu', drinksMenu: 'Drinks Menu', wineMenu: 'Wine Menu', promotionMenu: 'Promotion', back: 'Back', noPromotions: 'No promotions right now.', promoTabFood: 'Food', promoTabDrink: 'Drinks', promoTabThemeNight: 'Theme Night', allergyNotice: 'Please inform our service team before placing your order\nif a person in your party has a food allergy or any dietary requirements.', dietSpicy: 'Spicy', dietGlutenFree: 'Gluten-Free', dietVegan: 'Vegan', dietContainsPork: 'Contains Pork', dietContainsShellfish: 'Contains Shellfish', dietLegendTitle: 'Icon Guide' },
    th: { menu: 'เมนู', itemsCount: (n) => `${n} รายการ`, soldOut: 'หมดชั่วคราว', prepTime: (m) => `${m} นาที`, loadError: 'ไม่สามารถโหลดเมนูได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่', empty: 'ยังไม่มีรายการในหมวดนี้', foodMenu: 'เมนูอาหาร', drinksMenu: 'เมนูเครื่องดื่ม', wineMenu: 'เมนูไวน์', promotionMenu: 'โปรโมชั่น', back: 'กลับ', noPromotions: 'ยังไม่มีโปรโมชั่นในโขณะนี้', promoTabFood: 'อาหาร', promoTabDrink: 'เครื่องดื่ม', promoTabThemeNight: 'ธีมค่ำคืน', allergyNotice: 'กรุณาแจ้งพนักงานก่อนสั่งอาหาร\nหากท่านหรือผู้ร่วมโต๊ะมีอาการแพ้อาหารหรือข้อจำกัดด้านอาหาร', dietSpicy: 'เผ็ด', dietGlutenFree: 'ปราศจากกลูเตน', dietVegan: 'วีแกน', dietContainsPork: 'มีส่วนผสมของหมู', dietContainsShellfish: 'มีส่วนผสมของกุ้ง/หอย', dietLegendTitle: 'คำอธิบายสัญลักษณ์' },
    ru: { menu: 'Меню', itemsCount: (n) => `${n} поз.`, soldOut: 'Нет в наличии', prepTime: (m) => `${m} мин`, loadError: 'Не удалось загрузить меню. Проверьте соединение и попробуйте снова.', empty: 'В этой категории пока нет блюд.', foodMenu: 'Меню блюд', drinksMenu: 'Меню напитков', wineMenu: 'Винная карта', promotionMenu: 'Акции', back: 'Назад', noPromotions: 'Сейчас нет активных акций.', promoTabFood: 'Еда', promoTabDrink: 'Напитки', promoTabThemeNight: 'Тематический вечер', allergyNotice: 'Пожалуйста, сообщите нашим сотрудникам перед заказом,\nесли у кого-то из вашей компании есть пищевая аллергия или особые требования к питанию.', dietSpicy: 'Острое', dietGlutenFree: 'Без глютена', dietVegan: 'Веганское', dietContainsPork: 'Содержит свинину', dietContainsShellfish: 'Содержит ракообразных/моллюсков', dietLegendTitle: 'Обозначения' },
    zh: { menu: '菜单', itemsCount: (n) => `${n} 项`, soldOut: '暂时缺货', prepTime: (m) => `${m} 分钟`, loadError: '无法加载菜单，请检查网络连接后重试。', empty: '该分类暂无项目。', foodMenu: '餐食菜单', drinksMenu: '饮品菜单', wineMenu: '酒水单', promotionMenu: '优惠活动', back: '返回', noPromotions: '暂无优惠活动。', promoTabFood: '餐食', promoTabDrink: '饮品', promoTabThemeNight: '主题之夜', allergyNotice: '如果您或同桌的客人对某些食物过敏或有饮食限制，\n请在点餐前告知我们的服务人员。', dietSpicy: '辣', dietGlutenFree: '无麸质', dietVegan: '纯素', dietContainsPork: '含猪肉', dietContainsShellfish: '含贝类/虾蟹', dietLegendTitle: '图标说明' },
    ar: { menu: 'القائمة', itemsCount: (n) => `${n} صنف`, soldOut: 'غير متوفر حالياً', prepTime: (m) => `${m} دقيقة`, loadError: 'تعذر تحميل القائمة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.', empty: 'لا توجد عناصر في هذا القسم بعد.', foodMenu: 'قائمة الطعام', drinksMenu: 'قائمة المشروبات', wineMenu: 'قائمة النبيذ', promotionMenu: 'العروض', back: 'رجوع', noPromotions: 'لا توجد عروض حالياً.', promoTabFood: 'طعام', promoTabDrink: 'مشروبات', promoTabThemeNight: 'ليلة موضوعية', allergyNotice: 'يرجى إبلاغ فريق الخدمة لدينا قبل تقديم طلبكم\nإذا كان أحد أفراد مجموعتكم يعاني من حساسية تجاه الطعام أو لديه أي متطلبات غذائية خاصة.', dietSpicy: 'حار', dietGlutenFree: 'خالٍ من الغلوتين', dietVegan: 'نباتي بحت', dietContainsPork: 'يحتوي على لحم الخنزير', dietContainsShellfish: 'يحتوي على المحار/القشريات', dietLegendTitle: 'دليل الرموز' },
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

  // Factual dietary/allergen flags (item.dietary — see backend/helpers.js
  // nestItem()), distinct from the marketing BADGE_LABELS above. Rendered as
  // small icons next to the item name (renderDietaryIcons) plus a bottom
  // legend explaining each one (renderDietaryLegend).
  //
  // The owner sent the exact artwork to use (a small gold legend strip reading
  // "Spicy · Gluten-Free · Vegan · Contains Pork · Contains Shell") and asked
  // for these icons specifically, not a lookalike redraw. So each `d` below
  // is traced directly from that reference image rather than hand-drawn:
  // thresholded to a clean silhouette, then run through potrace (a
  // raster-to-vector tool) to get the exact outline as a bezier path. Each
  // icon keeps its own natural viewBox (set per-entry below) rather than
  // being force-fit to a shared 24x24 grid, since that's what potrace traced
  // from the source pixels. The Gluten-Free and Contains Shell holes (the
  // wheat+slash, the antenna line) come for free from the traced path's own
  // subpaths (SVG's default nonzero fill rule treats an oppositely-wound
  // inner subpath as a hole) — no `<mask>` needed. The two small eye dots on
  // Contains Pork were too faint to survive the trace at this icon's size, so
  // they're added back as two plain circles alongside the traced path.
  const DIETARY_DEFS = [
    {
      key: 'is_spicy', label: 'dietSpicy', cls: 'dietary-spicy', viewBox: '0 0 32 40',
      svg: () => '<g transform="translate(0,40) scale(0.1,-0.1)" fill="currentColor">'
        + '<path d="M84 185 c-4 -8 -4 -22 0 -30 3 -8 0 -26 -6 -40 -23 -50 52 -115 134 -115 26 0 50 5 53 10 3 6 -2 10 -12 10 -28 1 -52 24 -76 72 -17 32 -29 44 -49 46 -30 4 -44 28 -27 48 9 11 9 14 0 14 -6 0 -14 -7 -17 -15z m56 -65 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4 -4 4 -10z M153 183 c-34 -13 6 -62 53 -64 23 -1 25 -3 7 -6 -27 -5 -30 -21 -7 -30 12 -4 13 -7 3 -14 -10 -6 -9 -10 5 -15 24 -9 56 27 56 63 0 13 5 33 10 44 13 24 -11 27 -30 4 -18 -21 -32 -19 -25 5 6 17 2 20 -27 19 -18 0 -39 -3 -45 -6z"/>'
        + '</g>',
    },
    {
      key: 'is_gluten_free', label: 'dietGlutenFree', cls: 'dietary-gluten-free', viewBox: '0 0 35 40',
      svg: () => '<g transform="translate(0,40) scale(0.1,-0.1)" fill="currentColor">'
        + '<path d="M145 188 c-30 -16 -30 -16 -10 -38 l18 -20 14 20 c15 21 15 21 39 -5 15 -17 24 -38 24 -59 0 -19 7 -40 16 -47 14 -11 18 -10 30 6 32 44 10 111 -46 140 -34 18 -58 19 -85 3z M92 148 c-22 -22 -14 -92 13 -122 20 -22 32 -26 79 -26 58 0 76 11 56 35 -16 19 -25 19 -44 -1 -9 -8 -16 -11 -16 -5 0 5 -9 13 -20 16 -15 5 -20 15 -20 44 0 44 -28 79 -48 59z M175 150 c-4 -6 -3 -16 3 -22 5 -5 12 -6 15 -1 3 5 2 15 -2 22 -7 10 -10 10 -16 1z M152 109 c2 -7 10 -15 17 -17 8 -3 12 1 9 9 -2 7 -10 15 -17 17 -8 3 -12 -1 -9 -9z M195 109 c-4 -6 -5 -13 -2 -16 7 -7 27 6 27 18 0 12 -17 12 -25 -2z M152 69 c2 -7 10 -15 17 -17 8 -3 12 1 9 9 -2 7 -10 15 -17 17 -8 3 -12 -1 -9 -9z M195 69 c-4 -6 -5 -13 -2 -16 7 -7 27 6 27 18 0 12 -17 12 -25 -2z"/>'
        + '</g>',
    },
    {
      key: 'is_vegan', label: 'dietVegan', cls: 'dietary-vegan', viewBox: '0 0 34 40',
      svg: () => '<g transform="translate(0,40) scale(0.1,-0.1)" fill="currentColor">'
        + '<path d="M70 195 c0 -2 11 -15 24 -28 22 -23 66 -123 66 -152 0 -31 18 -13 29 27 8 34 18 46 43 58 29 13 33 20 36 59 2 23 0 41 -5 39 -4 -2 -25 -12 -45 -21 -30 -14 -38 -23 -38 -43 0 -24 2 -25 18 -13 15 12 16 12 5 -2 -7 -8 -16 -26 -21 -39 -9 -23 -10 -22 -31 25 -22 49 -57 95 -73 95 -4 0 -8 -2 -8 -5z"/>'
        + '</g>',
    },
    {
      key: 'contains_pork', label: 'dietContainsPork', cls: 'dietary-pork', viewBox: '0 0 38 40',
      svg: () => '<g transform="translate(0,40) scale(0.1,-0.1)" fill="currentColor">'
        + '<path d="M95 175 c-25 -21 -28 -26 -15 -35 8 -5 25 -10 38 -10 19 0 22 5 22 35 0 42 -5 43 -45 10z M155 188 c-2 -7 -5 -24 -7 -38 -3 -21 -8 -25 -38 -26 -42 0 -51 -23 -25 -70 21 -40 52 -54 119 -54 59 0 100 27 112 74 9 38 1 50 -37 50 -31 1 -34 4 -39 36 -5 32 -8 35 -43 38 -24 2 -39 -1 -42 -10z m86 -104 c21 -25 -1 -49 -46 -49 -45 0 -67 24 -46 49 17 21 75 21 92 0z M162 78 c-17 -17 4 -38 39 -38 33 0 45 15 29 35 -15 18 -52 19 -68 3z M256 193 c-9 -10 -7 -51 4 -58 14 -9 60 6 60 19 0 14 -55 48 -64 39z"/>'
        + '</g>'
        + '<circle cx="13.5" cy="19.3" r="1.15" fill="currentColor"/>'
        + '<circle cx="24.3" cy="19.3" r="1.15" fill="currentColor"/>',
    },
    {
      key: 'contains_shellfish', label: 'dietContainsShellfish', cls: 'dietary-shellfish', viewBox: '0 0 38 40',
      svg: () => '<g transform="translate(0,40) scale(0.1,-0.1)" fill="currentColor">'
        + '<path d="M76 192 c-11 -18 4 -37 44 -55 22 -10 40 -25 40 -33 0 -20 23 -17 37 4 8 14 20 17 46 14 35 -4 35 -4 28 -62 -2 -10 -5 -7 -11 8 -9 22 -44 30 -55 12 -3 -5 -1 -17 4 -27 5 -10 12 -26 15 -35 7 -23 35 -23 43 0 4 9 15 24 24 32 10 8 20 29 23 45 6 31 -12 80 -29 80 -6 0 -15 4 -21 8 -7 4 -23 7 -35 7 -13 1 -52 3 -85 6 -36 3 -64 2 -68 -4z m84 -12 c-36 -12 -70 -12 -70 0 0 6 21 10 48 9 38 -1 42 -2 22 -9z"/>'
        + '</g>',
    },
  ];

  // Small icons next to an item's name on a card/modal — only the ones that
  // apply to this item (an item with none of the 5 flags set renders nothing).
  function renderDietaryIcons(dietary) {
    if (!dietary) return '';
    const active = DIETARY_DEFS.filter((d) => dietary[d.key]);
    if (!active.length) return '';
    return `<span class="item-dietary">${active.map((d) => `
      <span class="dietary-icon ${d.cls}" title="${escapeHtml(t(d.label))}"><svg viewBox="${d.viewBox}" aria-hidden="true">${d.svg()}</svg></span>
    `).join('')}</span>`;
  }

  // Bottom legend explaining what each dietary icon means, in the guest's
  // current language. Shown once per category (see renderCategoryContent),
  // only when at least one item in that category actually carries a flag.
  function renderDietaryLegend() {
    return `
      <div class="dietary-legend">
        <div class="dietary-legend__title">${escapeHtml(t('dietLegendTitle'))}</div>
        <div class="dietary-legend__items">
          ${DIETARY_DEFS.map((d) => `
            <div class="dietary-legend__item">
              <span class="dietary-icon ${d.cls}"><svg viewBox="0 0 24 24" aria-hidden="true">${d.svg(++dietaryIconUid)}</svg></span>
              <span class="dietary-legend__label">${escapeHtml(t(d.label))}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const FOOD_ICONS = ['🍽️', '🥗', '🌶️', '🍜', '🥩', '🍹', '🍰', '☕', '🍺', '🍹'];

  // Labels for item.unit ('bottle' | 'glass' | null), set from a plain
  // dropdown in the admin panel (see admin/app.js "Sold by" field). Kept as
  // a code rather than per-language text on each item so guests always see
  // it localized, with no translation work needed in the admin UI.
  const UNIT_LABELS = {
    bottle: { en: 'Bottle', th: 'ขวด', ru: 'Бутылка', zh: '瓶', ar: 'زجاجة' },
    glass: { en: 'Glass', th: 'แก้ว', ru: 'Бокал', zh: '杯', ar: 'كأس' },
  };
  function unitLabel(item) {
    const l = item && item.unit && UNIT_LABELS[item.unit];
    return l ? (l[state.lang] || l.en) : '';
  }

  let state = {
    lang: localStorage.getItem('menu_lang') || 'en',
    menu: null,
    view: 'home', // 'home' | 'menu' | 'promotions'
    menuGroup: 'food', // 'food' | 'drink' | 'wine', only used when view === 'menu'
    promoCategory: 'food', // 'food' | 'drink' | 'theme_night', only used when view === 'promotions'
    activeCategoryId: null,
  };

  const PROMO_CATEGORIES = ['food', 'drink', 'theme_night'];
  function promoCategoryLabel(cat) {
    return t({ food: 'promoTabFood', drink: 'promoTabDrink', theme_night: 'promoTabThemeNight' }[cat]);
  }

  // Auto-advance timer for the inline promo banner strip (see setupPromoBannerAutoScroll).
  // Cleared at the top of every render() so a stale timer never outlives the DOM it scrolls.
  let promoBannerTimer = null;

  // render() rebuilds the whole screen from an innerHTML string, including the left
  // category rail, so a plain re-render (tapping a category, switching language, etc.)
  // would otherwise snap the rail's scroll position back to the top every time. We
  // capture its scrollTop right before tearing the DOM down and restore it right after,
  // so the rail stays exactly where the guest left it instead of "bouncing back".
  let categoryRailScrollTop = 0;

  function t(key, ...args) {
    const s = UI_STRINGS[state.lang] || UI_STRINGS.en;
    const v = s[key];
    return typeof v === 'function' ? v(...args) : v;
  }

  function fmt(obj) {
    if (!obj) return '';
    return obj[state.lang] || obj.en || '';
  }

  // Renders the restaurant's name/wordmark: an uploaded logo image when the
  // admin has set one (see admin Home Screen settings > "Logo image"),
  // otherwise falls back to the existing text (logo_text / restaurant_name).
  // `imgClass` sizes it differently for the home hero vs. the small page header.
  function renderBrandName(imgClass) {
    const logo = state.menu.logo_image;
    if (logo) {
      const name = escapeHtml(state.menu.logo_text || state.menu.restaurant_name || 'Menu');
      return `<img class="${imgClass}" src="${logo}" alt="${name}" />`;
    }
    const textClass = imgClass === 'home-logo-img' ? 'home-name' : 'brand-name';
    return `<div class="${textClass}">${escapeHtml(state.menu.logo_text || state.menu.restaurant_name || 'Menu')}</div>`;
  }

  async function fetchMenu() {
    const res = await fetch('/api/public/menu');
    if (!res.ok) throw new Error('Failed to load menu');
    return res.json();
  }

  function render() {
    if (promoBannerTimer) { clearInterval(promoBannerTimer); promoBannerTimer = null; }
    const existingRail = document.getElementById('category-rail');
    if (existingRail) categoryRailScrollTop = existingRail.scrollTop;
    const app = document.getElementById('app');
    document.body.setAttribute('data-lang', state.lang);
    document.body.setAttribute('dir', RTL_LANGS.has(state.lang) ? 'rtl' : 'ltr');
    renderAllergyNotice();

    if (!state.menu) {
      app.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';
      return;
    }

    if (state.view === 'home') return renderHome();
    if (state.view === 'promotions') return renderPromotions();
    return renderMenu();
  }

  // Fills the fixed allergy/dietary notice bar (see #allergy-notice in
  // index.html — deliberately outside #app, so it survives every view's
  // full innerHTML replacement above). Called on every render(), including a
  // language switch, so its text always matches state.lang.
  //
  // Each language's allergyNotice string (see UI_STRINGS above) carries one
  // embedded "\n" splitting it into two short clauses, rendered as two
  // stacked lines (plus a small notice icon) instead of one long run-on
  // line — built with DOM calls + textContent (not innerHTML) even though
  // the source strings are static, so nothing here depends on string content
  // ever being safe to parse as markup.
  function renderAllergyNotice() {
    const bar = document.getElementById('allergy-notice');
    if (!bar) return;
    const lines = t('allergyNotice').split('\n');
    bar.innerHTML = '';

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'allergy-notice__icon');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML =
      '<circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<line x1="12" y1="7.4" x2="12" y2="13.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="12" cy="16.4" r="1.1" fill="currentColor"/>';

    const textWrap = document.createElement('div');
    textWrap.className = 'allergy-notice__text';
    for (const line of lines) {
      const span = document.createElement('span');
      span.className = 'allergy-notice__line';
      span.textContent = line;
      textWrap.appendChild(span);
    }

    bar.appendChild(icon);
    bar.appendChild(textWrap);
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
    // The public API already drops empty categories, so a non-zero count
    // here means there's real wine content to show — otherwise the button
    // is hidden rather than opening onto a blank "Wine Menu" screen.
    const wineCount = (state.menu.categories || []).filter((c) => c.menu_group === 'wine').length;
    app.innerHTML = `
      <div class="home-screen" ${bg ? `style="background-image:url('${bg}')"` : ''}>
        <div class="home-top">${renderLangSwitcher()}</div>
        <div class="home-overlay">
          <div class="home-brand">
            <div class="home-hotel">${escapeHtml(state.menu.hotel_name || '')}</div>
            ${renderBrandName('home-logo-img')}
            ${state.menu.tagline ? `<div class="home-tagline">${escapeHtml(state.menu.tagline)}</div>` : ''}
          </div>
          <div class="home-buttons">
            <button class="home-btn" data-go="food">${escapeHtml(t('foodMenu'))}</button>
            <button class="home-btn" data-go="drink">${escapeHtml(t('drinksMenu'))}</button>
            ${wineCount ? `<button class="home-btn" data-go="wine">${escapeHtml(t('wineMenu'))}</button>` : ''}
            ${promoCount ? `<button class="home-btn home-btn-accent" data-go="promotions">${escapeHtml(t('promotionMenu'))}</button>` : ''}
          </div>
        </div>
      </div>
    `;
    bindLangSwitcher(app);
    app.querySelectorAll('[data-go]').forEach((btn) => btn.addEventListener('click', () => {
      const go = btn.dataset.go;
      if (go === 'promotions') { state.view = 'promotions'; }
      else { state.view = 'menu'; state.menuGroup = go; state.activeCategoryId = null; categoryRailScrollTop = 0; }
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
          ${renderBrandName('brand-logo-img')}
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

    document.getElementById('category-rail').scrollTop = categoryRailScrollTop;

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

    setupPromoBannerAutoScroll();
  }

  // Auto-advances the inline promo banner strip one card at a time, looping back to the
  // start once it reaches the end, so promotions cycle on their own on an unattended
  // tablet. Pauses for a while after a guest manually scrolls/touches it, then resumes.
  function setupPromoBannerAutoScroll() {
    const strip = document.getElementById('promo-banner-strip');
    if (!strip) return;
    const cards = strip.querySelectorAll('.promo-banner-card');
    if (cards.length < 2) return;

    let paused = false;
    let resumeTimeout = null;
    const pauseForAWhile = () => {
      paused = true;
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => { paused = false; }, 8000);
    };
    strip.addEventListener('pointerdown', pauseForAWhile);
    strip.addEventListener('wheel', pauseForAWhile, { passive: true });

    const gap = parseFloat(getComputedStyle(strip).columnGap || getComputedStyle(strip).gap || '0') || 0;

    promoBannerTimer = setInterval(() => {
      if (paused) return;
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      if (maxScroll <= 0) return;
      const step = cards[0].getBoundingClientRect().width + gap;
      const next = strip.scrollLeft + step;
      strip.scrollTo({ left: next >= maxScroll - 2 ? 0 : next, behavior: 'smooth' });
    }, 5000);
  }

  function renderCategoryContent(category) {
    if (!category) return `<div class="empty-state">${escapeHtml(t('empty'))}</div>`;
    const hasDietary = category.items.some((i) => i.dietary && Object.values(i.dietary).some(Boolean));
    return `
      <div class="category-heading">
        <h2>${escapeHtml(fmt(category.name))}</h2>
        ${fmt(category.description) ? `<p>${escapeHtml(fmt(category.description))}</p>` : ''}
      </div>
      <div class="item-grid">
        ${category.items.map(renderItemCard).join('')}
      </div>
      ${hasDietary ? renderDietaryLegend() : ''}
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
          <div class="item-name-row">
            <div class="item-name">${escapeHtml(fmt(item.name))}</div>
            ${renderDietaryIcons(item.dietary)}
          </div>
          ${fmt(item.description) ? `<div class="item-desc">${escapeHtml(fmt(item.description))}</div>` : ''}
          <div class="item-footer">
            ${renderPrice(item)}
            ${unitLabel(item) ? `<span class="item-unit-badge">${escapeHtml(unitLabel(item))}</span>` : ''}
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
          <div class="item-name-row">
            <div class="item-name">${escapeHtml(fmt(item.name))}</div>
            ${renderDietaryIcons(item.dietary)}
          </div>
          ${fmt(item.description) ? `<div class="item-desc">${escapeHtml(fmt(item.description))}</div>` : ''}
          ${item.sold_out ? `<div class="sold-out-tag" style="position:static;display:inline-block;">${escapeHtml(t('soldOut'))}</div>` : ''}
          <div class="modal-price-row">
            ${renderPrice(item)}
            ${unitLabel(item) ? `<span class="item-unit-badge">${escapeHtml(unitLabel(item))}</span>` : ''}
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
    const allPromotions = state.menu.promotions || [];
    if (!PROMO_CATEGORIES.includes(state.promoCategory)) state.promoCategory = 'food';
    const promotions = allPromotions.filter((p) => (p.promo_category || 'food') === state.promoCategory);
    app.innerHTML = `
      <div class="header">
        <button class="back-btn" id="back-home" aria-label="${escapeHtml(t('back'))}">←</button>
        <div class="brand">
          <div class="brand-hotel">${escapeHtml(state.menu.hotel_name || '')}</div>
          ${renderBrandName('brand-logo-img')}
        </div>
        ${renderLangSwitcher()}
      </div>
      <div class="content promo-content">
        <nav class="promo-tabs" id="promo-tabs">
          ${PROMO_CATEGORIES.map((cat) => `
            <button class="promo-tab ${cat === state.promoCategory ? 'active' : ''}" data-promo-cat="${cat}">${escapeHtml(promoCategoryLabel(cat))}</button>
          `).join('')}
        </nav>
        ${promotions.length ? `
          <div class="promo-feed" id="promo-feed">
            ${promotions.map(renderPromoCard).join('')}
          </div>
        ` : `<div class="empty-state">${escapeHtml(t('noPromotions'))}</div>`}
      </div>
    `;
    bindLangSwitcher(app);
    document.getElementById('back-home').addEventListener('click', () => { state.view = 'home'; render(); });
    document.getElementById('promo-tabs').addEventListener('click', (e) => {
      const btn = e.target.closest('.promo-tab');
      if (!btn) return;
      state.promoCategory = btn.dataset.promoCat;
      render();
    });
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
    // Promotions can have two images: `image` is the compact landscape thumbnail
    // used in the banner strip / grid card, and `detail_image` is an optional
    // taller A4-portrait poster meant for this full-screen popup — set from the
    // admin's "Full-screen image (A4)" field. Fall back to the card image when
    // no separate detail image was chosen, so older promotions still work.
    const fullImage = promo.detail_image || promo.image;
    // The promo artwork already carries the title/price/offer copy baked into the
    // image itself (that's how the promo images are designed), so when there's an
    // image we let it fill the screen edge-to-edge with just a close button on top —
    // no separate text bar underneath duplicating what the image already says. The
    // text block is only shown as a fallback for a promo that has no image yet.
    backdrop.innerHTML = fullImage
      ? `
        <div class="modal promo-modal promo-modal-fullscreen">
          <button class="modal-close" aria-label="Close">&times;</button>
          <img class="promo-modal-image" src="${fullImage}" alt="${escapeHtml(fmt(promo.title))}" />
        </div>
      `
      : `
        <div class="modal promo-modal">
          <button class="modal-close" aria-label="Close">&times;</button>
          <div class="promo-modal-image placeholder"></div>
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
