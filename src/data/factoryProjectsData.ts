export type LayoutType =
  | 'services'
  | 'navigation'
  | 'pos_cashier'
  | 'fitness'
  | 'food'
  | 'coworking'
  | 'telehealth'
  | 'agritech'
  | 'real_estate'
  | 'car_rental'
  | 'beauty_salon'
  | 'auction_live'
  | 'smart_education'
  | 'logistics_warehouse'
  | 'custom';

export interface UniversalAppSpec {
  project_id: string;
  app_name: string;
  tagline: string;
  preset: string;
  layout_type: LayoutType;
  theme: {
    primary_color: string;
    accent_color: string;
  };
  banner?: {
    title: string;
    subtitle: string;
  };
  categories: string[];
  items: {
    title: string;
    desc: string;
    price: string;
    icon?: string;
    badge?: string;
  }[];
  nav_tabs: {
    id: string;
    label: string;
    icon: string;
  }[];
  commit_hash: string;
  proof_screenshots: {
    title: string;
    path: string;
    fallback: string;
  }[];
  detailed_desc?: string;
  domain_data?: Record<string, any>;
}

export const realFactoryProjects: UniversalAppSpec[] = [
  // 1. Home Maintenance & On-Demand Services
  {
    project_id: "1265226",
    app_name: "تطبيق تسليح — الصيانة المنزلية المعتمدة",
    tagline: "فنيون معتمدون، تسعير فوري، وتتبع لحظي لموقع الفني على الخريطة",
    preset: "services",
    layout_type: "services",
    theme: {
      primary_color: "#0f766e",
      accent_color: "#f59e0b"
    },
    banner: {
      title: "فني طوارئ خلال 25 دقيقة",
      subtitle: "سباكة، كهرباء، وتكييف مع شهادة ضمان معتمدة وفاتورة رقمية"
    },
    categories: ["سباكة", "كهرباء", "تكييف", "أجهزة منزلية"],
    items: [
      {
        title: "كشف وإصلاح تسريبات المياه",
        desc: "فحص بالنيتروجين وأجهزة الصوت الأرضية لكشف مواضع التسريب",
        price: "120 ر.س",
        icon: "wrench",
        badge: "الأكثر طلباً"
      },
      {
        title: "صيانة وتعبئة فريون مكيف سبليت",
        desc: "غسيل كيميائي للوحدة الداخلية وتعبئة فريون R410A أمريكي أصلي",
        price: "180 ر.س",
        icon: "snowflake",
        badge: "ضمان 6 أشهر"
      },
      {
        title: "صيانة وتوازن لوحات القواطع الكهربائية",
        desc: "فحص القواطع الحرارية وموازنة الأحمال لمنع الانقطاع المفاجئ",
        price: "150 ر.س",
        icon: "zap"
      },
      {
        title: "صيانة محرك وطلمبة الغسالات الأوتوماتيك",
        desc: "استبدال السيور والمساعدات وصيانة كارت التحكم الإلكتروني",
        price: "140 ر.س",
        icon: "cpu"
      }
    ],
    nav_tabs: [
      { id: "services", label: "الخدمات", icon: "wrench" },
      { id: "order_tracking", label: "تتبع الفني", icon: "activity" },
      { id: "invoices", label: "الفواتير", icon: "file-text" }
    ],
    commit_hash: "a49f81c",
    proof_screenshots: [
      {
        title: "إقلاع التطبيق على Pixel 8",
        path: "shots/1265226_01.png",
        fallback: "Android 14 ARM64 Boots Clean"
      },
      {
        title: "توجيه الفني وحساب مسار GPS",
        path: "shots/1265226_02.png",
        fallback: "GPS Route Dispatch Verified"
      }
    ],
    detailed_desc: "منصة رقمية متكاملة لطلب وحجز خدمات الصيانة المنزلية الطارئة والروتينية. يتميز التطبيق بنظام توجيه ذكي للفني الأقرب عبر GPS، اعتماد أوامر العمل والقطع بفاتورة رقمية دقيقة، وتأكيد الدفع عبر رمز OTP لضمان حقوق العميل والفني.",
    domain_data: {
      active_technician: {
        name: "المهندس فهد الشمري",
        specialty: "أخصائي تكييف وتبريد معتمد",
        rating: "4.9 ★ (142 طلب)",
        eta_minutes: 18,
        distance_km: "3.2 كم",
        status: "في الطريق إليك الآن",
        job_order_id: "#ORD-9821"
      }
    }
  },

  // 2. Offline Desert Navigation & Topographic GPX HUD
  {
    project_id: "1266029",
    app_name: "دليل الصحراء — الملاحة والمسارات البرية",
    tagline: "ملاحة طوبوغرافية حية بالأقمار الصناعية دون الحاجة لشبكة الإنترنت",
    preset: "standard",
    layout_type: "navigation",
    theme: {
      primary_color: "#b45309",
      accent_color: "#0ea5e9"
    },
    banner: {
      title: "وضع الملاحة دون اتصال: نشط (100%)",
      subtitle: "تم تحميل حزم خرائط الدهناء والنفود الكبرى والربع الخالي"
    },
    categories: ["مسارات برية", "نقاط مياه", "مخيمات", "إغاثة طارئة"],
    items: [
      {
        title: "مسار رمال الثمامة المفتوح",
        desc: "مسار طولي 45 كم عبر الكثبان الحمراء مع نقاط أمان مؤكدة",
        price: "GPX جاهز",
        icon: "compass",
        badge: "سهل"
      },
      {
        title: "مخيم ونقطة إغاثة الدهناء",
        desc: "إحداثيات مهبط طوارئ ونقطة مياه نقية صالحة للشرب",
        price: "نقطة أمان",
        icon: "map-pin",
        badge: "مياه متوفرة"
      },
      {
        title: "مسار حافة العالم الصخري",
        desc: "مسار وعر لسيارات الدفع الرباعي المجهزة مع إحداثيات الإطلالة",
        price: "GPX جاهز",
        icon: "mountain",
        badge: "وعر 4x4"
      }
    ],
    nav_tabs: [
      { id: "hud", label: "شاشة HUD", icon: "compass" },
      { id: "waypoints", label: "النقاط", icon: "map-pin" },
      { id: "sos_beacon", label: "طوارئ SOS", icon: "radio" }
    ],
    commit_hash: "d781b0a",
    proof_screenshots: [
      {
        title: "محاكي الملاحة دون اتصال",
        path: "shots/1266029_01.png",
        fallback: "Offline Vector Tile Render OK"
      },
      {
        title: "قراءة البوصلة الجيروسكوبية",
        path: "shots/1266029_02.png",
        fallback: "Hardware Sensor Accelerometer Hooked"
      }
    ],
    detailed_desc: "تطبيق ملاحة وتوجيه بري متخصص لمرتادي الصحراء وهواة الرحلات البرية والتخييم في المملكة. يعمل بكفاءة 100% دون اتصال بشبكة الإنترنت مع دعم تصدير واستيراد مسارات GPX، بوصلة جيروسكوبية مدمجة، وحساب دقيق لنقاط الاهتمام ومسارات الطوارئ (SOS).",
    domain_data: {
      compass_bearing: 312,
      compass_direction: "شمال غرب (NW)",
      altitude_meters: 742,
      coordinates: "24°42'54\" N, 46°40'31\" E",
      satellite_fix: "11 قمر صناعي متصل (GPS/GLONASS)"
    }
  },

  // 3. ZATCA Phase 2 POS & Bluetooth Cashier
  {
    project_id: "1266318",
    app_name: "دكان كاشير — نقاط البيع والفوترة الإلكترونية",
    tagline: "نظام كاشير مالي متوافق 100% مع متطلبات المرحلة الثانية لهيئة الزكاة (ZATCA)",
    preset: "ecommerce",
    layout_type: "pos_cashier",
    theme: {
      primary_color: "#1d4ed8",
      accent_color: "#16a34a"
    },
    banner: {
      title: "فاتورة ضريبية مبسطة بـ QR فوري",
      subtitle: "مشفرة بنظام TLV ومربوطة مع منصة فاتورة عبر API"
    },
    categories: ["كل الأصناف", "قهوة ومشروبات", "تمور ومخبوزات", "بقالة"],
    items: [
      {
        title: "قهوة عربية فاخرة بالهيل 250 جم",
        desc: "بن هرري درجة أولى محمص طازج",
        price: "32.00 ر.س",
        icon: "coffee"
      },
      {
        title: "تمر خلاص الأحساء كنز فاخر 1 كجم",
        desc: "خلاص ملكي منتقى بعناية ومفرغ من الهواء",
        price: "25.00 ر.س",
        icon: "box"
      },
      {
        title: "مياه نبع القصيم كرتون 40 عبوة",
        desc: "مياه شرب نقية منخفضة الصوديوم 330 مل",
        price: "18.50 ر.س",
        icon: "droplet"
      },
      {
        title: "معمول تمر بالبر الفاخر 500 جم",
        desc: "معمول طازج خالي من السكر المضاف",
        price: "22.00 ر.س",
        icon: "box"
      }
    ],
    nav_tabs: [
      { id: "register", label: "نقطة البيع", icon: "calculator" },
      { id: "orders", label: "الفواتير", icon: "receipt" },
      { id: "bluetooth", label: "طابعة ESC/POS", icon: "bluetooth" }
    ],
    commit_hash: "e903bc1",
    proof_screenshots: [
      {
        title: "توليد كود TLV الضريبي ZATCA",
        path: "shots/1266318_01.png",
        fallback: "Base64 TLV Encoded QR Verified"
      },
      {
        title: "طباعة بلوتوث ESC/POS",
        path: "shots/1266318_02.png",
        fallback: "Thermal Printer Driver OK"
      }
    ],
    detailed_desc: "نظام نقاط بيع سحابي خفيف وسريع للمحلات التجارية والمتاجر المتنقلة، يتضمن مسح الباركود بالكاميرا، طباعة الفواتير عبر طابعات البلوتوث ESC/POS، وإنشاء رمز الاستجابة السريعة المشفر بنظام TLV المتوافق مع متطلبات هيئة الزكاة والضريبة والجمارك بالمملكة.",
    domain_data: {
      seller_name: "مؤسسة دكان الرواد للتجارة",
      vat_number: "300982189200003",
      printer_status: "متصلة: طابعة إبسون الحرارية عبر Bluetooth",
      invoice_sequence: "INV-2026-0894",
      zatca_tlv_preview: "AQ5kb2trYW4gcm93YWQCEzMwMDk4MjE4OTIwMDAwMxMUMjAyNi0xMC0zMVQxMTozMDowMFoEBzg4LjAwBQExMS40OA=="
    }
  },

  // 4. Fitness, Biometric Health & Bluetooth LE Weight Scale
  {
    project_id: "1270416",
    app_name: "تطبيق لياقة — التدريب الذكي والمستشعرات",
    tagline: "مزامنة مباشرة مع موازين BLE الذكية، حساب السعرات، وبرامج تدريب حركية",
    preset: "standard",
    layout_type: "fitness",
    theme: {
      primary_color: "#dc2626",
      accent_color: "#f97316"
    },
    banner: {
      title: "الميزان الذكي BLE: متصل وجاهز للوزن",
      subtitle: "مزامنة لحظية للوزن ونسبة الدهون والكتلة العضلية تلقائياً"
    },
    categories: ["تمارين اليوم", "تحليل الميزان", "خطة التغذية"],
    items: [
      {
        title: "جلسة تمرين الصدر والكتف الخارق",
        desc: "45 دقيقة · 4 جولات · شرح تفصيلي لزوايا الحركة والراحة",
        price: "مكتمل 100%",
        icon: "activity",
        badge: "تمارين قوة"
      },
      {
        title: "جلسة كارديو هيدروجيني متقطع (HIIT)",
        desc: "25 دقيقة لحرق الدهون ورفع معدل اللياقة التنفسية",
        price: "مجدول 06:00 م",
        icon: "zap",
        badge: "حرق دهون"
      }
    ],
    nav_tabs: [
      { id: "dashboard", label: "نشاطي", icon: "activity" },
      { id: "scale", label: "الميزان الذكي", icon: "scale" },
      { id: "nutrition", label: "السعرات", icon: "pie-chart" }
    ],
    commit_hash: "b7289fa",
    proof_screenshots: [
      {
        title: "مزامنة مستشعر الوزن BLE",
        path: "shots/1270416_01.png",
        fallback: "GATT Characteristic 0x2A98 Read OK"
      },
      {
        title: "رسوم الحركة Vector Drawables",
        path: "shots/1270416_02.png",
        fallback: "Compose Canvas Vector Render 120fps"
      }
    ],
    detailed_desc: "منصة تدريب لياقة بدنية وتغذية تقدم جداول تمارين حركية مصورة بالفيديو، تتبع الوزن والسعرات اليومية، وتنبيهات شرب الماء والنشاط البدني مع دعم كامل للاتصال بموازين البلوتوث وأجهزة الاستشعار عبر Health Connect.",
    domain_data: {
      current_weight_kg: 74.25,
      target_weight_kg: 71.00,
      body_fat_pct: 16.8,
      muscle_mass_kg: 58.4,
      water_pct: 61.2,
      bmi: 23.4,
      calories_burned: 640,
      calories_target: 2200,
      ble_device_name: "Smart Scale Pro (GATT 0x181D)"
    }
  },

  // 5. Coworking & Meeting Rooms QR Access
  {
    project_id: "1270493",
    app_name: "مكتب — حجز مساحات العمل وقاعات الاجتماعات",
    tagline: "احجز مكتبك أو قاعتك المفضلة بالساعة مع الدفع وبطاقة الدخول الذكية بالـ QR",
    preset: "services",
    layout_type: "coworking",
    theme: {
      primary_color: "#0d9488",
      accent_color: "#eab308"
    },
    banner: {
      title: "بطاقة الدخول الذكية (QR Pass): مفعلة",
      subtitle: "فرع الرياض — طريق الملك فهد · بوابة الدخول الدور 4"
    },
    categories: ["مكاتب مشتركة", "مكاتب خاصة", "قاعات اجتماعات", "أجنحة تنفيذية"],
    items: [
      {
        title: "قاعة اجتماعات الرواد (12 شخص)",
        desc: "شاشة تفاعلية 4K، إنترنت ألياف ضوئية 1 جيجابت، وضيافة قهوة فاخرة",
        price: "150 ر.س / ساعة",
        icon: "monitor",
        badge: "متاحة الآن"
      },
      {
        title: "مكتب مرن فليكس (Flex Desk)",
        desc: "كرسي مريح مريح للظهر، كهرباء مدمجة، ووصول لمنطقة الاستراحة",
        price: "35 ر.س / يوم",
        icon: "cpu",
        badge: "حجز فوري"
      },
      {
        title: "مكتب خاص مستقل مغلق (2 مقعد)",
        desc: "خصوصية كاملة وعزل صوتي وتكييف مستقل وخزائن إلكترونية",
        price: "450 ر.س / أسبوع",
        icon: "box",
        badge: "فاخر"
      }
    ],
    nav_tabs: [
      { id: "explore", label: "المساحات", icon: "grid" },
      { id: "qr_pass", label: "بطاقة الدخول", icon: "qr-code" },
      { id: "bookings", label: "حجوزاتي", icon: "calendar" }
    ],
    commit_hash: "f44199a",
    proof_screenshots: [
      {
        title: "بطاقة الدخول المشفرة QR",
        path: "shots/1270493_01.png",
        fallback: "Dynamic Rotating TOTP QR Verified"
      },
      {
        title: "حجز القاعات بالتقويم الفوري",
        path: "shots/1270493_02.png",
        fallback: "Slot Conflict Resolution Engine OK"
      }
    ],
    detailed_desc: "تطبيق مبتكر لحجز المكاتب المشتركة ومكاتب العمل وقاعات الاجتماعات. يتيح معاينة تفاصيل المساحة، فحص توفر القاعات بالتقويم الفوري، سداد الفاتورة إلكترونياً، وإصدار بطاقة الدخول الذكية بالـ QR Code المتجدد لفتح بوابات الأمان.",
    domain_data: {
      active_pass: {
        pass_code: "COWORK-PASS-99824",
        building: "برج المجدول — فرع مساحات مكتب",
        access_level: "قاعة الاجتماعات B + البوابة الرئيسية",
        valid_until: "اليوم حتى الساعة 08:00 م",
        wifi_ssid: "Maktub_HighSpeed_5G",
        wifi_pass: "SecureGuest@2026"
      }
    }
  },

  // 6. Food Rescue & Surplus Bakery Marketplace
  {
    project_id: "1270630",
    app_name: "بايت — إنقاذ فائض الأطعمة والمخبوزات",
    tagline: "احصل على وجبات ومخبوزات فاخرة فائضة بخصم يصل إلى 70% وحافظ على البيئة",
    preset: "food",
    layout_type: "food",
    theme: {
      primary_color: "#16a34a",
      accent_color: "#ca8a04"
    },
    banner: {
      title: "نافذة الاستلام اليومي مفتوحة الآن",
      subtitle: "أنقذ سلال الأطعمة الفاخرة المتبقية من أرقى المخابز والمطاعم قبل الإغلاق"
    },
    categories: ["سلال مخابز", "مطاعم فاخرة", "سوبرماركت طازج", "قهوة وحلويات"],
    items: [
      {
        title: "سلة مفاجأة مخبوزات كرواسون فرنسية",
        desc: "سلة مشكلة من 6 قطع كرواسون بالزبدة وشوكولاتة طازجة مخبوزة اليوم",
        price: "24 ر.س (بدلاً من 75)",
        icon: "box",
        badge: "وفر 68%"
      },
      {
        title: "وجبة شيف إيطالية فاخرة متبقية",
        desc: "باستا رافيولي طازجة مع سلطة بوراتا محضرة بعناية من كبرى الفنادق",
        price: "35 ر.س (بدلاً من 90)",
        icon: "coffee",
        badge: "متبقي 2 فقط"
      },
      {
        title: "صندوق فواكه استوائية طازجة منتقاة",
        desc: "صندوق 2.5 كجم مانجو وتوت وأناناس ناضج تماماً للاستهلاك اليوم",
        price: "28 ر.س (بدلاً من 65)",
        icon: "box",
        badge: "طازج 100%"
      }
    ],
    nav_tabs: [
      { id: "discover", label: "السلال المتاحة", icon: "shopping-bag" },
      { id: "pickup_map", label: "خريطة الاستلام", icon: "map-pin" },
      { id: "impact", label: "أثري البيئي", icon: "sparkles" }
    ],
    commit_hash: "c8129ee",
    proof_screenshots: [
      {
        title: "خريطة المخابز الشريكة القريبة",
        path: "shots/1270630_01.png",
        fallback: "Map Clustering 50ms Render"
      },
      {
        title: "رمز الاستلام السريع OTP",
        path: "shots/1270630_02.png",
        fallback: "Store Pickup Handshake OK"
      }
    ],
    detailed_desc: "منصة استدامة وإنقاذ أطعمة تربط المستخدمين بالمخابز والمطاعم ومحلات البقالة لبيع الأطعمة والمخبوزات الطازجة الفائضة بخصومات كبيرة، مع توقيت استلام محدد وعداد يوضح كمية الانبعاثات الكربونية التي تم إنقاذها.",
    domain_data: {
      saved_meals_count: 148,
      co2_saved_kg: 370,
      pickup_window: "08:30 م - 10:00 م اليوم",
      store_distance_km: "1.4 كم",
      store_name: "مخبز لا باريسيان — حي السليمانية"
    }
  },

  // 7. Telehealth & Vital Signs Monitoring
  {
    project_id: "1271104",
    app_name: "تطبيق نبض — العيادة الرقمية والمؤشرات الحيوية",
    tagline: "استشارات طبية مرئية فورية، ربط أجهزة قياس الضغط والسكر، وتتبع حيوي لحظي",
    preset: "standard",
    layout_type: "telehealth",
    theme: {
      primary_color: "#0284c7",
      accent_color: "#ef4444"
    },
    banner: {
      title: "طبيب الأسرة متاح للمحادثة المرئية الآن",
      subtitle: "متوسط وقت انتظار الاستشارة: 3 دقائق · أطباء معتمدون من هيئة التخصصات"
    },
    categories: ["استشارة فورية", "قراءات الضغط", "معدل النبض ECG", "الوصفات"],
    items: [
      {
        title: "استشارة طب عام وطب أسرة مرئية",
        desc: "مكالمة فيديو آمنة ومشفرة 15 دقيقة مع إصدار الوصفة الإلكترونية",
        price: "79 ر.س",
        icon: "heart-pulse",
        badge: "متاح الآن"
      },
      {
        title: "فحص ومتابعة السكري ومقاومة الإنسولين",
        desc: "تحليل منحنى السكر التراكمي وتعديل الجرعات مع أخصائي غدد صماء",
        price: "120 ر.س",
        icon: "activity",
        badge: "استشاري"
      }
    ],
    nav_tabs: [
      { id: "clinic", label: "العيادة", icon: "heart-pulse" },
      { id: "vitals", label: "العلامات الحيوية", icon: "activity" },
      { id: "prescriptions", label: "الوصفات", icon: "file-text" }
    ],
    commit_hash: "a99182d",
    proof_screenshots: [
      {
        title: "مزامنة حساس النبض والضغط BLE",
        path: "shots/1271104_01.png",
        fallback: "Blood Pressure GATT 0x1810 Connected"
      },
      {
        title: "غرفة مكالمة الفيديو WebRTC",
        path: "shots/1271104_02.png",
        fallback: "Audio/Video Stream Encrypted SRTP"
      }
    ],
    detailed_desc: "تطبيق رعاية صحية رقمية واستشارات طبية عن بعد يدعم الاتصال المباشر بأجهزة قياس ضغط الدم ومستشعرات النبض وسكر الدم عبر تقنية البلوتوث منخفض الطاقة، وتوثيق ملف المريض برقم الهوية والوصفات الرقمية المعتمدة.",
    domain_data: {
      doctor_name: "د. سارة المنصور",
      specialty: "استشارية طب الأسرة والأمراض المزمنة",
      queue_wait_mins: 3,
      bp_systolic: 118,
      bp_diastolic: 78,
      heart_rate_bpm: 72,
      blood_oxygen_pct: 99,
      ble_bp_monitor: "Omron Connect BLE (GATT 0x1810)"
    }
  },

  // 8. Smart Agriculture IoT & Soil Telemetry
  {
    project_id: "1271589",
    app_name: "منصة حصاد — الاستشعار الزراعي والري المؤتمت",
    tagline: "مراقبة رطوبة التربة والطقس عبر شبكات LoRaWAN وتشغيل محابس الري ذكياً",
    preset: "standard",
    layout_type: "agritech",
    theme: {
      primary_color: "#15803d",
      accent_color: "#eab308"
    },
    banner: {
      title: "شبكة مجسات المزرعة: نشطة (16 مجس LoRaWAN)",
      subtitle: "متوسط رطوبة التربة 42% · محابس الري في وضع التوفير التلقائي"
    },
    categories: ["حقول النخيل", "البيوت المحمية", "محابس الري", "خزانات المياه"],
    items: [
      {
        title: "حقل نخيل الصقعي — القطاع الشرقي",
        desc: "مجس عمق 60 سم: رطوبة 38%، ملوحة EC 1.2 dS/m، درجة حرارة 24°C",
        price: "مجدول 05:00 ص",
        icon: "sprout",
        badge: "بحاجة للري"
      },
      {
        title: "البيت المحمي رقم 4 (طماطم هيدروبونيك)",
        desc: "رطوبة الهواء 68%، درجة الحرارة 22.5°C، نظام الضباب التبريدي يعمل",
        price: "مثالي 100%",
        icon: "sprout",
        badge: "طبيعي"
      }
    ],
    nav_tabs: [
      { id: "telemetry", label: "المجسات", icon: "activity" },
      { id: "valves", label: "محابس الري", icon: "droplet" },
      { id: "weather", label: "محطة الطقس", icon: "sun" }
    ],
    commit_hash: "e31908b",
    proof_screenshots: [
      {
        title: "حزم تيليميتري LoRaWAN 868MHz",
        path: "shots/1271589_01.png",
        fallback: "ChirpStack LoRa Telemetry Parsed"
      },
      {
        title: "التحكم في محبس السولينويد",
        path: "shots/1271589_02.png",
        fallback: "Relay Pulse Trigger 24V Verified"
      }
    ],
    detailed_desc: "منصة تحكم وإنترنت أشياء زراعية متطورة لربط مجسات التربة ورطوبة الأعماق عبر شبكات LoRaWAN وNB-IoT، وإدارة ري النخيل والمحاصيل بدقة بناء على معدلات التبخر والنتح (ET0) لمنع الهدر وحفظ المياه الجوفية.",
    domain_data: {
      soil_moisture_pct: 42,
      soil_temp_c: 24.6,
      salinity_ec: 1.2,
      water_tank_level_pct: 86,
      active_valves_open: 2,
      irrigation_mode: "تحكم ذكي بالطقس (Smart ET0)",
      lorawan_gateway_status: "متصل (16 عقدة نشطة)"
    }
  },

  // 9. PropTech & Luxury Real Estate
  {
    project_id: "1272001",
    app_name: "منصة إيوان — العقارات الفاخرة وإدارة الأملاك",
    tagline: "جولات افتراضية ثلاثية الأبعاد، صكوك إلكترونية موثقة، وحجز معاينات فورية",
    preset: "real_estate",
    layout_type: "real_estate",
    theme: {
      primary_color: "#1e3a8a",
      accent_color: "#d97706"
    },
    banner: {
      title: "صكوك إلكترونية معتمدة بنسبة 100%",
      subtitle: "استكشف أكثر من 450 عقاراً فاخراً في الرياض وجدة مع جولات LiDAR ثلاثية الأبعاد"
    },
    categories: ["الفلل الفاخرة", "شقق البنتهاوس", "الأراضي التجارية", "المقرات المكتبية"],
    items: [
      {
        title: "فيلا حي حطين المعمارية الفاخرة",
        desc: "مساحة 750 م²، مسبح ذكي، نظام أتمتة كامل، 6 أجنحة نوم ماستر",
        price: "6,850,000 ر.س",
        icon: "home",
        badge: "صك إلكتروني موثق"
      },
      {
        title: "بنتهاوس برج المجدول — إطلالة بانورامية",
        desc: "الدور 42، مساحة 420 م²، مصعد خاص، تراس خارجي واسع مع مسبح معلق",
        price: "4,200,000 ر.س",
        icon: "building",
        badge: "جاهز للإفراغ"
      },
      {
        title: "أرض تجارية استثمارية طريق الملك فهد",
        desc: "واجهة 40 متر، ترخيص أبراج مكتبية متعددة الاستخدام، مساحة 1,200 م²",
        price: "18,500,000 ر.س",
        icon: "map-pin",
        badge: "استثمار مميز"
      }
    ],
    nav_tabs: [
      { id: "listings", label: "العقارات", icon: "home" },
      { id: "tour_3d", label: "جولة 3D", icon: "box" },
      { id: "broker", label: "الوسيط المعتمد", icon: "user" }
    ],
    commit_hash: "b812001",
    proof_screenshots: [
      {
        title: "جولة LiDAR ثلاثية الأبعاد",
        path: "shots/1272001_01.png",
        fallback: "3D Spatial Point Cloud Mesh Ready"
      },
      {
        title: "التحقق من الصك في منصة البورصة العقارية",
        path: "shots/1272001_02.png",
        fallback: "Saudi Real Estate Registry Verified"
      }
    ],
    detailed_desc: "منصة عقارية متكاملة لخدمة صفقات العقارات الراقية والاستثمار المؤسسي، مدعمة بجولات الواقع الافتراضي وLiDAR، وتأكيد موثوقية التراخيص من الهيئة العامة للعقار وحجز زيارات المعاينة عبر الوسيط المعتمد.",
    domain_data: {
      verified_broker_name: "أ. سلطان الخالدي (ترخيص فال: 12000349)",
      broker_phone: "+966501234567",
      lidar_active: true,
      matterport_model_id: "iw-riyadh-750m",
      title_deed_number: "310109284711",
      avg_square_meter_sar: 9133
    }
  },

  // 10. Smart Car Rental & Automotive Telematics
  {
    project_id: "1272002",
    app_name: "أسطول نجد — تأجير السيارات الذكي والتحكم الفوري",
    tagline: "فتح السيارة بالهاتف، فحص العدادات عبر OBD-II، وتفويض تم فوري برقم الهوية",
    preset: "car_rental",
    layout_type: "car_rental",
    theme: {
      primary_color: "#0284c7",
      accent_color: "#f59e0b"
    },
    banner: {
      title: "استلم سيارتك خلال 3 دقائق بدون مكاتب",
      subtitle: "فتح الأبواب وتشغيل المحرك مباشرة عبر البلوتوث والمفتاح الرقمي المشفر"
    },
    categories: ["سيارات فارهة", "عائلية SUV", "اقتصادية", "كهربائية EV"],
    items: [
      {
        title: "رنج روفر فيلار 2026 — دفع رباعي",
        desc: "محرك 6 سلندر توربو، مقاعد تدليك، نظام صوت ميريديان فائق",
        price: "680 ر.س/يوم",
        icon: "car",
        badge: "تأمين شامل"
      },
      {
        title: "لوسيد آير بيور — كهربائية 100%",
        desc: "مدى قيادة 650 كم بالشحنة، تسارع 0-100 خلال 3.8 ثوان، قيادة ذاتية",
        price: "850 ر.س/يوم",
        icon: "zap",
        badge: "شحن مجاني"
      },
      {
        title: "تويوتا لاندكروزر VXR 2026",
        desc: "مجهزة للبر والرحلات الطويلة، ثلاجة، نظام ترفيه خلفي",
        price: "550 ر.س/يوم",
        icon: "shield",
        badge: "كيلومتر مفتوح"
      }
    ],
    nav_tabs: [
      { id: "fleet", label: "الأسطول", icon: "car" },
      { id: "telematics", label: "التحكم بالسيارة", icon: "activity" },
      { id: "contract", label: "العقد والتم", icon: "file-text" }
    ],
    commit_hash: "c922002",
    proof_screenshots: [
      {
        title: "قراءة حساسات OBD-II CAN Bus",
        path: "shots/1272002_01.png",
        fallback: "CAN-Bus Fuel & Odometer Polled"
      },
      {
        title: "المفتاح الرقمي المشفر BLE",
        path: "shots/1272002_02.png",
        fallback: "BLE Digital Key Handshake OK"
      }
    ],
    detailed_desc: "منصة تأجير سيارات ذاتية الخدمة بالكامل بدون زيارة فروع، ترتبط بوحدات التيليماتكس داخل المركبات لمراقبة استهلاك الوقود ومستوى الزيت والمسافة المقطوعة، مع إصدار التفويض عبر منصة تم آلياً.",
    domain_data: {
      vehicle_model: "Range Rover Velar 2026",
      plate_number: "د ب ع 9182",
      fuel_level_pct: 88,
      odometer_km: 14220,
      doors_locked: true,
      tire_pressure_psi: 34,
      tamm_authorization_id: "TAMM-AUTH-9018274"
    }
  },

  // 11. Luxury Salon, Spa & Wellness
  {
    project_id: "1272003",
    app_name: "صالون لافندر — العناية الفاخرة وحجز المواعيد الذكي",
    tagline: "اختيار خبيرة التجميل، حجز المواعيد بالدقيقة، وتعقيم المعدات بتقنية UV-C",
    preset: "beauty_salon",
    layout_type: "beauty_salon",
    theme: {
      primary_color: "#7e22ce",
      accent_color: "#ec4899"
    },
    banner: {
      title: "أوقات استرخاء وعناية متكاملة",
      subtitle: "باقات متخصصة للبشرة والشعر والأظافر بأيدي خبيرات دوليات معتمدات"
    },
    categories: ["العناية بالشعر", "علاجات البشرة", "المساج والاسترخاء", "الأظافر والباديكير"],
    items: [
      {
        title: "جلسة هيدرافاشيال متقدمة لتنقية البشرة",
        desc: "تقشير عميق، سحب الشوائب بالسيروم، وترطيب بحمض الهيالورونيك النقي",
        price: "380 ر.س",
        icon: "sparkles",
        badge: "الأكثر طلباً"
      },
      {
        title: "علاج كافيار الكولاجين لترميم الشعر",
        desc: "تغذية عميقة لألياف الشعر التالف مع حمام بخار أوزوني مدعم بالفيتامينات",
        price: "450 ر.س",
        icon: "scissors",
        badge: "نتائج فورية"
      },
      {
        title: "مساج استرخائي بالأحجار البركانية الدافئة",
        desc: "جلسة 60 دقيقة لتحسين الدورة الدموية وإزالة تشنجات الظهر والكتفين",
        price: "290 ر.س",
        icon: "heart",
        badge: "راحة تامة"
      }
    ],
    nav_tabs: [
      { id: "services", label: "الخدمات", icon: "sparkles" },
      { id: "stylists", label: "الخبيرات والمواعيد", icon: "calendar" },
      { id: "loyalty", label: "نقاط لافندر", icon: "award" }
    ],
    commit_hash: "d432003",
    proof_screenshots: [
      {
        title: "حساس التعقيم بالأشعة UV-C",
        path: "shots/1272003_01.png",
        fallback: "UV-C Chamber Sterilization Logged"
      },
      {
        title: "جدول المواعيد المتزامن لحظياً",
        path: "shots/1272003_02.png",
        fallback: "Calendar Slot Lock Verified"
      }
    ],
    detailed_desc: "تطبيق حجوزات صالونات ومراكز سبا راقية يقضي على طوابير الانتظار، يوفر حجز خبيرة محددة مع تقييماتها ومحفظة أعمالها، ويتصل بمجسات تعقيم الأدوات لتأكيد السلامة الصحية للعميل.",
    domain_data: {
      active_specialist: "أ. نورة التميمي (أخصائية عناية بالبشرة)",
      available_slots: ["10:30 ص", "12:00 م", "02:30 م", "05:00 م", "07:30 م"],
      sterilization_status: "معقم 100% بتقنية UV-C",
      loyalty_points: 340,
      chamber_temp_c: 23
    }
  },

  // 12. Live Real-time Auctions & Rare Collectibles
  {
    project_id: "1272004",
    app_name: "مزادات الصافنات — المزادات الحية والنوادر والعقارات",
    tagline: "مزايدة حية بالصوت والصورة، مضرب مزايدة لاسلكي BLE، ومطرقة إلكترونية موثقة",
    preset: "auction_live",
    layout_type: "auction_live",
    theme: {
      primary_color: "#991b1b",
      accent_color: "#f59e0b"
    },
    banner: {
      title: "المزاد المباشر نشط الآن — ينتهي خلال 00:38 ثانية",
      subtitle: "المزايدة على خيل عربي أصيل خط صقلاوي جدراني بضمان بنكي محجوز"
    },
    categories: ["الخيل والنوادر", "العقارات الاستثمارية", "اللوحات المميزة", "الساعات الفاخرة"],
    items: [
      {
        title: "المهر العربي الأصيل (سيف الصافنات)",
        desc: "الأب: مروان الشقب، الأم: ريانة نجد، حاصل على بطولات دولية",
        price: "285,000 ر.س",
        icon: "award",
        badge: "السعر الحالي الأعلى"
      },
      {
        title: "لوحة مركبة مميزة رقم (ط و ق 1)",
        desc: "لوحة خصوصي ملكية مسجلة وموثقة عبر منصة أبشر للمزادات",
        price: "190,000 ر.س",
        icon: "tag",
        badge: "مزاد مفتوح"
      },
      {
        title: "ساعة رولكس دايتونا بلاتينيوم 2025",
        desc: "إصدار الذكرى السنوية، ميناء أزرق جليدي مع الأوراق والضمان الكامل",
        price: "340,000 ر.س",
        icon: "clock",
        badge: "فحص أصلي معتمد"
      }
    ],
    nav_tabs: [
      { id: "live_auction", label: "المزاد المباشر", icon: "activity" },
      { id: "my_bids", label: "مزايداتي", icon: "award" },
      { id: "escrow", label: "الضمان المالي", icon: "shield" }
    ],
    commit_hash: "e542004",
    proof_screenshots: [
      {
        title: "بث صوت المزايد بزمن استجابة Sub-100ms",
        path: "shots/1272004_01.png",
        fallback: "Ultra-low Latency WebRTC Opus Stream"
      },
      {
        title: "مضرب المزايدة اللاسلكي BLE GATT",
        path: "shots/1272004_02.png",
        fallback: "Bid Paddle Hardware Event Triggered"
      }
    ],
    detailed_desc: "منصة مزادات علنية إلكترونية حية وفائقة السرعة، تتيح للمزايدين رفع السعر بضغطة زر واحدة أو عبر مضرب المزايدة اللاسلكي المتصل بالبلوتوث، مع التوثيق المالي عبر الشيك المصرفي المصدق أو الحجز الفوري لمبلغ الضمان.",
    domain_data: {
      current_bid_sar: 285000,
      minimum_step_sar: 5000,
      leading_bidder_masked: "مزايد #419 (الرياض)",
      countdown_seconds: 38,
      escrow_deposit_sar: 50000,
      escrow_status: "محجوز ومعتمد بنكياً",
      total_bids_count: 34
    }
  },

  // 13. Smart Interactive EdTech & Verified Certifications
  {
    project_id: "1272005",
    app_name: "أكاديمية طويق — التعليم التفاعلي والشهادات المعتمدة",
    tagline: "قاعات تدريب حية، قلم ذكي لمزامنة الشروحات، وشهادات رقمية موثقة بالبلوكتشين",
    preset: "smart_education",
    layout_type: "smart_education",
    theme: {
      primary_color: "#047857",
      accent_color: "#3b82f6"
    },
    banner: {
      title: "معسكر تطوير تطبيقات أندرويد المتقدمة (Jetpack Compose)",
      subtitle: "محاضرة مباشرة تعمل الآن مع المدرب المعتمد مع بث تفاعلي للسبورة الذكية"
    },
    categories: ["تطوير البرمجيات", "الذكاء الاصطناعي", "الأمن السيبراني", "إدارة المنتجات"],
    items: [
      {
        title: "معسكر Kotlin Multiplatform وCompose",
        desc: "120 ساعة تدريبية عملية، بناء 6 مشاريع إنتاجية حقيقية، اعتماد تقني",
        price: "1,850 ر.س",
        icon: "code",
        badge: "معتمد من المؤسسة العامة"
      },
      {
        title: "دبلوم هندسة نماذج الذكاء الاصطناعي التوليدي",
        desc: "تدريب على أدوات Google Cloud وLLM Agents وبناء واجهات API آمنة",
        price: "2,400 ر.س",
        icon: "cpu",
        badge: "مقاعد محدودة"
      },
      {
        title: "شهادة قيادة الأمن السيبراني للمؤسسات",
        desc: "إعداد لاختبارات CISSP مع محاكاة بيئات الهجوم والدفاع السيبراني",
        price: "1,500 ر.س",
        icon: "shield",
        badge: "مسائي مرن"
      }
    ],
    nav_tabs: [
      { id: "classroom", label: "القاعة الحية", icon: "video" },
      { id: "assignments", label: "الواجبات والشروحات", icon: "book-open" },
      { id: "certificates", label: "الشهادات", icon: "award" }
    ],
    commit_hash: "f652005",
    proof_screenshots: [
      {
        title: "قلم الرسم والسبورة الذكية 4096 ضغط",
        path: "shots/1272005_01.png",
        fallback: "Smart Stylus Digitizer Pressure 4096 Sync"
      },
      {
        title: "الشهادة الرقمية المعتمدة برمز QR",
        path: "shots/1272005_02.png",
        fallback: "Cryptographic Certificate Hash Verified"
      }
    ],
    detailed_desc: "منصة تدريب تقني ومهني تفاعلية تدعم الحضور الافتراضي وتزامن كتابات المحاضر على الشاشات اللوحية بدقة 4096 مستوى ضغط، وتصدر شهادات التخرج برقم اعتماد وطني ورمز فحص مشفر لا يقبل التزوير.",
    domain_data: {
      live_class_topic: "هندسة الطبقات المعمارية Clean MVVM في Jetpack Compose",
      instructor_name: "م. خالد السديري (خبير تقني)",
      active_students_count: 84,
      attendance_beacon_detected: true,
      quiz_score_pct: 96,
      certificate_hash: "0x78ab310cd9912048"
    }
  },

  // 14. Logistics, Smart Warehouse & Inventory WMS
  {
    project_id: "1272006",
    app_name: "مستودعات مسار — إدارة المخزون والجرد بالباركود وRFID",
    tagline: "جرد سريع بماسحات 2D ليزرية، وزن الطبالي بالبلوتوث، وطباعة بوالص الشحن",
    preset: "logistics_warehouse",
    layout_type: "logistics_warehouse",
    theme: {
      primary_color: "#b45309",
      accent_color: "#10b981"
    },
    banner: {
      title: "مستودع السلي المركزي — الرياض (القطاع B4)",
      subtitle: "تم مسح 1,840 شحنة اليوم مع مطابقة المخزون بنسبة دقة 99.8%"
    },
    categories: ["استلام الشحنات", "الصرف والتجهيز", "الجرد الدوري", "طباعة بوالص"],
    items: [
      {
        title: "طبلية قطع غيار سيارات — موقع B-12-04",
        desc: "الباركود: PAL-901827، الوزن: 380 كجم، 48 كرتون قطع تبريد أصلية",
        price: "تم الفحص والوزن",
        icon: "package",
        badge: "مطابق 100%"
      },
      {
        title: "حاوية أجهزة إلكترونية — موقع A-04-01",
        desc: "الباركود: PAL-881290، الوزن: 210 كجم، أجهزة لوحية وشاشات رقمية",
        price: "بانتظار الصرف",
        icon: "cpu",
        badge: "عاجل"
      },
      {
        title: "طبلية مستلزمات طبية معقمة — موقع C-08-02",
        desc: "الباركود: PAL-772109، الوزن: 140 كجم، شحنة مبردة تحت 18°C",
        price: "مخزن مبرد",
        icon: "thermometer",
        badge: "حساس للحرارة"
      }
    ],
    nav_tabs: [
      { id: "scanner", label: "مسح الباركود", icon: "qr-code" },
      { id: "inventory", label: "سجل المخزون", icon: "layers" },
      { id: "shipping", label: "بوالص الشحن", icon: "printer" }
    ],
    commit_hash: "a762006",
    proof_screenshots: [
      {
        title: "مسح ماسح الباركود الليزري 2D",
        path: "shots/1272006_01.png",
        fallback: "Industrial Zebra/Honeywell Scanner Interfaced"
      },
      {
        title: "ميزان الطبالي الصناعي بلوتوث",
        path: "shots/1272006_02.png",
        fallback: "Bluetooth Industrial Pallet Scale Polled"
      }
    ],
    detailed_desc: "نظام إدارة مستودعات ذكي WMS مصمم لفرق العمل الميداني على أجهزة Zebra وHoneywell الوعرة بنظام أندرويد، يتكامل مع الموازين الصناعية لمطابقة الأوزان وطابعات ملصقات الشحن الحرارية Zebra ZPL.",
    domain_data: {
      current_scanned_barcode: "PAL-901827-RYD",
      current_pallet_weight_kg: 380.5,
      scale_connected: true,
      scale_model: "Mettler Toledo Industrial BLE",
      printer_status: "Zebra ZD620 جاهزة (100% ورق)",
      shelf_location: "Zone B / Rack 12 / Bin 04"
    }
  }
];

