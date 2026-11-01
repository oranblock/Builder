import React, { useState, useEffect } from 'react';
import {
  Scale,
  ShieldAlert,
  Sparkles,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  GitBranch,
  Radio,
  Layers,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Sliders,
  Send,
  Smartphone,
  Eye,
  Check,
  Zap
} from 'lucide-react';
import { realFactoryProjects, UniversalAppSpec } from '../../data/factoryProjectsData';

export interface PeerJudgeArenaProps {
  onLoadInSimulator?: (spec: UniversalAppSpec) => void;
  onNavigateToSimulator?: () => void;
}

interface PeerReviewResult {
  project_id: string;
  app_name: string;
  grade: string;
  verdict: string;
  composite_score: number;
  pillars: {
    novelty_anti_duplication: number;
    architectural_depth: number;
    hardware_driver_depth: number;
    wcag_and_vector_purity: number;
    commercial_arabic_prestige: number;
  };
  critique_points: string[];
  mutations_suggested: string[];
  judge_name: string;
  timestamp: string;
}

interface LearningVault {
  version: string;
  total_peer_reviews: number;
  evolution_velocity: string;
  rejection_rate: string;
  forbidden_clone_patterns: string[];
  approved_innovations: string[];
  peer_judges: Array<{ name: string; specialty: string; strictness: number }>;
  recent_debates: Array<{
    timestamp: string;
    project_id: string;
    app_name: string;
    grade: string;
    verdict: string;
    score: number;
    critique: string[];
  }>;
}

