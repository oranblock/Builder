export type LayoutType =
  | 'services'
  | 'navigation'
  | 'pos_cashier'
  | 'fitness'
  | 'food'
  | 'coworking'
  | 'telehealth'
  | 'agritech';

export interface UniversalAppSpec {
  project_id: string;
  app_name: string;
  tagline: string;
  preset: 'restaurant' | 'ecommerce' | 'standard' | 'services' | 'food';
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
  }
];
