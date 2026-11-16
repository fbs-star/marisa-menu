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

  // ---------------- HB / FB (Half Board / Full Board) ----------------
  // Content for the "HB / FB" home button, taken from the hotel's "Half Board &
  // Full Board Food Menu Marisa 2026" Canva design (text only). Dish names,
  // photos, descriptions and dietary icons are NOT repeated here: each dish
  // below is a reference (by item id) to the same item in the normal Food Menu,
  // so it always shows the site's own photo/translations and stays in sync if
  // that item is edited in the admin. Only the package wording, section
  // titles, theme-night schedule and all-inclusive drink lists live here.
  const HBFB_I18N = {
    en: {
      title: 'Half Board & Full Board Menu', tabPackages: 'Packages', tabOpt1: 'Option 1', tabOpt2: 'Option 2', tabDrinks: 'All-Inclusive Drinks',
      halfBoard: 'Half Board', fullBoard: 'Full Board', lunchOrDinner: 'Lunch or Dinner', lunchAndDinner: 'Lunch and Dinner',
      option1: 'Option 1', option2: 'Option 2', opt1Line: '1 Appetizer / 1 Main Course / 1 Dessert', opt2Line: 'Flame grills or Theme nights',
      servingTimes: 'Daily serving times', lunch: 'Lunch', dinner: 'Dinner', lunchTime: '12 pm – 2 pm', dinnerTime: '6 pm – 9 pm',
      pick1: 'Please select 1 Appetizer / 1 Main Course / 1 Dessert', pick2: 'Please select 1 Flame grills or Theme night',
      secAppetizer: 'Appetizer / Salad', secSoup: 'Soup', secMain: 'Thai Main Course', secBurger: 'Burger & Sandwich', secPasta: 'Pasta', secDessert: 'Dessert',
      steamedRice: 'Steamed rice', flameGrills: 'Flame Grills Section', flame1: 'Beef tenderloin 180 g', flame2: 'Sea bass fillet 150 g', flame3: 'Pork loin steak', flame4: 'Grilled chicken breast',
      orTheme: 'Or you can join the theme night', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', fri: 'Friday', sat: 'Saturday', at: 'At', sizeNote: 'Please select from Size S or Size M only',
      choiceA: 'Choice of beef, chicken or seafood', choiceB: 'Choice of chicken, pork or seafood', choiceC: 'Choice of pork, chicken or seafood',
      drinkTitle: 'All-Inclusive Drink Menu', cocktails: 'Cocktails', beer: 'Beer', singleDrinks: 'Single Drinks', softDrink: 'Soft Drink', juices: 'Concentrated Juices', coffeeHot: 'Coffee Hot', iceCoffee: 'Ice Coffee', tea: 'Hot or Ice Tea',
      dCocktails: 'Mojito, Daiquiri, Caipirinha, Caipiroska, Mai Tai, Piña Colada', dBeer: 'Local beer', dSingle: 'Gin, Vodka, Rum, Thai Whiskey', dSoft: 'Coke, Coke light, Sprite, Tonic, Ginger ale, Soda water',
      dJuices: 'Orange juice, Pineapple juice', dCoffee: 'Black coffee, Espresso, Americano, Cappuccino', dTea: 'English tea',
      drinkTitle2: 'Juices & Soft Drinks', dJuices4: 'Orange juice, Pineapple juice, Apple juice, Mango juice',
      served: 'All-inclusive drinks are served during the following times at the following outlets only.', outlet1: '11 am – 9 pm at Marisa Restaurant', outlet2: '11 am – 7 pm at Crocodile Pool Bar',
    },
    th: {
      title: 'เมนูฮาล์ฟบอร์ด & ฟูลบอร์ด', tabPackages: 'แพ็กเกจ', tabOpt1: 'ตัวเลือกที่ 1', tabOpt2: 'ตัวเลือกที่ 2', tabDrinks: 'เครื่องดื่มออลอินคลูซีฟ',
      halfBoard: 'ฮาล์ฟบอร์ด', fullBoard: 'ฟูลบอร์ด', lunchOrDinner: 'มื้อกลางวัน หรือ มื้อเย็น', lunchAndDinner: 'มื้อกลางวัน และ มื้อเย็น',
      option1: 'ตัวเลือกที่ 1', option2: 'ตัวเลือกที่ 2', opt1Line: 'อาหารเรียกน้ำย่อย 1 / จานหลัก 1 / ของหวาน 1', opt2Line: 'เมนูย่างเปลวไฟ หรือ ธีมไนท์',
      servingTimes: 'เวลาให้บริการทุกวัน', lunch: 'มื้อกลางวัน', dinner: 'มื้อเย็น', lunchTime: '12:00 – 14:00 น.', dinnerTime: '18:00 – 21:00 น.',
      pick1: 'กรุณาเลือก อาหารเรียกน้ำย่อย 1 / จานหลัก 1 / ของหวาน 1', pick2: 'กรุณาเลือก เมนูย่างเปลวไฟ หรือ ธีมไนท์ อย่างใดอย่างหนึ่ง',
      secAppetizer: 'อาหารเรียกน้ำย่อย / สลัด', secSoup: 'ซุป', secMain: 'จานหลักไทย', secBurger: 'เบอร์เกอร์และแซนด์วิช', secPasta: 'พาสต้า', secDessert: 'ของหวาน',
      steamedRice: 'ข้าวสวย', flameGrills: 'เมนูย่างเปลวไฟ', flame1: 'เนื้อสันในวัว 180 กรัม', flame2: 'ปลากะพงขาวแล่ 150 กรัม', flame3: 'สเต็กสันนอกหมู', flame4: 'อกไก่ย่าง',
      orTheme: 'หรือร่วมสนุกกับธีมไนท์', mon: 'วันจันทร์', tue: 'วันอังคาร', wed: 'วันพุธ', fri: 'วันศุกร์', sat: 'วันเสาร์', at: 'ที่', sizeNote: 'เลือกขนาด S หรือ M เท่านั้น',
      choiceA: 'เลือกเนื้อวัว ไก่ หรืออาหารทะเล', choiceB: 'เลือกไก่ หมู หรืออาหารทะเล', choiceC: 'เลือกหมู ไก่ หรืออาหารทะเล',
      drinkTitle: 'เมนูเครื่องดื่มออลอินคลูซีฟ', cocktails: 'ค็อกเทล', beer: 'เบียร์', singleDrinks: 'เครื่องดื่มสุราชนิดเดี่ยว', softDrink: 'น้ำอัดลม', juices: 'น้ำผลไม้เข้มข้น', coffeeHot: 'กาแฟร้อน', iceCoffee: 'กาแฟเย็น', tea: 'ชาร้อนหรือชาเย็น',
      dCocktails: 'โมฮิโต้, ไดคีรี, ไคปิริญ่า, ไคปิรอสก้า, ไมไท, ปีญา โคลาดา', dBeer: 'เบียร์ท้องถิ่น', dSingle: 'จิน, วอดก้า, รัม, วิสกี้ไทย', dSoft: 'โค้ก, โค้กไลท์, สไปรท์, โทนิค, จินเจอร์เอล, โซดา',
      dJuices: 'น้ำส้ม, น้ำสับปะรด', dCoffee: 'แบล็กคอฟฟี่, เอสเปรสโซ, อเมริกาโน, คาปูชิโน', dTea: 'ชาอังกฤษ',
      drinkTitle2: 'น้ำผลไม้และน้ำอัดลม', dJuices4: 'น้ำส้ม, น้ำสับปะรด, น้ำแอปเปิ้ล, น้ำมะม่วง',
      served: 'เครื่องดื่มออลอินคลูซีฟให้บริการตามเวลาและสถานที่ต่อไปนี้เท่านั้น', outlet1: '11:00 – 21:00 น. ที่ร้านอาหารมาริสา', outlet2: '11:00 – 19:00 น. ที่ Crocodile Pool Bar',
    },
    ru: {
      title: 'Меню «Полупансион и Полный пансион»', tabPackages: 'Пакеты', tabOpt1: 'Вариант 1', tabOpt2: 'Вариант 2', tabDrinks: 'Напитки «всё включено»',
      halfBoard: 'Полупансион', fullBoard: 'Полный пансион', lunchOrDinner: 'Обед или ужин', lunchAndDinner: 'Обед и ужин',
      option1: 'Вариант 1', option2: 'Вариант 2', opt1Line: '1 закуска / 1 основное блюдо / 1 десерт', opt2Line: 'Блюда на гриле или тематический вечер',
      servingTimes: 'Время обслуживания ежедневно', lunch: 'Обед', dinner: 'Ужин', lunchTime: '12:00 – 14:00', dinnerTime: '18:00 – 21:00',
      pick1: 'Пожалуйста, выберите 1 закуску / 1 основное блюдо / 1 десерт', pick2: 'Пожалуйста, выберите одно: блюдо на гриле или тематический вечер',
      secAppetizer: 'Закуски / салаты', secSoup: 'Супы', secMain: 'Основные блюда тайской кухни', secBurger: 'Бургеры и сэндвичи', secPasta: 'Паста', secDessert: 'Десерты',
      steamedRice: 'Отварной рис', flameGrills: 'Блюда на гриле', flame1: 'Говяжья вырезка 180 г', flame2: 'Филе сибаса 150 г', flame3: 'Стейк из свиной корейки', flame4: 'Куриная грудка на гриле',
      orTheme: 'Или присоединяйтесь к тематическому вечеру', mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', fri: 'Пятница', sat: 'Суббота', at: 'В', sizeNote: 'Пожалуйста, выбирайте только размер S или M',
      choiceA: 'На выбор: говядина, курица или морепродукты', choiceB: 'На выбор: курица, свинина или морепродукты', choiceC: 'На выбор: свинина, курица или морепродукты',
      drinkTitle: 'Меню напитков «всё включено»', cocktails: 'Коктейли', beer: 'Пиво', singleDrinks: 'Крепкие напитки', softDrink: 'Прохладительные напитки', juices: 'Концентрированные соки', coffeeHot: 'Горячий кофе', iceCoffee: 'Холодный кофе', tea: 'Горячий или холодный чай',
      dCocktails: 'Мохито, Дайкири, Кайпиринья, Кайпироска, Май Тай, Пина Колада', dBeer: 'Местное пиво', dSingle: 'Джин, водка, ром, тайский виски', dSoft: 'Кока-кола, Кока-кола лайт, Спрайт, тоник, имбирный эль, содовая',
      dJuices: 'Апельсиновый сок, ананасовый сок', dCoffee: 'Чёрный кофе, эспрессо, американо, капучино', dTea: 'Английский чай',
      drinkTitle2: 'Соки и прохладительные напитки', dJuices4: 'Апельсиновый, ананасовый, яблочный и манговый соки',
      served: 'Напитки «всё включено» подаются только в указанное время и в указанных заведениях.', outlet1: '11:00 – 21:00 — ресторан Marisa', outlet2: '11:00 – 19:00 — Crocodile Pool Bar',
    },
    zh: {
      title: '半食宿 & 全食宿菜单', tabPackages: '套餐', tabOpt1: '选项一', tabOpt2: '选项二', tabDrinks: '畅饮饮品',
      halfBoard: '半食宿', fullBoard: '全食宿', lunchOrDinner: '午餐或晚餐', lunchAndDinner: '午餐和晚餐',
      option1: '选项一', option2: '选项二', opt1Line: '1份开胃菜 / 1份主菜 / 1份甜点', opt2Line: '火焰烧烤或主题之夜',
      servingTimes: '每日供应时间', lunch: '午餐', dinner: '晚餐', lunchTime: '中午12点 – 下午2点', dinnerTime: '下午6点 – 晚上9点',
      pick1: '请选择 1份开胃菜 / 1份主菜 / 1份甜点', pick2: '请在火焰烧烤与主题之夜中任选一项',
      secAppetizer: '开胃菜 / 沙拉', secSoup: '汤', secMain: '泰式主菜', secBurger: '汉堡与三明治', secPasta: '意面', secDessert: '甜点',
      steamedRice: '白米饭', flameGrills: '火焰烧烤区', flame1: '牛里脊 180克', flame2: '海鲈鱼排 150克', flame3: '猪里脊排', flame4: '烤鸡胸肉',
      orTheme: '或参加主题之夜', mon: '星期一', tue: '星期二', wed: '星期三', fri: '星期五', sat: '星期六', at: '地点：', sizeNote: '请仅选择 S 或 M 份量',
      choiceA: '可选牛肉、鸡肉或海鲜', choiceB: '可选鸡肉、猪肉或海鲜', choiceC: '可选猪肉、鸡肉或海鲜',
      drinkTitle: '畅饮饮品菜单', cocktails: '鸡尾酒', beer: '啤酒', singleDrinks: '单品烈酒', softDrink: '软饮', juices: '浓缩果汁', coffeeHot: '热咖啡', iceCoffee: '冰咖啡', tea: '热茶或冰茶',
      dCocktails: '莫吉托、代基里、卡琵莉亚、卡匹洛斯卡、迈泰、椰林飘香', dBeer: '本地啤酒', dSingle: '金酒、伏特加、朗姆酒、泰国威士忌', dSoft: '可乐、轻怡可乐、雪碧、汤力水、姜汁汽水、苏打水',
      dJuices: '橙汁、菠萝汁', dCoffee: '黑咖啡、意式浓缩、美式咖啡、卡布奇诺', dTea: '英式茶',
      drinkTitle2: '果汁与软饮', dJuices4: '橙汁、菠萝汁、苹果汁、芒果汁',
      served: '畅饮饮品仅在以下时间和地点供应。', outlet1: '上午11点至晚上9点：Marisa 餐厅', outlet2: '上午11点至晚上7点：Crocodile 泳池吧',
    },
    ar: {
      title: 'قائمة نصف إقامة وإقامة كاملة', tabPackages: 'الباقات', tabOpt1: 'الخيار 1', tabOpt2: 'الخيار 2', tabDrinks: 'مشروبات «الكل شامل»',
      halfBoard: 'نصف إقامة', fullBoard: 'إقامة كاملة', lunchOrDinner: 'غداء أو عشاء', lunchAndDinner: 'غداء وعشاء',
      option1: 'الخيار 1', option2: 'الخيار 2', opt1Line: 'طبق مقبلات واحد / طبق رئيسي واحد / حلوى واحدة', opt2Line: 'مشويات على اللهب أو ليلة موضوعية',
      servingTimes: 'أوقات التقديم اليومية', lunch: 'الغداء', dinner: 'العشاء', lunchTime: '12 ظهراً – 2 ظهراً', dinnerTime: '6 مساءً – 9 مساءً',
      pick1: 'يرجى اختيار طبق مقبلات واحد / طبق رئيسي واحد / حلوى واحدة', pick2: 'يرجى اختيار خيار واحد: المشويات على اللهب أو الليلة الموضوعية',
      secAppetizer: 'المقبلات / السلطات', secSoup: 'الشوربات', secMain: 'الأطباق التايلاندية الرئيسية', secBurger: 'البرغر والساندويتشات', secPasta: 'المعكرونة', secDessert: 'الحلويات',
      steamedRice: 'أرز مبخّر', flameGrills: 'قسم المشويات على اللهب', flame1: 'فيليه لحم بقري 180 غ', flame2: 'فيليه سمك قاروص 150 غ', flame3: 'ستيك لحم الخنزير', flame4: 'صدر دجاج مشوي',
      orTheme: 'أو انضموا إلى الليلة الموضوعية', mon: 'الاثنين', tue: 'الثلاثاء', wed: 'الأربعاء', fri: 'الجمعة', sat: 'السبت', at: 'في', sizeNote: 'يرجى اختيار المقاس S أو M فقط',
      choiceA: 'اختيار من لحم البقر أو الدجاج أو المأكولات البحرية', choiceB: 'اختيار من الدجاج أو لحم الخنزير أو المأكولات البحرية', choiceC: 'اختيار من لحم الخنزير أو الدجاج أو المأكولات البحرية',
      drinkTitle: 'قائمة مشروبات «الكل شامل»', cocktails: 'الكوكتيلات', beer: 'البيرة', singleDrinks: 'المشروبات الروحية المفردة', softDrink: 'المشروبات الغازية', juices: 'العصائر المركزة', coffeeHot: 'قهوة ساخنة', iceCoffee: 'قهوة مثلجة', tea: 'شاي ساخن أو مثلج',
      dCocktails: 'موهيتو، دايكيري، كايبيرينها، كايبيروسكا، ماي تاي، بينا كولادا', dBeer: 'بيرة محلية', dSingle: 'جين، فودكا، رم، ويسكي تايلاندي', dSoft: 'كوكاكولا، كوكاكولا لايت، سبرايت، تونيك، جنجر إيل، ماء الصودا',
      dJuices: 'عصير البرتقال، عصير الأناناس', dCoffee: 'قهوة سوداء، إسبريسو، أمريكانو، كابتشينو', dTea: 'شاي إنجليزي',
      drinkTitle2: 'العصائر والمشروبات الغازية', dJuices4: 'عصير البرتقال، عصير الأناناس، عصير التفاح، عصير المانجو',
      served: 'تُقدَّم مشروبات «الكل شامل» في الأوقات والمنافذ التالية فقط.', outlet1: '11 صباحاً – 9 مساءً في مطعم ماريسا', outlet2: '11 صباحاً – 7 مساءً في Crocodile Pool Bar',
    },
  };
  function hb(key) {
    return (HBFB_I18N[state.lang] && HBFB_I18N[state.lang][key]) || HBFB_I18N.en[key] || key;
  }

  // Option 1 sections: item ids refer to the normal Food Menu items. `notes`
  // maps an item id to a HBFB_I18N key shown under the dish (the package lets
  // guests pick the protein, which the regular menu item doesn't spell out).
  const HBFB_OPTION1 = [
    { title: 'secAppetizer', ids: [186, 3, 6, 8] },
    { title: 'secSoup', ids: [11, 13, 12] },
    { title: 'secMain', ids: [40, 43, 42, 37, 30, 34, 39, 36, 48], extra: 'steamedRice' },
    { title: 'secBurger', ids: [28, 27, 29, 26] },
    { title: 'secPasta', ids: [23, 22, 24, 25] },
    { title: 'secDessert', ids: [50, 52, 49, 51, 54] },
  ];
  const HBFB_NOTES = { 43: 'choiceA', 42: 'choiceB', 37: 'choiceC' };
  // Flame grills: plain text lines (the package's cuts/weights differ from the
  // regular Food Menu's flame-grilled dishes); `pork` adds the Contains Pork icon.
  const HBFB_FLAME = [
    { key: 'flame1' }, { key: 'flame2' }, { key: 'flame3', pork: true }, { key: 'flame4' },
  ];
  // Theme nights Mon–Sat as printed on the design (no Thursday). Names/venues
  // are proper names, so they stay in English in every language.
  const HBFB_THEMES = [
    { day: 'mon', name: 'Fisherman’s Night', venue: 'Crocodile Bar & Grill', note: 'sizeNote' },
    { day: 'tue', name: 'Asian Night Buffet', venue: 'Marisa Terrace Restaurant' },
    { day: 'wed', name: 'Marisa Phuketian Set Menu', venue: 'Marisa Terrace Restaurant' },
    { day: 'fri', name: 'Thai Night', venue: 'Marisa Terrace Restaurant' },
    { day: 'sat', name: 'Churrasco BBQ Buffet', venue: 'Crocodile Bar & Grill' },
  ];
  const HBFB_TABS = [['packages', 'tabPackages'], ['opt1', 'tabOpt1'], ['opt2', 'tabOpt2'], ['drinks', 'tabDrinks']];

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
              <span class="dietary-icon ${d.cls}"><svg viewBox="${d.viewBox}" aria-hidden="true">${d.svg()}</svg></span>
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
    view: 'home', // 'home' | 'menu' | 'promotions' | 'hbfb'
    hbfbTab: 'packages', // 'packages' | 'opt1' | 'opt2' | 'drinks', only used when view === 'hbfb'
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
    if (state.view === 'hbfb') return renderHbfb();
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
            <button class="home-btn" data-go="hbfb">${escapeHtml(hb('title'))}</button>
            ${promoCount ? `<button class="home-btn home-btn-accent" data-go="promotions">${escapeHtml(t('promotionMenu'))}</button>` : ''}
          </div>
        </div>
      </div>
    `;
    bindLangSwitcher(app);
    app.querySelectorAll('[data-go]').forEach((btn) => btn.addEventListener('click', () => {
      const go = btn.dataset.go;
      if (go === 'promotions') { state.view = 'promotions'; }
      else if (go === 'hbfb') { state.view = 'hbfb'; state.hbfbTab = 'packages'; }
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
    // Show the icon guide on every Food Menu page, not just pages where at
    // least one item happens to carry a flag — otherwise pages like Kids Menu -
    // Soup / Dessert (no flagged items) looked inconsistent next to their
    // neighbours. Non-food categories (drinks/wine) keep the old behaviour: only
    // shown if an item there actually has a flag.
    const hasDietary = category.menu_group === 'food'
      || category.items.some((i) => i.dietary && Object.values(i.dietary).some(Boolean));
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

  function openItemModal(item, opts) {
    const hidePrice = !!(opts && opts.hidePrice);
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
          ${hidePrice ? '' : `<div class="modal-price-row">
            ${renderPrice(item)}
            ${unitLabel(item) ? `<span class="item-unit-badge">${escapeHtml(unitLabel(item))}</span>` : ''}
          </div>
          ${fmt(item.price_note) ? `<div class="price-note">${escapeHtml(fmt(item.price_note))}</div>` : ''}`}
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

  function hbfbItem(id) {
    for (const c of (state.menu.categories || [])) {
      const it = c.items.find((i) => i.id === id);
      if (it) return it;
    }
    return null;
  }

  // Same look as a normal Food Menu card, minus the price (everything here is
  // included in the package) and with the optional "choice of ..." note.
  function renderHbfbCard(item) {
    const icon = FOOD_ICONS[(item.food_color_code || 0) % FOOD_ICONS.length];
    const note = HBFB_NOTES[item.id];
    return `
      <div class="item-card hbfb-card" data-item="${item.id}">
        <div class="item-image" style="${item.image ? `background-image:url('${item.image}')` : ''}">${item.image ? '' : icon}</div>
        <div class="item-body">
          <div class="item-name-row">
            <div class="item-name">${escapeHtml(fmt(item.name))}</div>
            ${renderDietaryIcons(item.dietary)}
          </div>
          ${fmt(item.description) ? `<div class="item-desc">${escapeHtml(fmt(item.description))}</div>` : ''}
          ${note ? `<div class="hbfb-choice">${escapeHtml(hb(note))}</div>` : ''}
        </div>
      </div>
    `;
  }

  function renderHbfbPackages() {
    const pkg = (nameKey, whenKey) => `
      <div class="hbfb-pkg">
        <div class="hbfb-pkg-name">${escapeHtml(hb(nameKey))}</div>
        <div class="hbfb-pkg-when">${escapeHtml(hb(whenKey))}</div>
        <div class="hbfb-pkg-opt"><span class="hbfb-pkg-optname">${escapeHtml(hb('option1'))}</span>${escapeHtml(hb('opt1Line'))}</div>
        <div class="hbfb-pkg-opt"><span class="hbfb-pkg-optname">${escapeHtml(hb('option2'))}</span>${escapeHtml(hb('opt2Line'))}</div>
      </div>`;
    return `
      <div class="hbfb-pkgs">
        ${pkg('halfBoard', 'lunchOrDinner')}
        ${pkg('fullBoard', 'lunchAndDinner')}
      </div>
      <div class="hbfb-times">
        <div class="hbfb-times-title">${escapeHtml(hb('servingTimes'))}</div>
        <div class="hbfb-times-row"><span>${escapeHtml(hb('lunch'))}</span><b>${escapeHtml(hb('lunchTime'))}</b></div>
        <div class="hbfb-times-row"><span>${escapeHtml(hb('dinner'))}</span><b>${escapeHtml(hb('dinnerTime'))}</b></div>
      </div>
    `;
  }

  function renderHbfbOption1() {
    return `
      <div class="hbfb-pick">${escapeHtml(hb('pick1'))}</div>
      ${HBFB_OPTION1.map((sec) => {
        const items = sec.ids.map(hbfbItem).filter(Boolean);
        if (!items.length) return '';
        return `
          <section class="hbfb-section">
            <h2>${escapeHtml(hb(sec.title))}</h2>
            <div class="item-grid">${items.map(renderHbfbCard).join('')}</div>
            ${sec.extra ? `<div class="hbfb-extra">+ ${escapeHtml(hb(sec.extra))}</div>` : ''}
          </section>`;
      }).join('')}
      ${renderDietaryLegend()}
    `;
  }

  function renderHbfbOption2() {
    return `
      <div class="hbfb-pick">${escapeHtml(hb('pick2'))}</div>
      <section class="hbfb-section">
        <h2>${escapeHtml(hb('flameGrills'))}</h2>
        <ul class="hbfb-list">
          ${HBFB_FLAME.map((f) => `<li><span>${escapeHtml(hb(f.key))}</span>${f.pork ? renderDietaryIcons({ contains_pork: true }) : ''}</li>`).join('')}
        </ul>
      </section>
      <div class="hbfb-or"><span>${escapeHtml(hb('orTheme'))}</span></div>
      <div class="hbfb-themes">
        ${HBFB_THEMES.map((th) => `
          <div class="hbfb-theme">
            <div class="hbfb-theme-day">${escapeHtml(hb(th.day))}</div>
            <div class="hbfb-theme-name">${escapeHtml(th.name)}</div>
            ${th.note ? `<div class="hbfb-theme-note">${escapeHtml(hb(th.note))}</div>` : ''}
            <div class="hbfb-theme-venue">${escapeHtml(hb('at'))} ${escapeHtml(th.venue)}</div>
          </div>`).join('')}
      </div>
      ${renderDietaryLegend()}
    `;
  }

  function renderHbfbDrinks() {
    const group = (titleKey, textKey) => `
      <div class="hbfb-drink">
        <div class="hbfb-drink-title">${escapeHtml(hb(titleKey))}</div>
        <div class="hbfb-drink-text">${escapeHtml(hb(textKey))}</div>
      </div>`;
    const served = `
      <div class="hbfb-served">
        <div>${escapeHtml(hb('served'))}</div>
        <ul><li>${escapeHtml(hb('outlet1'))}</li><li>${escapeHtml(hb('outlet2'))}</li></ul>
      </div>`;
    return `
      <section class="hbfb-section">
        <h2>${escapeHtml(hb('drinkTitle'))}</h2>
        <div class="hbfb-drinks">
          ${group('cocktails', 'dCocktails')}
          ${group('beer', 'dBeer')}
          ${group('singleDrinks', 'dSingle')}
          ${group('softDrink', 'dSoft')}
          ${group('juices', 'dJuices')}
          ${group('coffeeHot', 'dCoffee')}
          ${group('iceCoffee', 'dCoffee')}
          ${group('tea', 'dTea')}
        </div>
        ${served}
      </section>
      <section class="hbfb-section">
        <h2>${escapeHtml(hb('drinkTitle2'))}</h2>
        <div class="hbfb-drinks">
          ${group('juices', 'dJuices4')}
          ${group('softDrink', 'dSoft')}
        </div>
        ${served}
      </section>
    `;
  }

  function renderHbfb() {
    const app = document.getElementById('app');
    if (!HBFB_TABS.some(([k]) => k === state.hbfbTab)) state.hbfbTab = 'packages';
    const body = { packages: renderHbfbPackages, opt1: renderHbfbOption1, opt2: renderHbfbOption2, drinks: renderHbfbDrinks }[state.hbfbTab]();
    app.innerHTML = `
      <div class="header">
        <button class="back-btn" id="back-home" aria-label="${escapeHtml(t('back'))}">←</button>
        <div class="brand">
          <div class="brand-hotel">${escapeHtml(state.menu.hotel_name || '')}</div>
          ${renderBrandName('brand-logo-img')}
        </div>
        ${renderLangSwitcher()}
      </div>
      <div class="content promo-content hbfb-content" id="hbfb-content">
        <h1 class="hbfb-title">${escapeHtml(hb('title'))}</h1>
        <nav class="promo-tabs" id="hbfb-tabs">
          ${HBFB_TABS.map(([k, label]) => `<button class="promo-tab ${k === state.hbfbTab ? 'active' : ''}" data-hbfb-tab="${k}">${escapeHtml(hb(label))}</button>`).join('')}
        </nav>
        <div class="hbfb-body">${body}</div>
      </div>
    `;
    bindLangSwitcher(app);
    document.getElementById('back-home').addEventListener('click', () => { state.view = 'home'; render(); });
    document.getElementById('hbfb-tabs').addEventListener('click', (e) => {
      const btn = e.target.closest('.promo-tab');
      if (!btn) return;
      state.hbfbTab = btn.dataset.hbfbTab;
      render();
      document.getElementById('hbfb-content')?.scrollTo(0, 0);
    });
    document.getElementById('hbfb-content').addEventListener('click', (e) => {
      const card = e.target.closest('.hbfb-card');
      if (!card) return;
      const item = hbfbItem(Number(card.dataset.item));
      if (item) openItemModal(item, { hidePrice: true });
    });
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
          <div class="promo-feed ${state.promoCategory === 'theme_night' ? 'promo-feed-poster' : ''}" id="promo-feed">
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
    // Theme Night promotions are portrait A4 posters with the title/menu already
    // printed on them, so on that tab each card shows the whole poster (no
    // landscape crop, no text overlay) with the title as a caption underneath.
    if (state.promoCategory === 'theme_night' && promo.image) {
      return `
      <div class="promo-card promo-card-poster" data-promo="${promo.id}">
        <div class="promo-card-image" style="background-image:url('${promo.image}')"></div>
        <div class="promo-card-caption">
          <div class="promo-card-title">${escapeHtml(fmt(promo.title))}</div>
          ${fmt(promo.subtitle) ? `<div class="promo-card-subtitle">${escapeHtml(fmt(promo.subtitle))}</div>` : ''}
        </div>
      </div>
    `;
    }
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
    // Extra pages (promotions.detail_images) — shown after the first image as a
    // swipeable gallery (e.g. poster, then menu). A single image keeps the old
    // single-image popup behavior.
    const pages = [fullImage, ...((promo.detail_images || []))].filter(Boolean);
    // The promo artwork already carries the title/price/offer copy baked into the
    // image itself (that's how the promo images are designed), so when there's an
    // image we let it fill the screen edge-to-edge with just a close button on top —
    // no separate text bar underneath duplicating what the image already says. The
    // text block is only shown as a fallback for a promo that has no image yet.
    backdrop.innerHTML = pages.length > 1
      ? `
        <div class="modal promo-modal promo-modal-fullscreen promo-modal-gallery">
          <button class="modal-close" aria-label="Close">&times;</button>
          <div class="promo-gallery">
            ${pages.map((src, i) => `<div class="promo-slide"><img class="promo-modal-image" src="${src}" alt="${escapeHtml(fmt(promo.title))} ${i + 1}" /></div>`).join('')}
          </div>
          <button class="promo-gallery-nav promo-gallery-prev" aria-label="Previous">&#8249;</button>
          <button class="promo-gallery-nav promo-gallery-next" aria-label="Next">&#8250;</button>
          <div class="promo-gallery-dots">${pages.map((_, i) => `<span class="promo-gallery-dot${i === 0 ? ' active' : ''}"></span>`).join('')}</div>
        </div>
      `
      : fullImage
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
    const gallery = backdrop.querySelector('.promo-gallery');
    if (gallery) {
      const dots = Array.from(backdrop.querySelectorAll('.promo-gallery-dot'));
      const pageIndex = () => Math.round(Math.abs(gallery.scrollLeft) / gallery.clientWidth);
      const goTo = (i) => {
        const n = Math.max(0, Math.min(pages.length - 1, i));
        const dir = getComputedStyle(gallery).direction === 'rtl' ? -1 : 1;
        gallery.scrollTo({ left: dir * n * gallery.clientWidth, behavior: 'smooth' });
      };
      const sync = () => {
        const i = pageIndex();
        dots.forEach((d, k) => d.classList.toggle('active', k === i));
        backdrop.querySelector('.promo-gallery-prev').style.visibility = i === 0 ? 'hidden' : 'visible';
        backdrop.querySelector('.promo-gallery-next').style.visibility = i === pages.length - 1 ? 'hidden' : 'visible';
      };
      gallery.addEventListener('scroll', sync, { passive: true });
      backdrop.querySelector('.promo-gallery-prev').addEventListener('click', () => goTo(pageIndex() - 1));
      backdrop.querySelector('.promo-gallery-next').addEventListener('click', () => goTo(pageIndex() + 1));
      document.body.appendChild(backdrop);
      sync();
      return;
    }
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