export const PeerJudgeArena: React.FC<PeerJudgeArenaProps> = ({
  onLoadInSimulator,
  onNavigateToSimulator
}) => {
  const [projects, setProjects] = useState<UniversalAppSpec[]>(realFactoryProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(realFactoryProjects[0]?.project_id || '1271101');
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<PeerReviewResult | null>(null);
  const [vault, setVault] = useState<LearningVault | null>(null);
  const [activeTab, setActiveTab] = useState<'court' | 'vault' | 'judges'>('court');
  const [mutationSuccess, setMutationSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentProject = projects.find((p) => p.project_id === selectedProjectId) || projects[0];

  // Fetch learning vault data from backend
  const fetchVault = async () => {
    try {
      const res = await fetch('/api/agent/learning-vault');
      if (res.ok) {
        const data = await res.json();
        setVault(data);
      }
    } catch (err) {
      console.error('Failed to load learning vault:', err);
    }
  };

  // Run Peer Review via API
  const handleRunPeerReview = async (projId: string) => {
    setLoading(true);
    setMutationSuccess(false);
    try {
      const target = projects.find((p) => p.project_id === projId) || currentProject;
      const res = await fetch('/api/agent/peer-judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: projId, spec: target })
      });
      if (res.ok) {
        const data = await res.json();
        setReviewResult(data);
        triggerToast(`اكتملت محاكمة الوكيل! النتيجة: ${data.grade} (${data.composite_score}/100)`);
        fetchVault();
      }
    } catch (err) {
      console.error('Peer review failed:', err);
      triggerToast('حدث خطأ أثناء إجراء المحاكمة بين الوكلاء');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Evolutionary Mutation
  const handleTriggerMutation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent/mutate-novelty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProjectId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.mutatedSpec) {
          setProjects((prev) =>
            prev.map((p) => (p.project_id === selectedProjectId ? data.mutatedSpec : p))
          );
          setMutationSuccess(true);
          triggerToast('تم تطبيق طفرة تطورية مضادة للتكرار بنجاح!');
          // Re-run review on mutated spec
          handleRunPeerReview(selectedProjectId);
        }
      }
    } catch (err) {
      console.error('Mutation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
    handleRunPeerReview(selectedProjectId);
  }, [selectedProjectId]);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'B':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-medium shadow-xl shadow-blue-600/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner: Core Tenet */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-900/40 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>محكمة تحكيم الوكلاء وبنك التعلم التراكمي</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    AI Peer-Judge Arena v3.0
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  دع نماذج الذكاء الاصطناعي تحكم على بعضها وتتعلم ذاتياً لمنع التكرار نهائياً (Let AI learn & be judged by each other)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">إجمالي المحاكمات</span>
              <span className="text-sm font-bold font-mono text-indigo-400">{vault?.total_peer_reviews || 48}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">معدل رفض التكرار</span>
              <span className="text-sm font-bold font-mono text-rose-400">{vault?.rejection_rate || '16.8%'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">سرعة التطور الذاتي</span>
              <span className="text-sm font-bold font-mono text-emerald-400">نشطة (Auto)</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('court')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'court'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>ساحة التحكيم المباشرة (Agent vs Agent)</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>بنك التعلم التراكمي (The Learning Vault)</span>
          </button>

          <button
            onClick={() => setActiveTab('judges')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'judges'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>هيئة الحكام الناقدين (Adversary Critics)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'court' && (
        <div className="space-y-6">
          {/* Project Selector Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">اختر مشروعاً لمحاكمته:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
              >
                {projects.map((p) => (
                  <option key={p.project_id} value={p.project_id}>
                    #{p.project_id} — {p.app_name} ({(p as any).layoutArchetype || p.layout_type})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRunPeerReview(selectedProjectId)}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>إعادة تحكيم التطبيق</span>
              </button>

              <button
                onClick={handleTriggerMutation}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>إطلاق طفرة تطورية (Auto-Mutate)</span>
              </button>

              {onLoadInSimulator && (
                <button
                  onClick={() => {
                    onLoadInSimulator(currentProject);
                    onNavigateToSimulator?.();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>محاكاة الجوال</span>
                </button>
              )}
            </div>
          </div>

          {/* Adversarial Dual Cards: Agent Creator vs Agent Judge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Agent Synthesizer (The Creator) */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">الوكيل المطور (Agent Alpha - Creator)</h3>
                    <p className="text-[11px] text-slate-400">بناء النموذج وتوليد الكود المصدري الأصيل</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                  Target Spec #{currentProject.project_id}
                </span>
              </div>

              {/* Spec Summary */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 block">اسم التطبيق ومجال العمل:</span>
                  <h4 className="text-xs font-bold text-white">{currentProject.app_name}</h4>
                  <p className="text-[11px] text-slate-300">{currentProject.tagline}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">الهيكل التجاري (Archetype):</span>
                    <span className="font-mono font-bold text-indigo-300">
                      {(currentProject as any).layoutArchetype || currentProject.layout_type || 'services'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">اللون الرئيسي والتوافق:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: currentProject.theme?.primary_color || '#0f766e' }}
                      ></span>
                      <span className="font-mono text-[11px] text-slate-200">
                        {currentProject.theme?.primary_color || '#0f766e'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Peripherals */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 block">المجسات والعتاد المربوط:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(((currentProject as any).sensors as Array<{ label: string }>) || []).map((s: { label: string }, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 text-teal-300 border border-teal-800/40 flex items-center gap-1"
                      >
                        <Radio className="w-2.5 h-2.5 text-teal-400" />
                        <span>{s.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 block">التصنيفات والخدمات:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProject.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Agent Critic (The Adversary Judge) */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">الوكيل الناقد الحاكم (Agent Beta - Critic)</h3>
                    <p className="text-[11px] text-slate-400">فحص الفرادة ومقاومة التكرار والتدقيق الجنائي</p>
                  </div>
                </div>
                {reviewResult && (
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${getGradeBadge(reviewResult.grade)}`}>
                    الدرجة: {reviewResult.grade} ({reviewResult.composite_score}/100)
                  </span>
                )}
              </div>

              {/* Review Score & Verdict */}
              {reviewResult ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">الحكم الصادر (Verdict):</span>
                      <h4 className="text-xs font-bold text-white font-mono">{reviewResult.verdict}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {reviewResult.judge_name}
                    </span>
                  </div>

                  {/* 5-Pillar Score Bars */}
                  <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 block mb-2">أركان التدقيق الخمسة:</span>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-300">الفرادة ومقاومة التكرار (Anti-Duplication)</span>
                        <span className="font-mono font-bold text-indigo-400">{reviewResult.pillars.novelty_anti_duplication}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${reviewResult.pillars.novelty_anti_duplication}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-300">العمق المعماري والكيانات (Architecture)</span>
                        <span className="font-mono font-bold text-emerald-400">{reviewResult.pillars.architectural_depth}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${reviewResult.pillars.architectural_depth}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-300">عمق ربط العتاد والمجسات (Hardware Drivers)</span>
                        <span className="font-mono font-bold text-teal-400">{reviewResult.pillars.hardware_driver_depth}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-teal-500 h-1.5 rounded-full"
                          style={{ width: `${reviewResult.pillars.hardware_driver_depth}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-300">التباين WCAG AAA ونقاء الفيكتور</span>
                        <span className="font-mono font-bold text-amber-400">{reviewResult.pillars.wcag_and_vector_purity}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${reviewResult.pillars.wcag_and_vector_purity}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-300">المكانة التجارية والصياغة السعودية</span>
                        <span className="font-mono font-bold text-sky-400">{reviewResult.pillars.commercial_arabic_prestige}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-sky-500 h-1.5 rounded-full"
                          style={{ width: `${reviewResult.pillars.commercial_arabic_prestige}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Critic Notes & Mutation Instructions */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block">ملاحظات الناقد وأوامر التعديل:</span>
                    <div className="space-y-1.5">
                      {reviewResult.critique_points.map((cp, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{cp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  انقر على "إعادة تحكيم التطبيق" لبدء المحاكمة التنافسية بين الوكلاء.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: The Collective Learning Vault */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forbidden Patterns (Blacklist learned from rejections) */}
            <div className="rounded-2xl bg-slate-900/60 border border-rose-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-900/30">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold text-rose-200">
                    القائمة السوداء للأنماط المكررة المحظورة (Forbidden Patterns)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                  {vault?.forbidden_clone_patterns.length || 5} أنماط محظورة
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                أنماط تصميمية تم حظرها نهائياً بواسطة حكام الذكاء الاصطناعي بعد اكتشاف تشابهها وتكرارها بين التطبيقات:
              </p>
              <div className="space-y-2">
                {(vault?.forbidden_clone_patterns || []).map((pat, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-rose-950/80 text-[11px] text-rose-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                    <span>{pat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approved Breakthroughs */}
            <div className="rounded-2xl bg-slate-900/60 border border-emerald-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-emerald-200">
                    بنك الابتكارات المعتمدة للوكلاء (Approved Innovations)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {vault?.approved_innovations.length || 5} ابتكارات مسجلة
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                حلول معمارية وهياكل بصرية حصلت على درجات امتياز A+ وتعتمدها شبكة الوكلاء كمرجع للفرادة:
              </p>
              <div className="space-y-2">
                {(vault?.approved_innovations || []).map((inn, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-emerald-950/80 text-[11px] text-emerald-300 flex items-start gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{inn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Debates Ledger */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>سجل المناظرات والمحاكمات الحديثة بين الوكلاء</span>
            </h3>
            <div className="divide-y divide-slate-800/80">
              {(vault?.recent_debates || []).slice(0, 5).map((deb, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">#{deb.project_id} — {deb.app_name}</span>
                    <span className="text-[10px] text-slate-400">{deb.critique?.[0]}</span>
                  </div>
                  <div className="text-left font-mono">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getGradeBadge(deb.grade)}`}>
                      {deb.grade} ({deb.score}/100)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: The Board of Peer Judges */}
      {activeTab === 'judges' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(vault?.peer_judges || []).map((j, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{j.name}</h4>
                  <p className="text-[10px] text-slate-400">{j.specialty}</p>
                </div>
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">مستوى الصرامة التنافسية:</span>
                  <span className="font-mono text-indigo-300 font-bold">{Math.round(j.strictness * 100)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${j.strictness * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                يقوم هذا الوكيل بمراجعة مستقلة لقرارات النماذج الأخرى وإعطاء أوامر الطفرات التطورية عند اكتشاف أي تشابه.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
