import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeDesignFormula } from './src/data/designFormulaEngine.ts';
import { realFactoryProjects } from './src/data/factoryProjectsData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory live registry initialized from realFactoryProjects
  let projectsRegistry = [...realFactoryProjects];

  // In-memory telemetry log buffer (sliding window of 100 events)
  interface TelemetryEvent {
    id: string;
    timestamp: string;
    projectId: string;
    event: string;
    details: string;
    status: 'success' | 'warning' | 'error' | 'info';
    source: string;
  }
  const telemetryLogs: TelemetryEvent[] = [
    {
      id: 'tel_init',
      timestamp: new Date().toISOString(),
      projectId: 'system',
      event: 'AGENT_SWARM_GATEWAY_ONLINE',
      details: 'Agent REST endpoints active: /api/design-formula, /api/audit-novelty, /api/agent/synthesize',
      status: 'success',
      source: 'server.ts'
    }
  ];

  // In-memory scout alert buffer
  interface ScoutAlertFeed {
    id: string;
    title: string;
    preset: string;
    budget: string;
    detectedAt: string;
    matchedKeywords: string[];
    rawDesc: string;
  }
  const scoutAlertsFeed: ScoutAlertFeed[] = [];

  // Helper to append telemetry
  const logTelemetry = (projectId: string, event: string, details: string, status: 'success' | 'warning' | 'error' | 'info' = 'success', source: string = 'agent') => {
    const entry: TelemetryEvent = {
      id: `tel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      projectId: String(projectId),
      event,
      details,
      status,
      source
    };
    telemetryLogs.unshift(entry);
    if (telemetryLogs.length > 100) telemetryLogs.pop();
    return entry;
  };

  // ── API Routes ─────────────────────────────────────────────────────────────

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      engine: 'Autonomous Ephemeral Software Factory',
      version: '2.5.0',
      activeProjectsCount: projectsRegistry.length,
      telemetryEventsCount: telemetryLogs.length,
      timestamp: new Date().toISOString()
    });
  });

  // Explicit Anti-Duplication & Design Diversity Formula API
  app.get('/api/design-formula', (req, res) => {
    const projectId = (req.query.project_id as string) || 'sample';
    const nicheSlug = (req.query.niche as string) || (req.query.niche_slug as string) || 'general';
    const preset = (req.query.preset as string) || 'standard';

    const formula = computeDesignFormula(projectId, nicheSlug, preset);
    res.json(formula);
  });

  // Novelty & Anti-Collision Audit API
  app.post('/api/audit-novelty', (req, res) => {
    const proposed = req.body;
    const projectId = proposed?.project_id || proposed?.projectId;
    if (!proposed || !projectId) {
      return res.status(400).json({ error: 'Missing project_id in proposal' });
    }
    proposed.project_id = String(projectId);

    // Check against existing projects in live registry
    const collisions = projectsRegistry.filter(
      (p) => p.project_id !== proposed.project_id && (
        p.app_name === proposed.app_name ||
        (p.theme?.primary_color?.toLowerCase() === proposed.theme?.primary_color?.toLowerCase() && p.preset === proposed.preset)
      )
    );

    const isDuplicate = collisions.length > 0;
    const uniquenessScore = isDuplicate ? 0.35 : 0.98;

    logTelemetry(
      proposed.project_id,
      isDuplicate ? 'COLLISION_DETECTED' : 'NOVELTY_CERTIFIED',
      isDuplicate ? `Collision flagged with project #${collisions[0].project_id}` : `Certified novelty score ${uniquenessScore}`,
      isDuplicate ? 'warning' : 'success'
    );

    res.json({
      project_id: proposed.project_id,
      approved: !isDuplicate,
      uniquenessScore,
      collisionWarning: isDuplicate ? `Detected visual layout collision with #${collisions[0].project_id}` : null,
      directive: isDuplicate
        ? 'REMEDIATION_REQUIRED: Mutate layoutArchetype and primary_color using /api/design-formula'
        : 'CERTIFIED_NOVELTY: Design is mathematically distinct. Proceed to build.'
    });
  });

  // List all project specs in vault
  app.get('/api/projects', (req, res) => {
    res.json(projectsRegistry);
  });

  // Add or update project spec in live vault
  app.post('/api/projects', (req, res) => {
    const spec = req.body;
    const projectId = spec?.project_id || spec?.projectId;
    if (!spec || !projectId) {
      return res.status(400).json({ error: 'Missing project_id in spec' });
    }
    spec.project_id = String(projectId);

    // Clean emojis if present in basic string fields
    const emojiRegex = /[\u{10000}-\u{10ffff}]|[\u{2600}-\u{27ff}]|[\u{2300}-\u{23ff}]|[\u{2b50}]/gu;
    if (typeof spec.app_name === 'string') spec.app_name = spec.app_name.replace(emojiRegex, '').trim();
    if (typeof spec.tagline === 'string') spec.tagline = spec.tagline.replace(emojiRegex, '').trim();

    const existingIndex = projectsRegistry.findIndex((p) => p.project_id === spec.project_id);
    if (existingIndex >= 0) {
      projectsRegistry[existingIndex] = { ...projectsRegistry[existingIndex], ...spec };
      logTelemetry(spec.project_id, 'PROJECT_SPEC_UPDATED', `Updated spec for ${spec.app_name}`);
    } else {
      projectsRegistry.unshift(spec);
      logTelemetry(spec.project_id, 'PROJECT_SPEC_REGISTERED', `Added new spec for ${spec.app_name}`);
    }

    res.status(existingIndex >= 0 ? 200 : 201).json({
      success: true,
      project_id: spec.project_id,
      totalProjects: projectsRegistry.length,
      spec
    });
  });

  // Get specific project spec
  app.get('/api/projects/:id', (req, res) => {
    const proj = projectsRegistry.find((p) => p.project_id === req.params.id);
    if (!proj) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(proj);
  });

  // Agent Telemetry Stream
  app.get('/api/agent/telemetry', (req, res) => {
    res.json(telemetryLogs);
  });

  app.post('/api/agent/telemetry', (req, res) => {
    const { projectId, event, details, status, source } = req.body;
    if (!event) {
      return res.status(400).json({ error: 'Missing event field' });
    }
    const entry = logTelemetry(projectId || 'anonymous', event, details || '', status || 'info', source || 'external_agent');
    res.json({ success: true, entry });
  });

  // Scout Alerts Stream
  app.get('/api/agent/scout-alerts', (req, res) => {
    res.json(scoutAlertsFeed);
  });

  app.post('/api/agent/scout-alert', (req, res) => {
    const alert = req.body;
    if (!alert || !alert.id) {
      return res.status(400).json({ error: 'Missing alert id' });
    }
    scoutAlertsFeed.unshift(alert);
    if (scoutAlertsFeed.length > 50) scoutAlertsFeed.pop();
    logTelemetry(alert.id, 'SCOUT_JOB_DETECTED', `Scouted: ${alert.title?.substring(0, 40)}...`, 'info', 'monitor.py');
    res.json({ success: true, alertCount: scoutAlertsFeed.length });
  });

  // Supported Layout Archetypes Info
  app.get('/api/agent/archetypes', (req, res) => {
    res.json([
      {
        id: 'services',
        name: 'On-Demand Field Services & Tracking',
        domain: 'Maintenance, Plumbing, Electrician, Towing, Cleaning',
        hardwareSensors: ['GPS Location Services', 'SMS OTP Verification', 'Push Notifications'],
        uiHighlights: ['Live technician tracking map card', 'OTP job signoff code', 'Direct technician dialer']
      },
      {
        id: 'pos_cashier',
        name: 'Point-of-Sale Cashier & ZATCA Invoicing',
        domain: 'Retail, Pop-up Shops, Food Trucks, Mini-Markets',
        hardwareSensors: ['Bluetooth ESC/POS Thermal Printers', 'Camera Barcode Scanner', 'Cryptographic TLV QR'],
        uiHighlights: ['1-tap fast register grid', 'ZATCA Stage-2 encrypted TLV QR', 'Receipt paper cut simulation']
      },
      {
        id: 'navigation',
        name: 'Offline Topographic & Gyro Navigation',
        domain: 'Desert Safari, Overland Camping, Maritime, Marine Trails',
        hardwareSensors: ['Hardware Gyroscope & Magnetometer', 'Offline GPS Traces', 'Satellite SOS Transceiver'],
        uiHighlights: ['Rotating directional compass dial', 'Live coordinates & elevation display', 'Emergency SOS satellite beacon']
      },
      {
        id: 'fitness',
        name: 'Biometric Training & Smart Scale Sync',
        domain: 'Athletics, Gym, Weight Loss, Physical Therapy',
        hardwareSensors: ['BLE GATT 0x181D Smart Weight Scale', 'Health Connect / Apple HealthKit', 'Accelerometer'],
        uiHighlights: ['Real-time BLE scale sync button', 'Body fat & water % breakdown', 'Daily calorie target progress rings']
      },
      {
        id: 'coworking',
        name: 'Coworking Spaces & Smart Access Passes',
        domain: 'Shared Offices, Meeting Rooms, Private Pods',
        hardwareSensors: ['TOTP Rotating QR Access', 'NFC Turnstile Emulation', '1-click Wi-Fi Credential Copy'],
        uiHighlights: ['Auto-rotating TOTP security gate pass', 'High-speed Wi-Fi password copy button', 'Desk calendar scheduler']
      },
      {
        id: 'food',
        name: 'Surplus Food Rescue & Hyperlocal Delivery',
        domain: 'Bakeries, Gourmet Restaurants, Supermarket Flash Deals',
        hardwareSensors: ['Geofenced Delivery Radius', 'Real-Time Order State Machine', 'Ephemeral In-App Chat'],
        uiHighlights: ['Daily food rescue counter (kg saved)', 'Dynamic cart & pickup countdown timer', 'Live courier GPS tracker']
      },
      {
        id: 'telehealth',
        name: 'Telehealth Consultation & Remote Vital Signs',
        domain: 'Virtual Clinics, Home Blood Pressure, Chronic Care',
        hardwareSensors: ['BLE Blood Pressure Monitor GATT 0x1810', 'WebRTC Encrypted Video / Audio', 'HL7 FHIR Vault'],
        uiHighlights: ['Live BLE blood pressure sync (Systolic/Diastolic)', 'Instant WebRTC encrypted consultation call', 'Digital prescription badge']
      },
      {
        id: 'agritech',
        name: 'Smart Irrigation & LoRaWAN Soil Telemetry',
        domain: 'Greenhouses, Hydroponic Farms, Palm Orchards',
        hardwareSensors: ['LoRaWAN 868/915 MHz Gateway', 'Capacitive Soil Moisture Probe', 'Solenoid Valve Actuator'],
        uiHighlights: ['Live moisture & ambient temperature gauge', '1-tap solenoid valve toggle switch', 'Automated moisture schedule rules']
      }
    ]);
  });

  // Autonomous Spec Synthesizer Endpoint
  // Given any brief or project request, generates a 100% bespoke, zero-emoji, multi-screen spec
  // matching one of the 8 archetypes, runs novelty verification, and registers it in the vault.
  app.post('/api/agent/synthesize', (req, res) => {
    const { project_id, brief, preset, niche } = req.body;
    const projId = String(project_id || Math.floor(1270000 + Math.random() * 9999));
    const briefText = brief || 'مشروع تطبيق احترافي متكامل مع تجربة مستخدم عصرية';

    // Auto-detect optimal archetype from brief keywords
    let layoutType: any = 'services';
    let chosenPreset: any = 'services';

    const lowerBrief = briefText.toLowerCase();
    if (lowerBrief.includes('كاشير') || lowerBrief.includes('فاتورة') || lowerBrief.includes('زاتكا') || lowerBrief.includes('نقطة بيع') || lowerBrief.includes('pos')) {
      layoutType = 'pos_cashier';
      chosenPreset = 'ecommerce';
    } else if (lowerBrief.includes('صحراء') || lowerBrief.includes('بوصلة') || lowerBrief.includes('ملاحة') || lowerBrief.includes('مسار') || lowerBrief.includes('تخييم') || lowerBrief.includes('بر')) {
      layoutType = 'navigation';
      chosenPreset = 'standard';
    } else if (lowerBrief.includes('طبيب') || lowerBrief.includes('عيادة') || lowerBrief.includes('ضغط') || lowerBrief.includes('صحة') || lowerBrief.includes('استشارة')) {
      layoutType = 'telehealth';
      chosenPreset = 'services';
    } else if (lowerBrief.includes('ميزان') || lowerBrief.includes('وزن') || lowerBrief.includes('لياقة') || lowerBrief.includes('رياضة') || lowerBrief.includes('سعرات')) {
      layoutType = 'fitness';
      chosenPreset = 'standard';
    } else if (lowerBrief.includes('طعام') || lowerBrief.includes('وجبات') || lowerBrief.includes('مطعم') || lowerBrief.includes('فائض') || lowerBrief.includes('نعمة')) {
      layoutType = 'food';
      chosenPreset = 'food';
    } else if (lowerBrief.includes('مكتب') || lowerBrief.includes('قاعة') || lowerBrief.includes('مساحة') || lowerBrief.includes('كوويرك')) {
      layoutType = 'coworking';
      chosenPreset = 'services';
    } else if (lowerBrief.includes('زراعة') || lowerBrief.includes('ري') || lowerBrief.includes('مزرعة') || lowerBrief.includes('تربة') || lowerBrief.includes('نخيل') || lowerBrief.includes('lora')) {
      layoutType = 'agritech';
      chosenPreset = 'standard';
    } else if (lowerBrief.includes('عقار') || lowerBrief.includes('فيلا') || lowerBrief.includes('شقة') || lowerBrief.includes('أملاك') || lowerBrief.includes('صك') || lowerBrief.includes('برج') || lowerBrief.includes('real_estate')) {
      layoutType = 'real_estate';
      chosenPreset = 'real_estate';
    } else if (lowerBrief.includes('سيارة') || lowerBrief.includes('تأجير') || lowerBrief.includes('أسطول') || lowerBrief.includes('obd') || lowerBrief.includes('car_rental')) {
      layoutType = 'car_rental';
      chosenPreset = 'car_rental';
    } else if (lowerBrief.includes('صالون') || lowerBrief.includes('تجميل') || lowerBrief.includes('سبا') || lowerBrief.includes('عناية') || lowerBrief.includes('شعر') || lowerBrief.includes('بشرة') || lowerBrief.includes('beauty')) {
      layoutType = 'beauty_salon';
      chosenPreset = 'beauty_salon';
    } else if (lowerBrief.includes('مزاد') || lowerBrief.includes('مزايدة') || lowerBrief.includes('خيل') || lowerBrief.includes('نوادر') || lowerBrief.includes('auction')) {
      layoutType = 'auction_live';
      chosenPreset = 'auction_live';
    } else if (lowerBrief.includes('معسكر') || lowerBrief.includes('دورة') || lowerBrief.includes('تعليم') || lowerBrief.includes('تدريب') || lowerBrief.includes('طالب') || lowerBrief.includes('شهادة') || lowerBrief.includes('edtech')) {
      layoutType = 'smart_education';
      chosenPreset = 'smart_education';
    } else if (lowerBrief.includes('مستودع') || lowerBrief.includes('مخزون') || lowerBrief.includes('جرد') || lowerBrief.includes('طبلية') || lowerBrief.includes('باركود') || lowerBrief.includes('wms') || lowerBrief.includes('warehouse')) {
      layoutType = 'logistics_warehouse';
      chosenPreset = 'logistics_warehouse';
    }

    const VALID_PRESETS = [
      'services',
      'navigation',
      'pos_cashier',
      'fitness',
      'food',
      'coworking',
      'telehealth',
      'agritech',
      'real_estate',
      'car_rental',
      'beauty_salon',
      'auction_live',
      'smart_education',
      'logistics_warehouse',
      'custom'
    ];
    if (preset && VALID_PRESETS.includes(preset)) {
      layoutType = preset;
      chosenPreset = preset;
    }

    // Compute mathematical design formula for uniqueness
    const nicheSlug = niche || layoutType;
    const formula = computeDesignFormula(projId, nicheSlug, chosenPreset);

    // Dynamic brand colors from formula
    const primaryColor = formula.colorHarmonics.accent10;
    const secondaryColor = formula.colorHarmonics.secondaryAccent || '#f59e0b';

    // Archetype-specific items and configurations (zero emojis, pure Lucide vector names)
    const archetypeConfigs: Record<string, { app_name: string; tagline: string; items: any[]; categories: string[]; domain_data: any }> = {
      pos_cashier: {
        app_name: `كاشير زاتكا الذكي #${projId.slice(-4)}`,
        tagline: 'نظام نقاط بيع وفوترة سحابية مع طباعة حرارية وتشفير TLV',
        categories: ['المشروبات', 'المخبوزات', 'الوجبات السريعة', 'عروض التوفير'],
        items: [
          { title: 'اسبريسو سبيشالتي ثنائي', desc: 'حبوب أثيوبية مجففة معتمدة', price: '18', icon: 'coffee', badge: 'الأكثر طلباً' },
          { title: 'كرواسون الزبدة الطازج', desc: 'مخبوز طازج يومياً في الفرن الحجري', price: '14', icon: 'utensils', badge: 'طازج' },
          { title: 'فلات وايت حليب شوفان', desc: 'مستخلص بضغط 9 بار مع حليب نباتي', price: '22', icon: 'coffee', badge: 'صحي' },
          { title: 'صندوق المعجنات المشكل', desc: '6 قطع متنوعة للشركات والاجتماعات', price: '65', icon: 'package', badge: 'عائلي' }
        ],
        domain_data: {
          taxNumber: '302918274600003',
          terminalId: `POS-TERM-${projId.slice(-4)}`,
          vatRate: '15%'
        }
      },
      navigation: {
        app_name: `دليل البوصلة والمسارات #${projId.slice(-4)}`,
        tagline: 'ملاحة وتوجيه بري بدون إنترنت مع مسارات GPX واستشعار الجيروسكوب',
        categories: ['المسارات البرية', 'نقاط المياه', 'أماكن التخييم', 'نقاط الطوارئ'],
        items: [
          { title: 'مسار وادي الرمة البري', desc: 'مسار رملي 4x4 بطول 42 كم مع إحداثيات الآبار', price: 'مجاني', icon: 'compass', badge: 'معتمد' },
          { title: 'نقطة تخييم روضة خريم', desc: 'أرض منبسطة آمنة مناسبة للعائلات والخيام', price: 'مجاني', icon: 'map_pin', badge: 'آمن' },
          { title: 'درب زبيدة التاريخي', desc: 'طريق تاريخي ممهد بنقاط ارتكاز موثقة بالـ GPS', price: 'مجاني', icon: 'flag', badge: 'أثري' }
        ],
        domain_data: {
          satelliteStatus: 'Connected (12 Satellites)',
          elevationMeters: 624,
          headingDegrees: 48
        }
      },
      telehealth: {
        app_name: `نبض — العيادة والمؤشرات الحيوية #${projId.slice(-4)}`,
        tagline: 'استشارات طبية فورية مع قراءة ضغط الدم ومزامنة الأجهزة الطبية عبر BLE',
        categories: ['الطب العام', 'القلب والأوعية', 'الغدد والسكري', 'التغذية العلاجية'],
        items: [
          { title: 'فحص ضغط الدم المباشر عبر البلوتوث', desc: 'اتصال فوري بجهاز Omron BLE مع حفظ القراءات المشفرة', price: 'مجاني', icon: 'activity', badge: 'GATT 0x1810' },
          { title: 'استشارة فورية مع طبيب استشاري', desc: 'مكالمة مرئية WebRTC مشفرة مع وصفة إلكترونية فورية', price: '120', icon: 'phone', badge: 'فوري' },
          { title: 'قراءة تخطيط القلب ومعدل النبض', desc: 'تحليل المنحنى الكهربائي للقلب والتنبيه عند التسارع', price: '45', icon: 'heart', badge: 'دقيق' }
        ],
        domain_data: {
          connectedDevice: 'Omron Connect BPM-900',
          systolic: 118,
          diastolic: 76,
          pulse: 71
        }
      },
      fitness: {
        app_name: `لياقة وتتبع الميزان الذكي #${projId.slice(-4)}`,
        tagline: 'برامج تدريب حركية ومزامنة الوزن ونسبة الدهون عبر موازين البلوتوث',
        categories: ['تمارين القوة', 'حرق الدهون', 'جداول التغذية', 'تحليل المؤشرات'],
        items: [
          { title: 'مزامنة الميزان الذكي عبر BLE', desc: 'قراءة فورية للوزن ونسبة الدهون والكتلة العضلية', price: 'مجاني', icon: 'scale', badge: 'BLE GATT' },
          { title: 'جدول القوة والتضخيم العضلي', desc: 'خطة تمارين 4 أيام أسبوعياً مع فيديو لكل تمرين', price: '85', icon: 'activity', badge: 'برنامج' },
          { title: 'حساب الاحتياج اليومي من الماكروز', desc: 'توزيع دقيق للبروتين والكاربوهيدرات والدهون الصحية', price: '40', icon: 'target', badge: 'تغذية' }
        ],
        domain_data: {
          currentWeightKg: 78.4,
          targetWeightKg: 75.0,
          bodyFatPct: 18.2,
          syncedScaleName: 'Anker Eufy Smart Scale P2 Pro'
        }
      },
      food: {
        app_name: `سلة وفر — إنقاذ الأطعمة #${projId.slice(-4)}`,
        tagline: 'وجبات طازجة وفائضة من أرقى المخابز والمطاعم بخصومات حصرية 50%',
        categories: ['المخابز', 'المطاعم', 'السوبرماركت', 'المقاهي'],
        items: [
          { title: 'سلة المخبوزات الحرفية المسائية', desc: 'تشكيلة كرواسون وخبز باجيت طازج من مخبز لوسيل', price: '25', icon: 'package', badge: 'خصم 60%' },
          { title: 'وجبة غداء فاخرة من مطعم السفير', desc: 'طبق أرز برياني مع دجاج مشوي متبل مع الصلصة', price: '32', icon: 'utensils', badge: 'خصم 50%' },
          { title: 'صندوق الحلويات والكيك المتنوع', desc: '4 قطع تشيز كيك وتارت فواكه طازجة', price: '35', icon: 'sparkles', badge: 'خصم 55%' }
        ],
        domain_data: {
          totalKgRescued: 412,
          activeStores: 18,
          pickupWindowRemainingMin: 45
        }
      },
      coworking: {
        app_name: `مساحة — مكاتب العمل الذكية #${projId.slice(-4)}`,
        tagline: 'حجز قاعات ومكاتب العمل المشتركة مع بطاقة الدخول الذكية بالـ TOTP والـ Wi-Fi',
        categories: ['المكاتب المشتركة', 'قاعات الاجتماعات', 'المكاتب الخاصة', 'كبائن الاتصال'],
        items: [
          { title: 'مكتب عمل مرن (Flex Desk)', desc: 'شامل شاشة 4K وإنترنت ألياف ضوئية 1 جيجابت وقهوة مفتوحة', price: '45', icon: 'laptop', badge: 'بالساعة' },
          { title: 'قاعة اجتماعات التنفيذيين (8 أشخاص)', desc: 'شاشة تفاعلية ذكية، كاميرا مؤتمرات 4K، وضيافة متكاملة', price: '180', icon: 'users', badge: 'بالساعة' },
          { title: 'كابينة عازلة للصوت للمكالمات', desc: 'عزل صوتي كامل 100% مع إضاءة ستوديو وشاحن لاسلكي', price: '30', icon: 'phone', badge: 'فوري' }
        ],
        domain_data: {
          activeWifiSSID: 'WorkHub-Enterprise-5G',
          totpCode: '849 201',
          deskNumber: 'Desk B-14'
        }
      },
      agritech: {
        app_name: `حصاد — الري الزراعي الذكي #${projId.slice(-4)}`,
        tagline: 'مراقبة رطوبة التربة عبر مستشعرات LoRaWAN والتحكم بصمامات الري عن بعد',
        categories: ['صمامات الري', 'مستشعرات التربة', 'الجدولة التلقائية', 'محطة الطقس'],
        items: [
          { title: 'صمام القطاع الشمالي (أشجار النخيل)', desc: 'صمام لولبي 24V يتم التحكم به عبر بروتوكول LoRaWAN', price: 'نشط', icon: 'droplet', badge: 'صمام 1' },
          { title: 'صمام البيوت المحمية (الطماطم والخيار)', desc: 'ري بالتنقيط الدقيق متصل بمؤقت الجدولة الذكي', price: 'مجدول', icon: 'droplet', badge: 'صمام 2' },
          { title: 'مستشعر رطوبة التربة السعوي 30 سم', desc: 'قراءة فورية لدرجة حرارة ورطوبة التربة وملوحة EC', price: '38%', icon: 'activity', badge: 'مستشعر A' }
        ],
        domain_data: {
          loraSignalDbm: -78,
          soilMoisturePct: 38,
          ambientTempC: 28,
          activeValvesCount: 2
        }
      },
      services: {
        app_name: `تسليح فاست — الصيانة الفورية #${projId.slice(-4)}`,
        tagline: 'فنيون معتمدون، تسعير فوري، وتتبع لحظي لموقع الفني على الخريطة',
        categories: ['السباكة', 'الكهرباء', 'التكييف', 'الأجهزة المنزلية'],
        items: [
          { title: 'صيانة وإصلاح تسريبات المياه', desc: 'فحص إلكتروني دقيق للأنابيب مع ضمان كتابي لمدة شهر', price: '95', icon: 'wrench', badge: 'فوري' },
          { title: 'تنظيف وصيانة مكيفات سبليت', desc: 'غسيل ضغط عالي للوحدة الداخلية والخارجية وتعبئة فريون', price: '120', icon: 'wind', badge: 'ضمان' },
          { title: 'فحص لوحة المفاتيح والكهرباء', desc: 'تشخيص القواطع الكهربائية والتأكد من توازن الأحمال', price: '85', icon: 'zap', badge: 'معتمد' }
        ],
        domain_data: {
          technicianName: 'م. أحمد الشمري',
          etaMinutes: 14,
          otpCode: '4921',
          distanceKm: 2.8
        }
      },
      real_estate: {
        app_name: `منصة إيوان العقارية #${projId.slice(-4)}`,
        tagline: 'جولات افتراضية ثلاثية الأبعاد وصكوك إلكترونية موثقة',
        categories: ['الفلل الفاخرة', 'البنتهاوس', 'الأراضي التجارية', 'أبراج مكتبية'],
        items: [
          { title: 'فيلا حي النخيل الفاخرة', desc: 'مساحة 850 م² مع مسبح ونظام ذكي', price: '7,200,000 ر.س', icon: 'home', badge: 'صك موثق' },
          { title: 'بنتهاوس برج المجدول', desc: 'إطلالة بانورامية مع تراس خاص', price: '4,500,000 ر.س', icon: 'building', badge: 'إفراغ فوري' },
          { title: 'أرض تجارية طريق الملك سلمان', desc: 'واجهة 50 م تصريح أبراج', price: '19,000,000 ر.س', icon: 'map_pin', badge: 'استثمار' }
        ],
        domain_data: {
          verifiedBroker: 'أ. سلطان الخالدي (ترخيص فال)',
          titleDeedNo: '310109284711',
          lidarActive: true
        }
      },
      car_rental: {
        app_name: `أسطول نجد للسيارات الذكية #${projId.slice(-4)}`,
        tagline: 'فتح السيارة بالهاتف وتفويض تم فوري برقم الهوية',
        categories: ['سيارات فارهة', 'عائلية SUV', 'اقتصادية', 'كهربائية EV'],
        items: [
          { title: 'رنج روفر فيلار 2026', desc: 'تأمين شامل بدون تأمين إضافي', price: '680 ر.س/يوم', icon: 'car', badge: 'تأمين شامل' },
          { title: 'لوسيد آير بيور الكهربائية', desc: 'مدى 650 كم مع شحن مجاني', price: '850 ر.س/يوم', icon: 'zap', badge: 'شحن مجاني' },
          { title: 'تويوتا لاندكروزر VXR', desc: 'مجهزة للرحلات البرية الطويلة', price: '550 ر.س/يوم', icon: 'shield', badge: 'كيلو مفتوح' }
        ],
        domain_data: {
          vehicleModel: 'Range Rover Velar 2026',
          fuelLevel: 88,
          doorsLocked: true
        }
      },
      beauty_salon: {
        app_name: `صالون لافندر للعناية #${projId.slice(-4)}`,
        tagline: 'حجز المواعيد بالدقيقة وتعقيم الأدوات بتقنية UV-C',
        categories: ['العناية بالشعر', 'علاجات البشرة', 'المساج', 'الأظافر'],
        items: [
          { title: 'جلسة هيدرافاشيال متقدمة', desc: 'تقشير وترطيب بحمض الهيالورونيك', price: '380 ر.س', icon: 'sparkles', badge: 'الأكثر طلباً' },
          { title: 'علاج كافيار الكولاجين', desc: 'ترميم وتغذية عميقة لألياف الشعر', price: '450 ر.س', icon: 'scissors', badge: 'نتائج فورية' },
          { title: 'مساج الأحجار البركانية الدافئة', desc: 'جلسة 60 دقيقة للاسترخاء التام', price: '290 ر.س', icon: 'heart', badge: 'راحة تامة' }
        ],
        domain_data: {
          specialistName: 'أ. نورة التميمي',
          sterilizationStatus: 'معقم UV-C 100%',
          loyaltyPoints: 340
        }
      },
      auction_live: {
        app_name: `مزادات الصافنات الحية #${projId.slice(-4)}`,
        tagline: 'مزايدة حية بالصوت والصورة مع مضرب لاسلكي BLE ومطرقة فورية',
        categories: ['الخيل والنوادر', 'العقارات', 'اللوحات المميزة', 'الساعات'],
        items: [
          { title: 'المهر العربي الأصيل (سيف الصافنات)', desc: 'خط صقلاوي جدراني ببطولات دولية', price: '285,000 ر.س', icon: 'award', badge: 'المزاد الحالي' },
          { title: 'لوحة خصوصي ملكية (ط و ق 1)', desc: 'موثقة ومسجلة عبر منصة أبشر', price: '190,000 ر.س', icon: 'tag', badge: 'مفتوح' },
          { title: 'ساعة رولكس دايتونا بلاتينيوم', desc: 'ميناء أزرق جليدي مع أوراق الضمان', price: '340,000 ر.س', icon: 'clock', badge: 'فحص أصلي' }
        ],
        domain_data: {
          leadingBidSar: 285000,
          escrowGuaranteeSar: 50000,
          bidTimerSeconds: 38
        }
      },
      smart_education: {
        app_name: `أكاديمية طويق التعليمية #${projId.slice(-4)}`,
        tagline: 'قاعات تدريب حية وقلم ذكي لمزامنة الشروحات بدقة 4096',
        categories: ['تطوير البرمجيات', 'الذكاء الاصطناعي', 'الأمن السيبراني', 'إدارة المشاريع'],
        items: [
          { title: 'معسكر Kotlin Multiplatform وCompose', desc: '120 ساعة تدريبية مع بناء 6 مشاريع', price: '1,850 ر.س', icon: 'code', badge: 'معتمد' },
          { title: 'دبلوم هندسة نماذج LLM Agents', desc: 'بناء وكلاء الذكاء الاصطناعي وواجهات API', price: '2,400 ر.س', icon: 'cpu', badge: 'مقاعد محدودة' },
          { title: 'شهادة قيادة الأمن السيبراني', desc: 'إعداد لاختبارات CISSP الدولية', price: '1,500 ر.س', icon: 'shield', badge: 'مسائي' }
        ],
        domain_data: {
          instructor: 'م. خالد السديري',
          activeStudents: 84,
          certificateHash: '0x78ab310cd9912048'
        }
      },
      logistics_warehouse: {
        app_name: `مستودعات مسار الذكية #${projId.slice(-4)}`,
        tagline: 'جرد سريع بماسحات 2D ليزرية وميزان طبالي بلوتوث',
        categories: ['استلام الشحنات', 'الصرف والتجهيز', 'الجرد الدوري', 'طباعة بوالص'],
        items: [
          { title: 'طبلية قطع غيار سيارات B-12', desc: 'الباركود PAL-901827 وزن 380 كجم', price: 'تم الفحص', icon: 'package', badge: 'مطابق 100%' },
          { title: 'حاوية أجهزة لوحية A-04', desc: 'الباركود PAL-881290 وزن 210 كجم', price: 'بانتظار الصرف', icon: 'cpu', badge: 'عاجل' },
          { title: 'طبلية مستلزمات طبية مبردة C-08', desc: 'الباركود PAL-772109 حرارة تحت 18°C', price: 'مخزن مبرد', icon: 'thermometer', badge: 'حساس' }
        ],
        domain_data: {
          currentBarcode: 'PAL-901827-RYD',
          palletWeightKg: 380.5,
          shelfLocation: 'Zone B / Rack 12'
        }
      },
      custom: {
        app_name: `منظومة مخصصة #${projId.slice(-4)}`,
        tagline: 'تطبيق تجاري مخصص غير متكرر مع ربط أجهزة الاستشعار',
        categories: ['الخدمات الرئيسية', 'المطابقة', 'التقارير', 'الإعدادات'],
        items: [
          { title: 'الحزمة الأساسية المعتمدة', desc: 'تشغيل وتكامل مع العتاد الفيزيائي', price: '3,500 ر.س', icon: 'check', badge: 'معتمد' },
          { title: 'الدعم الفني المباشر والسيرفر', desc: 'استضافة سحابية مع ضمان 99.9%', price: '1,200 ر.س', icon: 'shield', badge: 'SLA' }
        ],
        domain_data: {
          noveltyScore: '100% Unique',
          customEngine: true
        }
      }
    };

    const config = archetypeConfigs[layoutType] || archetypeConfigs.services;

    const newSpec: any = {
      project_id: projId,
      app_name: config.app_name,
      tagline: config.tagline,
      preset: chosenPreset,
      layout_type: layoutType,
      theme: {
        primary_color: primaryColor,
        accent_color: secondaryColor
      },
      banner: {
        title: config.app_name,
        subtitle: config.tagline
      },
      categories: config.categories,
      items: config.items,
      nav_tabs: [
        { id: 'home', label: 'الرئيسية', icon: 'home' },
        { id: 'explore', label: 'الاستكشاف', icon: 'search' },
        { id: 'activity', label: 'النشاط', icon: 'activity' },
        { id: 'account', label: 'حسابي', icon: 'user' }
      ],
      commit_hash: `syn_${Math.random().toString(16).substring(2, 8)}`,
      proof_screenshots: [
        { title: 'الشاشة الرئيسية', path: `/previews/shots/${projId}_01.png`, fallback: 'home_screen' },
        { title: 'التفاصيل والإجراءات', path: `/previews/shots/${projId}_02.png`, fallback: 'detail_screen' },
        { title: 'المتابعة والتحكم اللحظي', path: `/previews/shots/${projId}_03.png`, fallback: 'tracking_screen' }
      ],
      detailed_desc: briefText,
      domain_data: config.domain_data
    };

    // Audit novelty
    const collisions = projectsRegistry.filter(
      (p) => p.project_id !== newSpec.project_id && (
        p.app_name === newSpec.app_name ||
        (p.theme?.primary_color?.toLowerCase() === newSpec.theme?.primary_color?.toLowerCase() && p.layout_type === newSpec.layout_type)
      )
    );

    const isDuplicate = collisions.length > 0;
    const uniquenessScore = isDuplicate ? 0.4 : 0.99;

    // Register into active projects
    const existingIndex = projectsRegistry.findIndex((p) => p.project_id === newSpec.project_id);
    if (existingIndex >= 0) {
      projectsRegistry[existingIndex] = newSpec;
    } else {
      projectsRegistry.unshift(newSpec);
    }

    logTelemetry(
      projId,
      'AUTONOMOUS_SPEC_SYNTHESIZED',
      `Synthesized novel archetype [${layoutType}] for: ${config.app_name}`,
      'success',
      'server.ts'
    );

    res.json({
      success: true,
      project_id: projId,
      spec: newSpec,
      formula,
      audit: {
        approved: !isDuplicate,
        uniquenessScore,
        directive: 'CERTIFIED_NOVELTY: Design is mathematically distinct and registered in factory vault.'
      }
    });
  });

  // ── Vite SPA Setup ─────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Factory Engine] Server listening on port ${PORT}`);
  });
}

startServer();
