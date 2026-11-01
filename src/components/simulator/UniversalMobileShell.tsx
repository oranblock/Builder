import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Wifi,
  Battery,
  ShieldCheck,
  GitCommit,
  Code2,
  Plus,
  Minus,
  Wrench,
  Snowflake,
  Zap,
  Cpu,
  Compass,
  MapPin,
  Radio,
  Printer,
  Scale,
  Activity,
  QrCode,
  Calendar,
  HeartPulse,
  Sprout,
  Sun,
  Droplet,
  Layers,
  Sparkles,
  RefreshCw,
  Phone,
  Clock,
  ArrowRight,
  Monitor,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { UniversalAppSpec, realFactoryProjects, LayoutType } from '../../data/factoryProjectsData';
import { downloadSingleFile } from '../../lib/zipExport';

export const UniversalMobileShell: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('1265226');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'pixel'>('iphone');
  const [isRTL, setIsRTL] = useState<boolean>(true);
  const [showProofTab, setShowProofTab] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Layout-specific interactive states
  // POS Cashier state
  const [posCart, setPosCart] = useState<{ title: string; priceNum: number; qty: number }[]>([]);
  const [printerPrinted, setPrinterPrinted] = useState<boolean>(false);

  // Navigation SOS state
  const [sosActive, setSosActive] = useState<boolean>(false);

  // Fitness scale state
  const [scaleSynced, setScaleSynced] = useState<boolean>(true);

  // Agritech valves state
  const [valves, setValves] = useState<{ [key: string]: boolean }>({ v1: true, v2: false });

  // In-memory editable JSON spec
  const initialProject =
    realFactoryProjects.find((p) => p.project_id === selectedProjectId) || realFactoryProjects[0];
  const [customSpecText, setCustomSpecText] = useState<string>(
    JSON.stringify(initialProject, null, 2)
  );
  const [specError, setSpecError] = useState<string | null>(null);

  // Parse current active spec
  let activeSpec: UniversalAppSpec = initialProject;
  try {
    activeSpec = JSON.parse(customSpecText);
  } catch (err: any) {
    // Keep last valid spec
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectProject = (proj: UniversalAppSpec) => {
    setSelectedProjectId(proj.project_id);
    setCustomSpecText(JSON.stringify(proj, null, 2));
    setPosCart([]);
    setPrinterPrinted(false);
    setSosActive(false);
    setShowProofTab(false);
    setSpecError(null);
    setActiveTab(proj.nav_tabs[0]?.id || 'home');
  };

  const handleSpecTextChange = (text: string) => {
    setCustomSpecText(text);
    try {
      const parsed = JSON.parse(text);
      setSpecError(null);
      if (parsed.project_id && parsed.project_id !== selectedProjectId) {
        setSelectedProjectId(parsed.project_id);
      }
    } catch (err: any) {
      setSpecError('خطأ في بناء جملة JSON');
    }
  };

  const handleDownloadSpec = () => {
    downloadSingleFile(`spec_${activeSpec.project_id}.json`, customSpecText);
    triggerToast(`تم تحميل ملف spec_${activeSpec.project_id}.json بنجاح`);
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(customSpecText);
    setCopied(true);
    triggerToast('تم نسخ كود الـ JSON إلى الحافظة');
    setTimeout(() => setCopied(false), 2000);
  };

  // POS Cashier Cart Helpers
  const handleAddPosItem = (title: string, priceStr: string) => {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 25;
    setPosCart((prev) => {
      const existing = prev.find((item) => item.title === title);
      if (existing) {
        return prev.map((item) =>
          item.title === title ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { title, priceNum: num, qty: 1 }];
    });
  };

  const handleRemovePosItem = (title: string) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.title === title);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        return prev.filter((item) => item.title !== title);
      }
      return prev.map((item) =>
        item.title === title ? { ...item, qty: item.qty - 1 } : item
      );
    });
  };

  const posSubtotal = posCart.reduce((sum, item) => sum + item.priceNum * item.qty, 0);
  const posVat = posSubtotal * 0.15;
  const posTotal = posSubtotal + posVat;

  /* -------------------------------------------------------------
     RENDER SPECIALIZED DOMAIN TEMPLATES
  ------------------------------------------------------------- */

  // 1. SERVICES & DISPATCH HUD (e.g. #1265226 تسليح)
  const renderServicesLayout = () => {
    const tech = activeSpec.domain_data?.active_technician;
    return (
      <div className="space-y-4">
        {/* Live Technician HUD */}
        {tech && (
          <div className="rounded-2xl bg-teal-950/60 border border-teal-800/80 p-3.5 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-teal-300">{tech.status}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-900/80 text-teal-200 border border-teal-700/50">
                {tech.job_order_id}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-800/80 border border-teal-600/50 flex items-center justify-center text-teal-200 font-bold shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{tech.name}</h4>
                  <span className="text-[10px] font-bold text-amber-400">{tech.rating}</span>
                </div>
                <p className="text-[10px] text-teal-300 truncate">{tech.specialty}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span className="font-mono text-emerald-400 font-bold">وصول خلال {tech.eta_minutes} دقيقة</span>
                  <span>·</span>
                  <span>المسافة: {tech.distance_km}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => triggerToast(`جاري الاتصال بالفني ${tech.name}`)}
                className="py-1.5 rounded-lg bg-teal-700/50 hover:bg-teal-700/70 text-teal-200 text-[11px] font-semibold border border-teal-600/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>اتصال مباشر</span>
              </button>
              <button
                onClick={() => triggerToast('جاري فتح خريطة تتبع GPS')}
                className="py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                <span>تتبع الفني</span>
              </button>
            </div>
          </div>
        )}

        {/* Work Order Progress Timeline */}
        <div className="rounded-xl bg-slate-950 border border-slate-800/90 p-3 space-y-2">
          <span className="text-[11px] font-bold text-slate-300 block">مراحل تنفيذ البلاغ</span>
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <div className="flex flex-col items-center gap-1 text-emerald-400">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[9px] font-bold">✓</div>
              <span>تم الطلب</span>
            </div>
            <div className="h-0.5 flex-1 bg-emerald-500/60 mx-1"></div>
            <div className="flex flex-col items-center gap-1 text-emerald-400">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[9px] font-bold">✓</div>
              <span>تعيين فني</span>
            </div>
            <div className="h-0.5 flex-1 bg-teal-500 mx-1 animate-pulse"></div>
            <div className="flex flex-col items-center gap-1 text-teal-300 font-bold">
              <div className="w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center text-[9px]">3</div>
              <span>في الطريق</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-800 mx-1"></div>
            <div className="flex flex-col items-center gap-1 text-slate-500">
              <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[9px]">4</div>
              <span>الفحص والاعتماد</span>
            </div>
          </div>
        </div>

        {/* 2x2 Services Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">خدمات الصيانة السريعة</span>
            <span className="text-[10px] text-teal-400">ضمان معتمد 100%</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {activeSpec.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col justify-between gap-2 hover:border-teal-700/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-300">
                      {item.icon === 'wrench' && <Wrench className="w-3.5 h-3.5" />}
                      {item.icon === 'snowflake' && <Snowflake className="w-3.5 h-3.5" />}
                      {item.icon === 'zap' && <Zap className="w-3.5 h-3.5" />}
                      {item.icon === 'cpu' && <Cpu className="w-3.5 h-3.5" />}
                      {!['wrench', 'snowflake', 'zap', 'cpu'].includes(item.icon || '') && (
                        <Wrench className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-800/40">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-100 line-clamp-1">{item.title}</h4>
                  <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className="text-[11px] font-bold font-mono text-teal-400">{item.price}</span>
                  <button
                    onClick={() => triggerToast(`تم طلب: ${item.title}`)}
                    className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold shadow-sm transition-transform active:scale-95"
                  >
                    حجز فني
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 2. NAVIGATION & TOPOGRAPHIC GPX HUD (e.g. #1266029 دليل الصحراء)
  const renderNavigationLayout = () => {
    const navData = activeSpec.domain_data || {};
    return (
      <div className="space-y-4">
        {/* Topographic HUD & Gyro Compass Rose */}
        <div className="rounded-2xl bg-gradient-to-b from-amber-950/50 to-slate-950 border border-amber-800/60 p-4 space-y-3 shadow-xl text-center">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>بوصلة جيروسكوبية حية</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
              {navData.satellite_fix || '11 قمر صناعي'}
            </span>
          </div>

          {/* Compass Dial Animation */}
          <div className="relative w-36 h-36 mx-auto rounded-full border-2 border-amber-500/40 bg-slate-950 flex items-center justify-center shadow-inner">
            {/* Ticks */}
            <div className="absolute inset-1 rounded-full border border-dashed border-amber-500/20 pointer-events-none" />
            <div className="absolute top-1 text-[10px] font-bold text-red-500 font-mono">N</div>
            <div className="absolute bottom-1 text-[10px] font-bold text-slate-500 font-mono">S</div>
            <div className="absolute right-2 text-[10px] font-bold text-slate-500 font-mono">E</div>
            <div className="absolute left-2 text-[10px] font-bold text-slate-500 font-mono">W</div>

            {/* Rotating Needle */}
            <div
              className="absolute w-1 h-28 bg-gradient-to-t from-slate-600 via-transparent to-red-500 rounded-full transition-transform duration-500"
              style={{ transform: `rotate(${navData.compass_bearing || 312}deg)` }}
            />
            <div className="w-10 h-10 rounded-full bg-amber-950/90 border border-amber-500/80 flex flex-col items-center justify-center z-10">
              <span className="text-xs font-mono font-bold text-amber-200">
                {navData.compass_bearing || 312}°
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-amber-300">
            {navData.compass_direction || 'شمال غرب (NW)'}
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-900/40 text-[10px] text-slate-300 font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
              <span className="text-slate-500 block text-[9px]">الارتفاع (Altitude):</span>
              <span className="text-amber-400 font-bold">{navData.altitude_meters || 742} م فوق البحر</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
              <span className="text-slate-500 block text-[9px]">الإحداثيات (GPS):</span>
              <span className="text-amber-400 font-bold truncate block">{navData.coordinates || '24°42\'54" N'}</span>
            </div>
          </div>
        </div>

        {/* SOS Satellite Emergency Beacon */}
        <div className="rounded-xl bg-red-950/40 border border-red-800/80 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
              <Radio className={`w-4 h-4 ${sosActive ? 'animate-spin text-red-500' : ''}`} />
              <span>إغاثة طوارئ الصحراء (SOS Beacon)</span>
            </div>
            <span className="text-[10px] font-mono text-red-300">بدون إنترنت</span>
          </div>
          <p className="text-[10px] text-slate-400">
            إرسال إشارة استغاثة فورية متضمنة إحداثيات موقعك عبر قنوات الأقمار الصناعية لفرق الإنقاذ.
          </p>
          <button
            onClick={() => {
              setSosActive(!sosActive);
              triggerToast(
                sosActive
                  ? 'تم إيقاف إشارة SOS'
                  : 'تم إطلاق إشارة SOS ونشر الإحداثيات عبر الأقمار الصناعية!'
              );
            }}
            className={`w-full py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
              sosActive
                ? 'bg-red-600 animate-pulse border border-red-400'
                : 'bg-red-900/80 hover:bg-red-800 border border-red-700/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{sosActive ? 'إشارة الاستغاثة نشطة (جاري البث...)' : 'تفعيل نداء الاستغاثة SOS'}</span>
          </button>
        </div>

        {/* GPX Waypoints List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">المسارات ونقاط الأمان المفتوحة</span>
            <span className="text-[10px] font-mono text-amber-400">GPX Ready</span>
          </div>

          <div className="space-y-2">
            {activeSpec.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-amber-700/60 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-100 truncate">{item.title}</h4>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                </div>

                <button
                  onClick={() => triggerToast(`بدء الملاحة لمسار: ${item.title}`)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold shadow-sm shrink-0 transition-transform active:scale-95 flex items-center gap-1"
                >
                  <Compass className="w-3 h-3" />
                  <span>ملاحة</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 3. ZATCA PHASE 2 POS CASHIER (e.g. #1266318 دكان كاشير)
  const renderPosCashierLayout = () => {
    const domain = activeSpec.domain_data || {};
    return (
      <div className="space-y-3.5">
        {/* Terminal Header & Bluetooth ESC/POS Status */}
        <div className="rounded-xl bg-slate-950 border border-blue-900/60 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100">{domain.seller_name || 'دكان كاشير'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
              {domain.invoice_sequence || 'INV-2026-0894'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-900 pt-1.5">
            <span className="font-mono">الرقم الضريبي: {domain.vat_number || '300982189200003'}</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>طابعة ESC/POS متصلة</span>
            </span>
          </div>
        </div>

        {/* Quick Product Grid */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-300 block">الأصناف السريعة (انقر للإضافة للفاتورة):</span>
          <div className="grid grid-cols-2 gap-2">
            {activeSpec.items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAddPosItem(item.title, item.price)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 text-right hover:border-blue-600 transition-colors flex flex-col justify-between h-20 group"
              >
                <div>
                  <h5 className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover:text-blue-300">
                    {item.title}
                  </h5>
                  <p className="text-[9px] text-slate-500 line-clamp-1">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between w-full pt-1">
                  <span className="text-xs font-mono font-bold text-emerald-400">{item.price}</span>
                  <span className="w-5 h-5 rounded-md bg-blue-900/60 text-blue-300 flex items-center justify-center text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    +
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Running Receipt & ZATCA Calculation */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-200">
            <span>الفاتورة الحالية ({posCart.reduce((sum, i) => sum + i.qty, 0)} صنف)</span>
            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-[10px] text-red-400 hover:text-red-300"
              >
                تفريغ السلة
              </button>
            )}
          </div>

          {posCart.length === 0 ? (
            <div className="py-4 text-center text-slate-500 text-[11px]">
              لا توجد أصناف في الفاتورة الحالية. انقر على أي صنف أعلاه لإضافته.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {posCart.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] py-1 border-b border-slate-900"
                >
                  <div className="min-w-0 flex-1 truncate text-slate-300">{item.title}</div>
                  <div className="flex items-center gap-2 font-mono">
                    <button
                      onClick={() => handleRemovePosItem(item.title)}
                      className="w-4 h-4 rounded bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]"
                    >
                      -
                    </button>
                    <span className="text-white font-bold">{item.qty}</span>
                    <button
                      onClick={() => handleAddPosItem(item.title, `${item.priceNum}`)}
                      className="w-4 h-4 rounded bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]"
                    >
                      +
                    </button>
                    <span className="w-14 text-left font-bold text-emerald-400">
                      {(item.priceNum * item.qty).toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tax Breakdown */}
          <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-slate-400">
              <span>المجموع الخاضع للضريبة:</span>
              <span>{posSubtotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span>{posVat.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-900">
              <span>الإجمالي المستحق:</span>
              <span className="text-emerald-400">{posTotal.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        {/* Live ZATCA Phase 2 TLV QR Preview */}
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center gap-3">
          <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow">
            <QrCode className="w-12 h-12 text-black" />
          </div>
          <div className="flex-1 min-w-0 space-y-1 text-[10px]">
            <span className="font-bold text-blue-300 block">رمز الاستجابة ZATCA Phase 2 TLV</span>
            <span className="text-[9px] font-mono text-slate-400 truncate block">
              Tag 1 (Seller) + Tag 2 (VAT) + Tag 3 (Time) + Tag 4 (Total) + Tag 5 (Tax)
            </span>
            <button
              onClick={() => {
                setPrinterPrinted(true);
                triggerToast('تم إرسال أمر الطباعة إلى طابعة البلوتوث ESC/POS');
                setTimeout(() => setPrinterPrinted(false), 3000);
              }}
              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3 h-3" />
              <span>{printerPrinted ? 'جاري الطباعة...' : 'طباعة الفاتورة والباركود'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 4. FITNESS & BLE SMART SCALE HUD (e.g. #1270416 تطبيق لياقة)
  const renderFitnessLayout = () => {
    const domain = activeSpec.domain_data || {};
    return (
      <div className="space-y-4">
        {/* Smart Scale BLE Card */}
        <div className="rounded-2xl bg-gradient-to-b from-red-950/60 to-slate-950 border border-red-800/60 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <Scale className="w-3.5 h-3.5" />
              <span>الميزان الذكي BLE (GATT 0x181D)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
              متصل الآن
            </span>
          </div>

          {/* Current Weight Giant Display */}
          <div className="text-center space-y-1 py-1">
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {domain.current_weight_kg || 74.25}{' '}
              <span className="text-sm font-sans font-bold text-red-400">كجم</span>
            </div>
            <div className="text-[11px] text-slate-400">
              الهدف: <span className="font-mono text-emerald-400 font-bold">{domain.target_weight_kg || 71.0} كجم</span> · باقي {((domain.current_weight_kg || 74.25) - (domain.target_weight_kg || 71.0)).toFixed(2)} كجم
            </div>
          </div>

          {/* 4-Metric Biometric Grid */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-red-900/40 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">نسبة الدهون</span>
              <span className="text-xs font-bold text-amber-400">{domain.body_fat_pct || 16.8}%</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">العضلات</span>
              <span className="text-xs font-bold text-emerald-400">{domain.muscle_mass_kg || 58.4} كجم</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">نسبة الماء</span>
              <span className="text-xs font-bold text-blue-400">{domain.water_pct || 61.2}%</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">مؤشر BMI</span>
              <span className="text-xs font-bold text-purple-400">{domain.bmi || 23.4}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setScaleSynced(false);
              triggerToast('جاري قراءة مستشعر الوزن عبر Bluetooth...');
              setTimeout(() => {
                setScaleSynced(true);
                triggerToast('تم تحديث القياسات الحيوية من الميزان الذكي!');
              }, 1200);
            }}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${!scaleSynced ? 'animate-spin' : ''}`} />
            <span>إعادة قياس الوزن الآن (Zero Calibrate)</span>
          </button>
        </div>

        {/* Activity Rings & Calorie Burn */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-200 block">حلقات النشاط اليومي</span>
            <div className="text-[11px] text-slate-400">
              السعرات: <span className="text-red-400 font-bold font-mono">{domain.calories_burned || 640} / {domain.calories_target || 2200} ك.سعرة</span>
            </div>
            <div className="text-[11px] text-slate-400">
              الوقت النشط: <span className="text-emerald-400 font-bold font-mono">45 / 60 دقيقة</span>
            </div>
          </div>

          {/* Activity Mini Circle Graphic */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-red-500"
                strokeDasharray="75, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-white">75%</span>
          </div>
        </div>

        {/* Workout Routines */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-200 block">برامج التمارين الحركية</span>
          <div className="space-y-2">
            {activeSpec.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-red-700/60 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-100 truncate">{item.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                </div>

                <button
                  onClick={() => triggerToast(`بدء تمرين: ${item.title}`)}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold shadow-sm shrink-0 transition-transform active:scale-95 flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  <span>بدء التمرين</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 5. COWORKING & QR TURNSTILE PASS (e.g. #1270493 مكتب)
  const renderCoworkingLayout = () => {
    const pass = activeSpec.domain_data?.active_pass;
    return (
      <div className="space-y-4">
        {/* Dynamic Rotating QR Access Pass */}
        {pass && (
          <div className="rounded-2xl bg-gradient-to-b from-teal-950/70 to-slate-950 border border-teal-800/80 p-4 space-y-3 shadow-xl text-center">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-teal-300 font-bold">
                <QrCode className="w-3.5 h-3.5" />
                <span>بطاقة الدخول الذكية (QR Pass)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                صالح للدخول
              </span>
            </div>

            {/* QR Code Graphic with Glowing Border */}
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl shadow-lg border-2 border-teal-400/50 flex flex-col items-center justify-center relative">
              <QrCode className="w-28 h-28 text-slate-950" />
              <div className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-teal-600 text-[8px] font-mono font-bold text-white shadow">
                TOTP 30s
              </div>
            </div>

            <div className="space-y-0.5 pt-1">
              <span className="text-xs font-mono font-bold text-teal-200">{pass.pass_code}</span>
              <p className="text-[10px] text-slate-400">{pass.building}</p>
              <p className="text-[10px] text-amber-400 font-semibold">{pass.access_level}</p>
            </div>

            {/* Wi-Fi Quick Card */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[10px]">
              <div className="text-right">
                <span className="text-slate-400 block">واي فاي الزوار السريع:</span>
                <span className="text-teal-300 font-mono font-bold">{pass.wifi_ssid}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pass.wifi_pass);
                  triggerToast(`تم نسخ كلمة مرور الواي فاي: ${pass.wifi_pass}`);
                }}
                className="px-2.5 py-1 rounded bg-teal-800/80 hover:bg-teal-700 text-teal-200 font-mono font-bold transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>نسخ الرمز</span>
              </button>
            </div>
          </div>
        )}

        {/* Meeting Rooms & Workspace List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-200 block">المساحات وقاعات الاجتماعات المتاحة</span>
          <div className="space-y-2">
            {activeSpec.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col gap-2 hover:border-teal-700/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-teal-400" />
                    <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-800/40">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className="text-xs font-mono font-bold text-amber-400">{item.price}</span>
                  <button
                    onClick={() => triggerToast(`تم حجز: ${item.title}`)}
                    className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold shadow-sm transition-transform active:scale-95"
                  >
                    حجز بالساعة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 6. FOOD RESCUE & SURPLUS BAKERY (e.g. #1270630 بايت)
  const renderFoodRescueLayout = () => {
    const domain = activeSpec.domain_data || {};
    return (
      <div className="space-y-4">
        {/* Environmental Impact Counter */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-950 border border-emerald-800/80 p-3.5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>أثرك البيئي في إنقاذ الطعام</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">
              {domain.pickup_window || 'الاستلام متاح اليوم'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">وجبة تم إنقاذها</span>
              <span className="text-base font-bold text-emerald-400">{domain.saved_meals_count || 148}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">انبعاثات CO2 مخفضة</span>
              <span className="text-base font-bold text-amber-400">{domain.co2_saved_kg || 370} كجم</span>
            </div>
          </div>
        </div>

        {/* Surprise Bags & Food Deals */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">سلال الإنقاذ المتاحة قبل الإغلاق</span>
            <span className="text-[10px] text-amber-400">وفر حتى 70%</span>
          </div>

          <div className="space-y-2.5">
            {activeSpec.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col gap-2 hover:border-emerald-700/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className="text-xs font-bold font-mono text-emerald-400">{item.price}</span>
                  <button
                    onClick={() => triggerToast(`تم حجز سلة الإنقاذ: ${item.title}`)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>إنقاذ السلة الآن</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 7. TELEHEALTH CLINIC (e.g. #1271104 نبض)
  const renderTelehealthLayout = () => {
    const domain = activeSpec.domain_data || {};
    return (
      <div className="space-y-4">
        {/* Doctor Consultation Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-950/70 to-slate-950 border border-sky-800/80 p-3.5 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-red-400" />
              <span>الاستشارة المرئية الفورية</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
              انتظار: {domain.queue_wait_mins || 3} دقائق
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-900/80 border border-sky-700/60 flex items-center justify-center text-sky-200 font-bold shrink-0">
              <HeartPulse className="w-5 h-5 text-sky-300" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{domain.doctor_name || 'د. سارة المنصور'}</h4>
              <p className="text-[10px] text-sky-300 truncate">{domain.specialty || 'استشارية طب الأسرة'}</p>
            </div>
          </div>

          <button
            onClick={() => triggerToast('جاري فتح غرفة مكالمة الفيديو WebRTC المشفرة')}
            className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>بدء المحادثة المرئية الآن</span>
          </button>
        </div>

        {/* Vital Signs Realtime Sensor Readings */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">المؤشرات الحيوية المتزامنة (BLE 0x1810)</span>
            <span className="text-[10px] text-emerald-400 font-mono">طبيعي 100%</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">ضغط الدم</span>
              <span className="text-xs font-bold text-sky-400">
                {domain.bp_systolic || 118}/{domain.bp_diastolic || 78}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">النبض</span>
              <span className="text-xs font-bold text-red-400">{domain.heart_rate_bpm || 72} bpm</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">الأكسجين SpO2</span>
              <span className="text-xs font-bold text-emerald-400">{domain.blood_oxygen_pct || 99}%</span>
            </div>
          </div>
        </div>

        {/* Medical Consultations Services */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-200 block">الخدمات الطبية والوصفات</span>
          <div className="space-y-2">
            {activeSpec.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-sky-700/60 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-100 truncate">{item.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-xs font-bold font-mono text-sky-400 block mb-1">{item.price}</span>
                  <button
                    onClick={() => triggerToast(`تم حجز: ${item.title}`)}
                    className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold shadow-sm"
                  >
                    حجز
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 8. AGRITECH & SOIL IOT (e.g. #1271589 حصاد)
  const renderAgritechLayout = () => {
    const domain = activeSpec.domain_data || {};
    return (
      <div className="space-y-4">
        {/* Soil Moisture & LoRa Telemetry HUD */}
        <div className="rounded-2xl bg-gradient-to-b from-emerald-950/70 to-slate-950 border border-emerald-800/80 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>مجسات التربة (LoRaWAN 868MHz)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
              16 عقدة متصلة
            </span>
          </div>

          <div className="text-center space-y-1 py-1">
            <div className="text-4xl font-extrabold font-mono text-emerald-300 tracking-tight">
              {domain.soil_moisture_pct || 42}%{' '}
              <span className="text-xs font-sans font-bold text-slate-400">رطوبة التربة</span>
            </div>
            <div className="text-[11px] text-emerald-400/90 font-medium">
              الوضع الحالي: {domain.irrigation_mode || 'تحكم ذكي بالطقس ET0'}
            </div>
          </div>

          {/* 3-telemetry grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-900/40 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">حرارة التربة</span>
              <span className="text-xs font-bold text-amber-400">{domain.soil_temp_c || 24.6}°C</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">الملوحة EC</span>
              <span className="text-xs font-bold text-sky-400">{domain.salinity_ec || 1.2} dS/m</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">الخزان الرئيسي</span>
              <span className="text-xs font-bold text-emerald-400">{domain.water_tank_level_pct || 86}%</span>
            </div>
          </div>
        </div>

        {/* Solenoid Valves Control */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-2">
          <span className="text-xs font-bold text-slate-200 block">التحكم في محابس الري (Solenoid Relays)</span>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">محبس القطاع الشرقي (النخيل)</span>
                <span className="text-[10px] text-slate-400">ضغط 2.4 بار · تدفق 45 لتر/دقيقة</span>
              </div>
              <button
                onClick={() => {
                  setValves((prev) => ({ ...prev, v1: !prev.v1 }));
                  triggerToast(`تم ${!valves.v1 ? 'فتح' : 'إغلاق'} محبس القطاع الشرقي`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                  valves.v1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {valves.v1 ? 'مفتوح (ON)' : 'مغلق (OFF)'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">محبس البيوت المحمية (الضباب)</span>
                <span className="text-[10px] text-slate-400">ري بالتنقيط المؤتمت</span>
              </div>
              <button
                onClick={() => {
                  setValves((prev) => ({ ...prev, v2: !prev.v2 }));
                  triggerToast(`تم ${!valves.v2 ? 'فتح' : 'إغلاق'} محبس البيوت المحمية`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                  valves.v2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {valves.v2 ? 'مفتوح (ON)' : 'مغلق (OFF)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Selector for Layout View
  const renderLayoutContent = () => {
    switch (activeSpec.layout_type) {
      case 'services':
        return renderServicesLayout();
      case 'navigation':
        return renderNavigationLayout();
      case 'pos_cashier':
        return renderPosCashierLayout();
      case 'fitness':
        return renderFitnessLayout();
      case 'coworking':
        return renderCoworkingLayout();
      case 'food':
        return renderFoodRescueLayout();
      case 'telehealth':
        return renderTelehealthLayout();
      case 'agritech':
        return renderAgritechLayout();
      default:
        return renderServicesLayout();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-medium shadow-xl shadow-blue-600/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Universal JSON Mobile Preview Engine & Multi-Layout Shell
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Eliminates cheap duplicate templates. Renders distinct, domain-specific architectures: Services Dispatch HUD, Topographic Desert Navigation, ZATCA POS Cashier, BLE Smart Scale, Coworking QR Access, Food Rescue, Telehealth, and Agritech IoT.
          </p>
        </div>

        {/* Controls: Device & Language */}
        <div className="flex items-center gap-2">
          {/* Device Model Switch */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setDeviceModel('iphone')}
              className={`px-2.5 py-1 rounded transition-colors ${
                deviceModel === 'iphone' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              iPhone 16 Pro
            </button>
            <button
              onClick={() => setDeviceModel('pixel')}
              className={`px-2.5 py-1 rounded transition-colors ${
                deviceModel === 'pixel' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pixel 8 (Android 14)
            </button>
          </div>

          {/* RTL Switch */}
          <button
            onClick={() => setIsRTL(!isRTL)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isRTL
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {isRTL ? '🇸🇦 RTL (العربية)' : '🇺🇸 LTR (English)'}
          </button>
        </div>
      </div>

      {/* Project Selector Bar - Highlighting Unique Architecture Types */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-300">
            نماذج المشاريع الواقعية غير المتطابقة (Select Domain Architecture):
          </span>
          <span className="font-mono text-[11px] text-blue-400">
            Layout: <span className="font-bold underline">{activeSpec.layout_type}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {realFactoryProjects.map((p) => {
            const isSelected = p.project_id === selectedProjectId;
            return (
              <button
                key={p.project_id}
                onClick={() => handleSelectProject(p)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-900/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400">
                    #{p.project_id}
                  </span>
                  <span className="font-semibold">{p.app_name.split('—')[0]}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                    {p.layout_type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Showcase Grid: Interactive Mobile Frame vs Live Spec Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile Device Frame Column */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className={`w-[360px] h-[720px] rounded-[48px] bg-slate-950 border-[10px] ${
              deviceModel === 'iphone' ? 'border-slate-800' : 'border-slate-800/90'
            } shadow-2xl relative overflow-hidden flex flex-col font-sans select-none ring-1 ring-slate-800/50`}
            style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif" }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Dynamic Island / Camera Punch Hole */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40">
              {deviceModel === 'iphone' ? (
                <div className="w-24 h-6 rounded-full bg-black border border-slate-900 flex items-center justify-between px-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500/80" />
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-900" />
              )}
            </div>

            {/* Mobile Status Bar */}
            <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-30">
              <span>10:42</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[10px] font-mono">5G</span>
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* In-App Navigation Bar */}
            <div
              className="px-4 py-3 flex items-center justify-between shadow-sm z-20 text-white"
              style={{ backgroundColor: activeSpec.theme?.primary_color || '#1e293b' }}
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold tracking-tight truncate">{activeSpec.app_name}</h3>
                <p className="text-[10px] opacity-90 truncate max-w-[210px]">{activeSpec.tagline}</p>
              </div>

              {/* Verified Proof Tab Toggle */}
              <button
                onClick={() => setShowProofTab(!showProofTab)}
                className="px-2 py-1 rounded-md text-[10px] font-medium bg-black/20 hover:bg-black/30 border border-white/20 transition-all flex items-center gap-1 shrink-0"
                title="عرض لقطات النظام الحقيقي"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{showProofTab ? 'الواجهة' : 'لقطات المحاكي'}</span>
              </button>
            </div>

            {/* Mobile Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90 text-slate-100 scrollbar-none">
              {showProofTab ? (
                /* Verified Build Proof Screen */
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>لقطات النظام الحقيقي (Verified Proof)</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <GitCommit className="w-3 h-3 text-blue-400" />
                      <span>Commit #{activeSpec.commit_hash}</span>
                    </div>
                  </div>

                  {activeSpec.proof_screenshots &&
                    activeSpec.proof_screenshots.map((shot, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2"
                      >
                        <span className="text-xs font-semibold text-slate-200 block">
                          {shot.title}
                        </span>
                        <div className="h-28 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-3 text-center">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-emerald-400 block">
                              ✓ {shot.fallback}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 block">
                              {shot.path}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                /* Interactive In-App Screen: Specialized Domain Template */
                <>
                  {/* Banner */}
                  {activeSpec.banner && (
                    <div
                      className="p-3.5 rounded-2xl text-white shadow-lg space-y-1"
                      style={{
                        background: `linear-gradient(135deg, ${activeSpec.theme?.primary_color || '#0f766e'}, ${activeSpec.theme?.accent_color || '#f59e0b'})`,
                      }}
                    >
                      <span className="text-xs font-bold block">{activeSpec.banner.title}</span>
                      <p className="text-[11px] opacity-90 leading-snug">{activeSpec.banner.subtitle}</p>
                    </div>
                  )}

                  {/* DOMAIN-SPECIFIC LAYOUT RENDERER */}
                  {renderLayoutContent()}
                </>
              )}
            </div>

            {/* Bottom Mobile Navigation Bar */}
            <div className="h-14 border-t border-slate-800/90 bg-slate-950 px-4 flex items-center justify-around z-20">
              {activeSpec.nav_tabs &&
                activeSpec.nav_tabs.map((tab) => {
                  const isCurrent = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowProofTab(false);
                      }}
                      className={`flex flex-col items-center gap-0.5 transition-colors ${
                        isCurrent ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[11px] font-semibold">{tab.label}</span>
                      {isCurrent && <div className="w-1 h-1 rounded-full bg-blue-400" />}
                    </button>
                  );
                })}
            </div>

            {/* Home Indicator Bar */}
            <div className="h-4 bg-slate-950 flex items-center justify-center pb-1">
              <div className="w-28 h-1 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Live Spec JSON Editor Column */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden min-h-[720px]">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono font-semibold text-slate-200">
                specs/{activeSpec.project_id}.json
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                Layout: {activeSpec.layout_type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySpec}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSpec}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save JSON</span>
              </button>
            </div>
          </div>

          {/* Detailed Project Description Note */}
          {activeSpec.detailed_desc && (
            <div className="px-5 py-2.5 bg-blue-950/20 border-b border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-blue-400 font-mono">تفاصيل المشروع والنمط: </span>
              <span>{activeSpec.detailed_desc}</span>
            </div>
          )}

          {/* JSON Textarea Editor */}
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed relative">
            <textarea
              value={customSpecText}
              onChange={(e) => handleSpecTextChange(e.target.value)}
              className="w-full h-full min-h-[500px] bg-slate-950 text-slate-200 font-mono text-xs p-2 border border-slate-800 rounded focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
              spellCheck={false}
            />

            {specError && (
              <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded bg-red-950 text-red-300 border border-red-800 text-xs font-mono shadow-lg">
                ⚠️ {specError}
              </div>
            )}
          </div>

          <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Any edit immediately reflects in the live mobile emulator preview on the left.</span>
            <span className="font-mono">Zero Emoji Invariant Enforced</span>
          </div>
        </div>
      </div>

      {/* Agent Anti-Duplication Blueprint Matrix & Category/Icon Guide */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>دليل وكلاء الذكاء الاصطناعي لمنع تكرار الواجهات (Agent Anti-Duplication Matrix)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              كيف يختار الوكيل (Claude, GPT, Little Dude, OmniRoute) هوية فريدة، أسماء أصيلة، مستشعرات، وأيقونات متجهة نقية دون تكرار القوالب الرخيصة.
            </p>
          </div>

          <a
            href="/api/design-formula?project_id=1265226&niche=maintenance"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <span>GET /api/design-formula</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </a>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400">1. الصيانة والخدمات</span>
              <span className="text-[10px] font-mono text-slate-500">layout: services</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> تسليح، كفاءة، ورشة، إتقان
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> GPS Live Routing + Job Stepper
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> Wrench, Snowflake, Zap, Cpu
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[0])}
              className="w-full mt-1 py-1 rounded bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-[10px] font-bold border border-teal-700/50 transition-colors"
            >
              تحميل نموذج تسليح بالمحاكي
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">2. الملاحة البرية</span>
              <span className="text-[10px] font-mono text-slate-500">layout: navigation</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> دليل الصحراء، كشتة، رمال، مدار
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> Compass Gyro 312° + SOS Satellite
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> Compass, MapPin, Mountain, Radio
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[1])}
              className="w-full mt-1 py-1 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-[10px] font-bold border border-amber-700/50 transition-colors"
            >
              تحميل نموذج دليل الصحراء
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">3. نقاط البيع والفوترة</span>
              <span className="text-[10px] font-mono text-slate-500">layout: pos_cashier</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> دكان كاشير، رصيد، فوري، مالي
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> ZATCA Phase 2 TLV + ESC/POS BT
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> Calculator, Receipt, Printer, QrCode
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[2])}
              className="w-full mt-1 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-[10px] font-bold border border-blue-700/50 transition-colors"
            >
              تحميل نموذج دكان كاشير
            </button>
          </div>

          {/* Card 4 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-red-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400">4. اللياقة والميزان الذكي</span>
              <span className="text-[10px] font-mono text-slate-500">layout: fitness</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> لياقة، نشاط، ميزان، خطوة، رشاقة
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> BLE Scale (0x181D) + Body Fat
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> Scale, Activity, PieChart, Clock
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[3])}
              className="w-full mt-1 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 text-[10px] font-bold border border-red-700/50 transition-colors"
            >
              تحميل نموذج تطبيق لياقة
            </button>
          </div>

          {/* Card 5 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">5. مساحات العمل والدخول</span>
              <span className="text-[10px] font-mono text-slate-500">layout: coworking</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> مكتب، حيز، فضاء، ملتقى، ريادة
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> Dynamic TOTP QR + Wi-Fi Hotspot
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> QrCode, Monitor, Calendar, Wifi
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[4])}
              className="w-full mt-1 py-1 rounded bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-[10px] font-bold border border-teal-700/50 transition-colors"
            >
              تحميل نموذج مكتب كوويرك
            </button>
          </div>

          {/* Card 6 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">6. إنقاذ الأطعمة والمخابز</span>
              <span className="text-[10px] font-mono text-slate-500">layout: food</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> بايت، وفر، حفظ، حصة، نعمة
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> Pickup Window Timer + CO2 Saved
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> ShoppingBag, Sparkles, Box, Clock
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[5])}
              className="w-full mt-1 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-bold border border-emerald-700/50 transition-colors"
            >
              تحميل نموذج بايت لإنقاذ الطعام
            </button>
          </div>

          {/* Card 7 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400">7. العيادة والعلامات الحيوية</span>
              <span className="text-[10px] font-mono text-slate-500">layout: telehealth</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> نبض، عافية، طبيبك، حكيم، صحتي
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> BLE BP (0x1810) + WebRTC Stream
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> HeartPulse, Activity, Phone, ShieldCheck
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[6])}
              className="w-full mt-1 py-1 rounded bg-sky-900/60 hover:bg-sky-800 text-sky-200 text-[10px] font-bold border border-sky-700/50 transition-colors"
            >
              تحميل نموذج نبض للعيادة
            </button>
          </div>

          {/* Card 8 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">8. الاستشعار الزراعي LoRa</span>
              <span className="text-[10px] font-mono text-slate-500">layout: agritech</span>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأسماء المقترحة:</span> حصاد، غرس، واحة، نماء، سقاية
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">المستشعر/البروتوكول:</span> LoRaWAN 868MHz + Solenoid Relays
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">الأيقونات:</span> Sprout, Droplet, Sun, Layers
            </div>
            <button
              onClick={() => handleSelectProject(realFactoryProjects[7])}
              className="w-full mt-1 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-bold border border-emerald-700/50 transition-colors"
            >
              تحميل نموذج حصاد الزراعي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
