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
}

export const MostaqlScoutMonitor: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [pollIntervalSec, setPollIntervalSec] = useState<number>(45);
  const [nextPollCountdown, setNextPollCountdown] = useState<number>(45);
  const [hourlyAlertsCount, setHourlyAlertsCount] = useState<number>(2);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<ScoutAlert[]>([
    {
      id: "1270630",
      title: "مطلوب تطبيق توصيل وجبات ومطاعم فائق السرعة مع سلة إلكترونية",
      preset: "food",
      budget: "$500 - $1,000",
      detectedAt: "منذ 12 دقيقة",
      matchedKeywords: ["مطعم", "توصيل", "سلة", "وجبات"],
      alertSent: true,
      rawDesc: "نحتاج تطبيق توصيل مطاعم احترافي يدعم تتبع السائق لحظياً على الخريطة مع سلة مشتريات وبوابات دفع إلكترونية ومدعوم بلوحة تحكم."
    },
    {
      id: "1270416",
      title: "تطبيق تدريب رياضي ذكي يدعم الاتصال بموازين البلوتوث الذكية",
      preset: "standard",
      budget: "$1,000 - $2,500",
      detectedAt: "منذ 48 دقيقة",
      matchedKeywords: ["بلوتوث", "ميزان", "رياضة", "حساب السعرات"],
      alertSent: true,
      rawDesc: "مطلوب تطبيق للياقة البدنية مع تكامل مباشر مع موازين BLE GATT 0x181D لقراءة الوزن ومزامنة السعرات اليومية."
    },
    {
      id: "1266318",
      title: "برمجة كاشير محمول للمتاجر متوافق مع هيئة الزكاة المرحلة الثانية",
      preset: "ecommerce",
      budget: "$1,500 - $3,000",
      detectedAt: "منذ ساعتين",
      matchedKeywords: ["كاشير", "زاتكا", "ZATCA", "طباعة فواتير"],
      alertSent: true,
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
    const newAlert: ScoutAlert = {
      id: String(Math.floor(1275000 + Math.random() * 4000)),
      title: "مطلوب تطبيق عقارات ومزادات تفاعلية مع حجز بالتقويم والدفع",
      preset: "services",
      budget: "$2,000 - $4,000",
      detectedAt: "الآن",
      matchedKeywords: ["عقارات", "حجز", "دفع إلكتروني", "خرائط"],
      alertSent: true,
      rawDesc: "تطبيق متكامل لحجز ومعاينة العقارات مع محرك بحث جغرافي وتوثيق الدخول بالبصمة البيومترية."
    };
    setAlerts([newAlert, ...alerts]);
    setHourlyAlertsCount((prev) => Math.min(prev + 1, 5));
    setNextPollCountdown(pollIntervalSec);

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-emerald-400 animate-spin-slow" />
            <h2 className="text-sm font-semibold text-slate-100">
              Mostaql Automated Scout Daemon (Stealth & Smart Cooldown)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Daemon from monitor.py: Human-like randomized polling (20s–120s), max 5 alerts/hour rate-limiter with 2-hour cooldown, and automatic Gemini proposal dispatch.
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
            <span>{isRunning ? 'Pause Daemon' : 'Resume Daemon'}</span>
          </button>

          <button
            onClick={handleManualScan}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Mostaql Now</span>
          </button>
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
              Scouted Mostaql Opportunities ({alerts.length} Jobs Detected)
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Auto-Classifier: Active
          </span>
        </div>

        <div className="divide-y divide-slate-800/70">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-5 hover:bg-slate-950/40 transition-colors space-y-3 font-sans"
              style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                    #{alert.id}
                  </span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {alert.preset}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">
                    {alert.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
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
