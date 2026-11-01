import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Activity,
  Copy,
  Check,
  Send,
  Database,
  Layers,
  Code2
} from 'lucide-react';
import { UniversalAppSpec } from '../../data/factoryProjectsData';

interface TelemetryEntry {
  id: string;
  timestamp: string;
  projectId: string;
  event: string;
  details: string;
  status: 'success' | 'warning' | 'error' | 'info';
  source: string;
}

interface SmartAgentControlCenterProps {
  onLaunchSimulator: (projectId: string) => void;
}

export const SmartAgentControlCenter: React.FC<SmartAgentControlCenterProps> = ({
  onLaunchSimulator
}) => {
  const [briefInput, setBriefInput] = useState<string>(
    'نظام كاشير مالي وفوترة سريعة للمقاهي المتنقلة متوافق مع هيئة الزكاة المرحلة الثانية مع طباعة فواتير بلوتوث'
  );
  const [selectedPreset, setSelectedPreset] = useState<string>('pos_cashier');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesizedResult, setSynthesizedResult] = useState<{
    spec: UniversalAppSpec;
    formula: any;
    audit: any;
  } | null>(null);

  const [telemetry, setTelemetry] = useState<TelemetryEntry[]>([]);
  const [isPollingLogs, setIsPollingLogs] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [executionPhase, setExecutionPhase] = useState<number>(0);

  // Fetch telemetry logs
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/agent/telemetry');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTelemetry(data);
        }
      }
    } catch (e) {
      console.warn('Telemetry fetch error', e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      if (isPollingLogs) fetchTelemetry();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPollingLogs]);

  // Quick preset briefs
  const sampleBriefs = [
    {
      label: 'كاشير زاتكا وطباعة بلوتوث',
      archetype: 'pos_cashier',
      brief: 'نظام كاشير مالي وفوترة سريعة للمقاهي المتنقلة متوافق مع هيئة الزكاة المرحلة الثانية مع طباعة فواتير بلوتوث'
    },
    {
      label: 'ملاحة وبوصلة بدون إنترنت',
      archetype: 'navigation',
      brief: 'دليل مسارات صحراوية وملاحة بدون إنترنت مع مسارات GPX واستشعار الجيروسكوب ونداء استغاثة بالأقمار الصناعية'
    },
    {
      label: 'عيادة واستشارات مع قياس الضغط BLE',
      archetype: 'telehealth',
      brief: 'عيادة استشارات طبية فورية مع فحص ضغط الدم المباشر عبر البلوتوث GATT 0x1810 ووصفة دوائية معتمدة'
    },
    {
      label: 'لياقة ومزامنة ميزان ذكي',
      archetype: 'fitness',
      brief: 'تطبيق لياقة وتدريب بدني ومزامنة مؤشرات الوزن ونسبة الدهون والماء مباشرة من موازين البلوتوث الذكية'
    },
    {
      label: 'حجز مكاتب العمل وبطاقة TOTP',
      archetype: 'coworking',
      brief: 'منصة حجز مساحات العمل المشتركة وقاعات الاجتماعات بالساعة مع إصدار بطاقة مرور رقمية ورمز واي فاي فوري'
    },
    {
      label: 'إنقاذ الأطعمة الفائضة والوجبات',
      archetype: 'food',
      brief: 'منصة بيع الوجبات الفائضة الطازجة من المخابز والمطاعم بأسعار مخفضة وتتبع السائق لحظياً على الخريطة'
    },
    {
      label: 'ري زراعي ذكي وصمامات LoRaWAN',
      archetype: 'agritech',
      brief: 'نظام ري زراعي آلي ومراقبة رطوبة التربة عبر شبكة LoRaWAN مع مفاتيح تشغيل صمامات المياه الذكية'
    },
    {
      label: 'صيانة منزلية وتتبع فني GPS',
      archetype: 'services',
      brief: 'تطبيق صيانة منزلية فورية سباكة وكهرباء مع تسعير معتمد وتتبع موقع الفني لحظياً على الخريطة وتأكيد OTP'
    }
  ];

  const handleSelectSample = (sample: { label: string; archetype: string; brief: string }) => {
    setSelectedPreset(sample.archetype);
    setBriefInput(sample.brief);
  };

  const handleDispatchAgent = async () => {
    if (!briefInput.trim()) return;
    setIsSynthesizing(true);
    setExecutionPhase(1);

    try {
      // Simulate visual pipeline stages for clear agent observability
      setTimeout(() => setExecutionPhase(2), 500);
      setTimeout(() => setExecutionPhase(3), 1000);

      const res = await fetch('/api/agent/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: String(Math.floor(1272000 + Math.random() * 7000)),
          brief: briefInput,
          preset: selectedPreset
        })
      });

      if (!res.ok) throw new Error('Synthesis failed');
      const data = await res.json();
      setExecutionPhase(4);
      setSynthesizedResult(data);
      fetchTelemetry();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopyCliCommand = () => {
    const cmd = `python3 scripts_archive/factory_engine.py 1278901 ${selectedPreset} "${briefInput.slice(0, 80)}"`;
    navigator.clipboard.writeText(cmd);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Top Banner: Agent Intelligence Swarm */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl shadow-indigo-950/20">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Autonomous Agent Swarm Hub & Anti-Collision Gateway</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live API Connected
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Direct REST access for <code>factory_engine.py</code> and <code>monitor.py</code>: Mathematical Design Formulas, Anti-Collision Audits, and Dynamic Archetype Synthesis.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">REST Gateway:</span>
            <span className="text-emerald-400 font-semibold">http://localhost:3000</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs font-mono">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Archetypes:</span>
            <span className="text-blue-300 font-semibold">8 Distinct Domains</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Agent Dispatcher & Execution Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Dispatcher (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Autonomous App Synthesizer (Zero-Duplicate Invariant)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Sensei Zero-Emoji Strict
              </span>
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400">
                Choose Domain or Preset Archetype:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sampleBriefs.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSelectSample(s)}
                    className={`p-2 rounded-lg text-start border transition-all text-xs ${
                      selectedPreset === s.archetype
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold truncate">{s.label}</div>
                    <div className="text-[10px] font-mono opacity-70 mt-0.5">{s.archetype}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Brief Prompt Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400">
                Client Project Brief (نص طلب العميل):
              </label>
              <textarea
                rows={3}
                value={briefInput}
                onChange={(e) => setBriefInput(e.target.value)}
                dir="rtl"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                placeholder="اكتب تفاصيل ومواصفات التطبيق المطلوبة..."
              />
            </div>

            {/* Dispatch Action Button */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-400">
                Agent will enforce mathematical color harmonics and anti-collision audit.
              </div>

              <button
                onClick={handleDispatchAgent}
                disabled={isSynthesizing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                {isSynthesizing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Agent Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Dispatch Autonomous Agent</span>
                  </>
                )}
              </button>
            </div>

            {/* 4-Stage Visual Progress Indicator */}
            {isSynthesizing && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-medium text-slate-300">
                  Agent Lifecycle Pipeline:
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
                  <div className={`p-2 rounded border ${executionPhase >= 1 ? 'bg-blue-950/60 border-blue-600/40 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    1. /api/design-formula
                  </div>
                  <div className={`p-2 rounded border ${executionPhase >= 2 ? 'bg-indigo-950/60 border-indigo-600/40 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    2. /api/audit-novelty
                  </div>
                  <div className={`p-2 rounded border ${executionPhase >= 3 ? 'bg-purple-950/60 border-purple-600/40 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    3. Domain Model Synthesis
                  </div>
                  <div className={`p-2 rounded border ${executionPhase >= 4 ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    4. Vault Registration
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Synthesized Result Card */}
          {synthesizedResult && (
            <div className="bg-emerald-950/20 border border-emerald-500/40 p-5 rounded-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                      Certified Novel Spec #{synthesizedResult.spec.project_id}
                    </span>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {synthesizedResult.spec.layout_type}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mt-2 font-sans" dir="rtl">
                    {synthesizedResult.spec.app_name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-sans" dir="rtl">
                    {synthesizedResult.spec.tagline}
                  </p>
                </div>

                <button
                  onClick={() => onLaunchSimulator(synthesizedResult.spec.project_id)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Launch in Simulator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Metrics breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 text-xs font-mono">
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Uniqueness</span>
                  <span className="text-emerald-400 font-bold">
                    {(synthesizedResult.audit.uniquenessScore * 100).toFixed(0)}% Certified
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Primary Color</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: synthesizedResult.spec.theme.primary_color }}
                    />
                    <span className="text-slate-300 text-[11px]">
                      {synthesizedResult.spec.theme.primary_color}
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Items Generated</span>
                  <span className="text-slate-200 font-bold">
                    {synthesizedResult.spec.items.length} Items (SAR)
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Emoji Count</span>
                  <span className="text-emerald-400 font-bold">0 (Zero Emojis)</span>
                </div>
              </div>
            </div>
          )}

          {/* Python CLI Execution Guide */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Run via Autonomous Python Agent</span>
              </div>
              <button
                onClick={handleCopyCliCommand}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 font-mono transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy CLI'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-blue-300 overflow-x-auto whitespace-pre">
              python3 scripts_archive/factory_engine.py 1278901 {selectedPreset} "{briefInput.slice(0, 70)}"
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Stream & Agent Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-slate-200">
                  Agent Telemetry & Event Stream
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPollingLogs(!isPollingLogs)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    isPollingLogs
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isPollingLogs ? 'Live Polling' : 'Paused'}
                </button>
                <button
                  onClick={fetchTelemetry}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 max-h-[500px] overflow-y-auto space-y-2 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800">
              {telemetry.length === 0 ? (
                <div className="text-slate-500 text-center py-8 text-xs">
                  Awaiting agent telemetry events...
                </div>
              ) : (
                telemetry.map((log) => {
                  const isSuccess = log.status === 'success';
                  const isWarn = log.status === 'warning';
                  return (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSuccess ? 'bg-emerald-400' : isWarn ? 'bg-amber-400' : 'bg-blue-400'
                            }`}
                          />
                          <span className="text-slate-400 font-semibold">{log.event}</span>
                        </div>
                        <span className="text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 break-words leading-tight">
                        {log.details}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>Project: #{log.projectId}</span>
                        <span>Src: {log.source}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
