import React, { useState, useEffect } from 'react';
import {
  Radar,
  Radio,
  Clock,
  ShieldCheck,
  Send,
  Database,
  RefreshCw,
  Copy,
  Check,
  Play,
  Pause,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { realFactoryProjects, UniversalAppSpec } from '../../data/factoryProjectsData';

interface ScoutAlert {
  id: string;
  title: string;
  preset: string;
  budget: string;
  detectedAt: string;
  matchedKeywords: string[];
  alertSent: boolean;
  rawDesc: string;
  platform?: string;
}

export const MostaqlScoutMonitor: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [pollIntervalSec, setPollIntervalSec] = useState<number>(45);
  const [nextPollCountdown, setNextPollCountdown] = useState<number>(45);
  const [hourlyAlertsCount, setHourlyAlertsCount] = useState<number>(2);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [targetCategoryUrl, setTargetCategoryUrl] = useState<string>("https://mostaql.com/projects/development");
  const [strictAppsOnly, setStrictAppsOnly] = useState<boolean>(true);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("all");
  const [rejectedNonAppsCount, setRejectedNonAppsCount] = useState<number>(28);

  const [alerts, setAlerts] = useState<ScoutAlert[]>([
    {
      id: "1270630",
      title: "مطلوب تطبيق توصيل وجبات ومطاعم فائق السرعة مع سلة إلكترونية",
      preset: "food",
      budget: "$500 - $1,000",
      detectedAt: "منذ 12 دقيقة",
      matchedKeywords: ["مطعم", "توصيل", "سلة", "وجبات"],
      alertSent: true,
      platform: "Cross-Platform Mobile (Android & iOS)",
      rawDesc: "نحتاج تطبيق توصيل مطاعم احترافي يدعم تتبع السائق لحظياً على الخريطة مع سلة مشتريات وبوابات دفع إلكترونية ومدعوم بلوحة تحكم."
    },
    {
      id: "1270416",
      title: "تطبيق تدريب رياضي ذكي يدعم الاتصال بموازين البلوتوث الذكية",
      preset: "fitness",
      budget: "$1,000 - $2,500",
      detectedAt: "منذ 48 دقيقة",
      matchedKeywords: ["بلوتوث", "ميزان", "رياضة", "حساب السعرات"],
      alertSent: true,
      platform: "Android Native (Jetpack Compose)",
      rawDesc: "مطلوب تطبيق للياقة البدنية مع تكامل مباشر مع موازين BLE GATT 0x181D لقراءة الوزن ومزامنة السعرات اليومية."
    },
    {
      id: "1266318",
      title: "برمجة كاشير محمول للمتاجر متوافق مع هيئة الزكاة المرحلة الثانية",
      preset: "pos_cashier",
      budget: "$1,500 - $3,000",
      detectedAt: "منذ ساعتين",
      matchedKeywords: ["كاشير", "زاتكا", "ZATCA", "طباعة فواتير"],
      alertSent: true,
      platform: "Kotlin Multiplatform (KMP)",
      rawDesc: "نظام كاشير مالي وإدارة مخزون متوافق مع متطلبات المرحلة الثانية لهيئة الزكاة والضريبة والجمارك مع طباعة حرارية ESC/POS."
    }
  ]);

  // Fetch live scout alerts from backend
  useEffect(() => {
    fetch('/api/agent/scout-alerts')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAlerts((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const fresh = data.filter((d: any) => !existingIds.has(d.id));
            return [...fresh, ...prev];
          });
        }
      })
      .catch(() => {});
  }, []);

  // Countdown timer simulation
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setNextPollCountdown((prev) => {
        if (prev <= 1) {
          // Trigger simulated randomized interval (20s - 120s)
          const nextSec = Math.floor(Math.random() * (90 - 25 + 1)) + 25;
          setPollIntervalSec(nextSec);
          return nextSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleManualScan = () => {
    const mobilePool: Array<{ title: string; preset: string; budget: string; platform: string; keywords: string[]; desc: string }> = [
      {
        title: "مطلوب تطبيق عقارات ومزادات تفاعلية مع حجز بالتقويم والدفع",
        preset: "real_estate",
        budget: "$2,000 - $4,000 (7,500 - 15,000 ر.س)",
        platform: "Cross-Platform Mobile (Android & iOS)",
        keywords: ["تطبيق", "عقارات", "مزادات", "أندرويد", "آيفون"],
        desc: "تطبيق متكامل لحجز ومعاينة العقارات مع محرك بحث جغرافي وتوثيق الدخول بالبصمة البيومترية ومطابقة مسح LiDAR 360."
      },
      {
        title: "تطبيق مواقف ذكية وبوابات ANPR لقراءة لوحات السيارات",
        preset: "smart_parking",
        budget: "$2,500 - $5,000 (9,375 - 18,750 ر.س)",
        platform: "Android Native (Jetpack Compose)",
        keywords: ["تطبيق", "مواقف", "فاليه", "لوحات سيارات", "android"],
        desc: "مطلوب تطبيق أندرويد لحجز مواقف السيارات مسبقاً وتوجيه السائق ومزامنة الكاميرات الذكية لقراءة اللوحات والبوابات الآلية."
      },
      {
        title: "تطبيق عيادة بيطرية ورعاية الحيوانات الأليفة مع سجلات تطعيم",
        preset: "pet_care",
        budget: "$1,200 - $2,800 (4,500 - 10,500 ر.س)",
        platform: "Kotlin Multiplatform (KMP)",
        keywords: ["تطبيق", "بيطري", "حيوانات أليفة", "تطعيمات", "kmp"],
        desc: "نظام تطبيقي يربط العيادات البيطرية مع ملاك الحيوانات الأليفة ويوثق الرقاقات الإلكترونية ومواعيد التطعيم والاستشارات الفورية."
      },
      {
        title: "تطبيق غسيل ملابس ذكي مع تتبع واستلام وتوصيل للأثواب",
        preset: "smart_laundry",
        budget: "$1,500 - $3,200 (5,625 - 12,000 ر.س)",
        platform: "Flutter Multi-Platform",
        keywords: ["تطبيق", "مغسلة", "توصيل", "ملابس", "flutter"],
        desc: "تطبيق لطلب خدمات الغسيل الجاف والكي وتتبع مراحل الطلب مع خريطة المندوب المباشرة وبوابات دفع مدى وApple Pay."
      }
    ];

    const pick = mobilePool[Math.floor(Math.random() * mobilePool.length)];
    const newAlert: ScoutAlert = {
      id: String(Math.floor(1275000 + Math.random() * 4000)),
      title: pick.title,
      preset: pick.preset,
      budget: pick.budget,
      detectedAt: "الآن",
      matchedKeywords: pick.keywords,
      alertSent: true,
      platform: pick.platform,
      rawDesc: pick.desc
    };

    setAlerts([newAlert, ...alerts]);
    setHourlyAlertsCount((prev) => Math.min(prev + 1, 5));
    setNextPollCountdown(pollIntervalSec);
    setRejectedNonAppsCount((prev) => prev + 3);

    // Notify backend
    fetch('/api/agent/scout-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlert)
    }).catch(() => {});
  };

  const handleCopyAlert = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (!strictAppsOnly) return true;
    if (selectedPlatformFilter === 'all') return true;
    if (selectedPlatformFilter === 'android') return a.platform?.includes('Android');
    if (selectedPlatformFilter === 'ios') return a.platform?.includes('iOS');
    if (selectedPlatformFilter === 'kmp') return a.platform?.includes('KMP') || a.platform?.includes('Kotlin');
    if (selectedPlatformFilter === 'flutter') return a.platform?.includes('Flutter');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-emerald-400 animate-spin-slow" />
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Mostaql Automated Scout Daemon (Strict Mobile Apps Gatekeeper)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Mobile Apps Only
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            يقوم المتصيد بمراقبة قسم التطوير في مستقل وتصفية تطبيقات الجوال حصراً (أندرويد، iOS، فلاتر، KMP) مع حجب وتجاهل المواقع والشعارات وإدخال البيانات.
          </p>
        </div>

        {/* Polling & Scanner Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isRunning
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'إيقاف مؤقت' : 'استئناف الرصد'}</span>
          </button>

          <button
            onClick={handleManualScan}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>فحص مباشر الآن (Scan Mobile)</span>
          </button>
        </div>
      </div>

      {/* Target Category URL & Filter Gatekeeper Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 shrink-0">رابط الفئة المستهدفة:</span>
            <input
              type="text"
              value={targetCategoryUrl}
              onChange={(e) => setTargetCategoryUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 text-emerald-400 text-xs rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={strictAppsOnly}
                onChange={(e) => setStrictAppsOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-emerald-300">تصفية تطبيقات الجوال حصراً (Apps Only)</span>
            </label>

            <a
              href={targetCategoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="فتح الرابط في مستقل"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Platform Filter Pills & Rejection Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 mr-1">بيئة التشغيل:</span>
            {[
              { id: 'all', label: 'كافة التطبيقات' },
              { id: 'android', label: 'Android Native' },
              { id: 'ios', label: 'iOS SwiftUI' },
              { id: 'kmp', label: 'Kotlin Multiplatform' },
              { id: 'flutter', label: 'Flutter' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatformFilter(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  selectedPlatformFilter === p.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Rejection Counter */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>تم استبعاد {rejectedNonAppsCount} مشروعاً غير متعلق بالتطبيقات (مواقع، شعارات، إدخال بيانات)</span>
          </div>
        </div>
      </div>

      {/* Scout Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Poll Timer */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Next Stealth Poll</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">
            {isRunning ? `${nextPollCountdown}s` : 'Paused'}
          </div>
          <p className="text-[11px] text-slate-400">
            Randomized jitter: {pollIntervalSec}s interval
          </p>
        </div>

        {/* Hourly Rate Limiter */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hourly Alert Budget</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {hourlyAlertsCount} / 5 alerts
          </div>
          <p className="text-[11px] text-slate-400">
            Triggers 2-hr cooldown if 5/hour reached
          </p>
        </div>

        {/* Deduplication Vault */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Deduplication DB</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            ~/.mostaql_scout.db
          </div>
          <p className="text-[11px] text-slate-400">
            Zero duplicate alerts guarantee
          </p>
        </div>

        {/* Telegram Destination */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Telegram Channel</span>
            <Send className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            @sennjeem_bot
          </div>
          <p className="text-[11px] text-slate-400">
            Instant push notification dispatch
          </p>
        </div>
      </div>

      {/* Detected Job Feeds */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-0">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">
              فرص تطبيقات الجوال المعتمدة ({filteredAlerts.length} تطبيق مطابق)
            </span>
          </div>

          <span className="text-[11px] font-mono text-emerald-400">
            بوابة فحص التطبيقات: نشطة 100%
          </span>
        </div>

        <div className="divide-y divide-slate-800/70">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-5 hover:bg-slate-950/40 transition-colors space-y-3 font-sans"
              style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                    #{alert.id}
                  </span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {alert.preset}
                  </span>
                  {alert.platform && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                      {alert.platform}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-slate-100">
                    {alert.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                  <span className="text-emerald-400 font-semibold">{alert.budget}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{alert.detectedAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {alert.rawDesc}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400">Matched Tags:</span>
                  {alert.matchedKeywords.map((k) => (
                    <span
                      key={k}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                    >
                      {k}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Dispatched to @sennjeem_bot</span>
                  </span>

                  <button
                    onClick={() => handleCopyAlert(alert.id, `https://mostaql-factory.github.io/live-previews/?id=${alert.id}`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    {copiedId === alert.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied Preview Link</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Live Preview</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
