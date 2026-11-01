export interface UniversalAppSpec {
  project_id: string;
  app_name: string;
  tagline: string;
  preset: 'restaurant' | 'ecommerce' | 'standard' | 'services' | 'food';
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
}

export const realFactoryProjects: UniversalAppSpec[] = [
  {
    project_id: "1265226",
    app_name: "تطبيق تسليح — خدمات الصيانة المنزلية",
    tagline: "فنيون معتمدون، تسعير فوري، وتتبع لحظي لموقع الفني على الخريطة",
    preset: "services",
    theme: {
      primary_color: "#0f766e",
      accent_color: "#f59e0b"
    },
    banner: {
      title: "صيانة طارئة خلال 30 دقيقة",
      subtitle: "سباكة، كهرباء، وتكييف بضمان معتمد وفاتورة رقمية"
    },
    categories: ["الكل", "سباكة", "كهرباء", "تكييف", "أجهزة منزلية"],
    items: [
      {
        title: "كشف وإصلاح تسريبات المياه",
        desc: "فحص بالنيتروجين وتحديد مسار التسريب بدقة عالية",
        price: "120 ر.س",
        icon: "wrench"
      },
      {
        title: "صيانة وتعبئة فريون مكيف سبليت",
        desc: "تنظيف الفلاتر، فحص الضاغط وتعبئة فريون R410A أمريكي",
        price: "180 ر.س",
        icon: "snowflake"
      },
      {
        title: "تأسيس وصيانة لوحات الكهرباء",
        desc: "إصلاح القواطع وتوازن الأحمال مع شهادة فحص سلامة",
        price: "150 ر.س",
        icon: "zap"
      },
      {
        title: "صيانة الغسالات الأوتوماتيكية",
        desc: "استبدال السيور والمساعدات وصيانة محرك الغسيل",
        price: "140 ر.س",
        icon: "cpu"
      }
    ],
    nav_tabs: [
      { id: "services", label: "الخدمات", icon: "wrench" },
      { id: "active_orders", label: "طلباتي", icon: "activity" },
      { id: "wallet", label: "المحفظة", icon: "credit-card" }
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
    detailed_desc: "منصة رقمية متكاملة لطلب وحجز خدمات الصيانة المنزلية الطارئة والروتينية (كهرباء، سباكة، تكييف، أجهزة منزلية). يتميز التطبيق بنظام توجيه ذكي للفني الأقرب عبر GPS، اعتماد أوامر العمل والقطع بفاتورة رقمية دقيقة، وتأكيد الدفع عبر رمز OTP لضمان حقوق العميل والفني."
  },
  {
    project_id: "1266029",
    app_name: "دليل الصحراء — الملاحة والمسارات البرية",
    tagline: "ملاحة دقيقة عبر الأقمار الصناعية وحساب المسارات الحية بدون الحاجة لإنترنت",
    preset: "standard",
    theme: {
      primary_color: "#b45309",
      accent_color: "#0ea5e9"
    },
    banner: {
      title: "خرائط طوبوغرافية بدون اتصال",
      subtitle: "استيراد وتصدير مسارات GPX مع بوصلة جيروسكوبية حية"
    },
    categories: ["الكل", "مسارات برية", "نقاط مياه", "مخيمات", "إغاثة طارئة"],
    items: [
      {
        title: "مسار رمال الثمامة البري",
        desc: "مسار طولي 45 كم مع نقاط إحداثيات الكثبان والمخيمات",
        price: "مجاني",
        icon: "compass"
      },
      {
        title: "نقطة إغاثة ومركز استراحة الدهناء",
        desc: "إحداثيات مؤكدة لمهبط الطوارئ ونقطة تموين ومياه صالحة",
        price: "مجاني",
        icon: "map-pin"
      },
      {
        title: "حزمة خرائط الدهناء والنفود الكبرى",
        desc: "خرائط طبوغرافية تفصيلية تعمل دون اتصال 100%",
        price: "49 ر.س",
        icon: "layers"
      }
    ],
    nav_tabs: [
      { id: "map", label: "الخريطة", icon: "compass" },
      { id: "tracks", label: "المسارات", icon: "git-branch" },
      { id: "sos", label: "طوارئ SOS", icon: "radio" }
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
    detailed_desc: "تطبيق ملاحة وتوجيه بري متخصص لمرتادي الصحراء وهواة الرحلات البرية والتخييم في المملكة. يعمل بكفاءة 100% دون اتصال بشبكة الإنترنت مع دعم تصدير واستيراد مسارات GPX، بوصلة جيروسكوبية مدمجة، وحساب دقيق لنقاط الاهتمام ومسارات الطوارئ (SOS)."
  },
  {
    project_id: "1266318",
    app_name: "دكان كاشير — الفوترة الإلكترونية (ZATCA)",
    tagline: "نظام كاشير مالي وإدارة مخزون متوافق مع متطلبات المرحلة الثانية لهيئة الزكاة",
    preset: "ecommerce",
    theme: {
      primary_color: "#1d4ed8",
      accent_color: "#16a34a"
    },
    banner: {
      title: "فاتورة ضريبية مبسطة بـ QR فوري",
      subtitle: "متوافق 100% مع معايير هيئة الزكاة والضريبة والجمارك المرحلة 2"
    },
    categories: ["الكل", "مشروبات", "مخبوزات", "بقالة", "منظفات"],
    items: [
      {
        title: "قهوة عربية بالهيل 250 جم",
        desc: "بن هرري درجة أولى مطحون طازج مع الهيل والزعفران",
        price: "32.00 ر.س",
        icon: "coffee"
      },
      {
        title: "تمر خلاص الأحساء فاخر 1 كجم",
        desc: "حبات منتقاة معبأة ومغلفة آلياً ومفرغة من الهواء",
        price: "25.00 ر.س",
        icon: "box"
      },
      {
        title: "مياه شرب نبع القصيم كرتون 40 عبوة",
        desc: "مياه نقية منخفضة الصوديوم 330 مل",
        price: "18.50 ر.س",
        icon: "droplet"
      }
    ],
    nav_tabs: [
      { id: "cashier", label: "الكاشير", icon: "calculator" },
      { id: "inventory", label: "المخزون", icon: "box" },
      { id: "zatca_invoices", label: "الفواتير", icon: "file-text" }
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
    detailed_desc: "نظام نقاط بيع سحابي خفيف وسريع للمحلات التجارية والمتاجر المتنقلة، يتضمن مسح الباركود بالكاميرا، طباعة الفواتير عبر طابعات البلوتوث ESC/POS، وإنشاء رمز الاستجابة السريعة المشفر بنظام TLV المتوافق مع متطلبات هيئة الزكاة والضريبة والجمارك بالمملكة."
  },
  {
    project_id: "1270416",
    app_name: "تطبيق لياقة — التدريب الرياضي والمستشعرات",
    tagline: "برامج تدريب مخصصة، حساب السعرات الحرارية، وربط أجهزة قياس الوزن الذكية",
    preset: "standard",
    theme: {
      primary_color: "#dc2626",
      accent_color: "#f97316"
    },
    banner: {
      title: "تكامل مباشر مع موازين BLE الذكية",
      subtitle: "مزامنة فورية للوزن ونسبة الدهون والكتلة العضلية تلقائياً"
    },
    categories: ["الكل", "تمارين القوة", "كارديو ومرونة", "خطة التغذية", "الوزن والقياسات"],
    items: [
      {
        title: "جلسة تمرين الصدر والكتف المتفجر",
        desc: "45 دقيقة مع شرح زوايا الحركة والحساب التلقائي لفترات الراحة",
        price: "برنامج نشط",
        icon: "activity"
      },
      {
        title: "قراءة الوزن الذكية اليومية",
        desc: "تمت المزامنة من ميزان Bluetooth GATT (74.25 كجم)",
        price: "متزامن",
        icon: "scale"
      },
      {
        title: "حاسبة السعرات والماكروز اليومية",
        desc: "الهدف اليومي: 2,400 سعرة حرارية (160 جم بروتين)",
        price: "مكتمل 80%",
        icon: "zap"
      }
    ],
    nav_tabs: [
      { id: "workouts", label: "التمارين", icon: "activity" },
      { id: "nutrition", label: "التغذية", icon: "pie-chart" },
      { id: "ble_scale", label: "الميزان الذكي", icon: "scale" }
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
    detailed_desc: "منصة تدريب لياقة بدنية وتغذية تقدم جداول تمارين حركية مصورة بالفيديو، تتبع الوزن والسعرات اليومية، وتنبيهات شرب الماء والنشاط البدني مع دعم كامل للاتصال بساعات اللياقة وأجهزة الاستشعار عبر Health Connect."
  },
  {
    project_id: "sample_demo",
    app_name: "شاورما وبورجر السعادة",
    tagline: "أشهى الوجبات السريعة بتوصيل فوري في الرياض",
    preset: "food",
    theme: {
      primary_color: "#ef4444",
      accent_color: "#f59e0b"
    },
    banner: {
      title: "عرض الغداء الحارق",
      subtitle: "وجبة بورجر دبل + بطاطس + مشروب بـ 29 ر.س فقط"
    },
    categories: ["الكل", "شاورما عربي", "برجر كلاسيك", "وجبات أطفال", "مقبلات وصوصات"],
    items: [
      {
        title: "شاورما صاروخ بالثوم",
        desc: "دجاج متبل على الفحم مع صوص الثوم الخاص",
        price: "18 ر.س",
        icon: "coffee"
      },
      {
        title: "برجر لحم بلاك أنجوس",
        desc: "قطعة لحم طازجة 150 جرام مع جبنة تشيدر ذائبة",
        price: "28 ر.س",
        icon: "box"
      },
      {
        title: "بطاطس كريسبي بالجبن",
        desc: "أصابع بطاطس مقرمشة مع صوص هالبينو وجبنة",
        price: "14 ر.س",
        icon: "zap"
      },
      {
        title: "عصير رمان طبيعي مثلج",
        desc: "عصير طازج 100% بدون سكر مضاف",
        price: "12 ر.س",
        icon: "droplet"
      }
    ],
    nav_tabs: [
      { id: "home", label: "القائمة", icon: "coffee" },
      { id: "shopping_bag", label: "سلتي", icon: "shopping-bag" },
      { id: "orders", label: "طلباتي", icon: "clock" }
    ],
    commit_hash: "c89b21d",
    proof_screenshots: [
      {
        title: "إقلاع التطبيق على Pixel 8",
        path: "shots/01_app_launched.png",
        fallback: "Android 14 ARM64 Boots Clean"
      },
      {
        title: "اختبار إضافة السلة والمحاكي",
        path: "shots/02_flow_diagnose.png",
        fallback: "Compose Recomposition OK"
      }
    ],
    detailed_desc: "تطبيق تجريبي سريع لمطعم وجبات سريعة، يوضح قدرة محرك المعاينة الموحد على قراءة ملف JSON بحجم 2KB وتحويله فورياً لواجهة هاتف تفاعلية مع سلة شراء وحساب الفاتورة."
  }
];
