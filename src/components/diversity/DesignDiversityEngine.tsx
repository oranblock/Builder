import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Send,
  Terminal,
  ArrowRight,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { computeDesignFormula, DesignFormula } from '../../data/designFormulaEngine';
import { realFactoryProjects } from '../../data/factoryProjectsData';
import { downloadSingleFile } from '../../lib/zipExport';

export const DesignDiversityEngine: React.FC = () => {
  const [projectIdInput, setProjectIdInput] = useState<string>('1265226');
  const [nicheInput, setNicheInput] = useState<string>('plumbing-electrician-services');
  const [presetInput, setPresetInput] = useState<string>('services');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedApi, setCopiedApi] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  const formula: DesignFormula = computeDesignFormula(
    projectIdInput || 'sample',
    nicheInput || 'general',
    presetInput || 'standard'
  );

  const handleSelectProject = (id: string, slug: string, preset: string) => {
    setProjectIdInput(id);
    setNicheInput(slug);
    setPresetInput(preset);
    setApiResult(null);
  };

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(JSON.stringify(formula, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiCurlCommand = `curl -s "https://ais-dev-hto6buturczakmvduyserx-289769545294.europe-west2.run.app/api/design-formula?project_id=${projectIdInput}&niche=${nicheInput}&preset=${presetInput}"`;

  const agentPromptSnippet = `# INSTRUCTION FOR AI AGENTS (SENSEI NOVELTY DIRECTIVE):
Before writing any UI code or JSON specs, query the Design Diversity API:
  ${apiCurlCommand}

Strict Non-Negotiables:
1. Adhere strictly to the returned 'layoutArchetype': do NOT revert to default vertical cards.
2. Apply the exact 60-30-10 palette: canvas (${formula.colorHarmonics.canvas60}), surface (${formula.colorHarmonics.surface30}), accent (${formula.colorHarmonics.accent10}).
3. Zero Emojis & Zero Static Pills: Render metadata as quiet unboxed text (·, /).
4. Settle motion within ${formula.motionSignature.durationMs}ms using ${formula.motionSignature.easingCurve}.`;

  const handleCopyAgentPrompt = () => {
    navigator.clipboard.writeText(agentPromptSnippet);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  const handleTestApiCall = () => {
    setApiResult(JSON.stringify(formula, null, 2));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Anti-Duplication & Explicit Design Formula Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Eliminates repetitive AI design clones. Deterministically computes distinct layout archetypes, 60-30-10 color harmonics, and typographic pairings for your swarm agents.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAgentPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
          >
            {copiedApi ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Agent Directive</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Agent API Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Parameters Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-200">
            Formula Parameter Inputs (Or Pick a Real Project):
          </span>

          {/* Quick preset picks */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {realFactoryProjects.map((p) => (
              <button
                key={p.project_id}
                onClick={() => handleSelectProject(p.project_id, p.app_name.split('—')[0].trim(), p.preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-colors border ${
                  projectIdInput === p.project_id
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                #{p.project_id}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Project ID</label>
            <input
              type="text"
              value={projectIdInput}
              onChange={(e) => setProjectIdInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              placeholder="e.g. 1289281"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Niche Slug</label>
            <input
              type="text"
              value={nicheInput}
              onChange={(e) => setNicheInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              placeholder="e.g. desert-navigation"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Preset Category</label>
            <select
              value={presetInput}
              onChange={(e) => setPresetInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="services">services</option>
              <option value="ecommerce">ecommerce</option>
              <option value="standard">standard</option>
              <option value="food">food / restaurant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Computed Formula Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Layout Archetype */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">1. Layout Archetype</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-blue-400">
            {formula.layoutArchetype.name}
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {formula.layoutArchetype.description}
          </p>
          <div className="pt-1 text-[10px] font-mono text-slate-500 truncate">
            {formula.layoutArchetype.gridStructure}
          </div>
        </div>

        {/* Color Harmonics */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">2. 60-30-10 Colors</span>
            <Palette className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400">
            {formula.colorHarmonics.name}
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1.5 pt-1">
            <div
              className="w-6 h-6 rounded-md border border-slate-700"
              style={{ backgroundColor: formula.colorHarmonics.canvas60 }}
              title={`Canvas 60%: ${formula.colorHarmonics.canvas60}`}
            />
            <div
              className="w-6 h-6 rounded-md border border-slate-700"
              style={{ backgroundColor: formula.colorHarmonics.surface30 }}
              title={`Surface 30%: ${formula.colorHarmonics.surface30}`}
            />
            <div
              className="w-6 h-6 rounded-md border border-slate-700"
              style={{ backgroundColor: formula.colorHarmonics.accent10 }}
              title={`Accent 10%: ${formula.colorHarmonics.accent10}`}
            />
            {formula.colorHarmonics.secondaryAccent && (
              <div
                className="w-6 h-6 rounded-md border border-slate-700"
                style={{ backgroundColor: formula.colorHarmonics.secondaryAccent }}
                title={`Secondary: ${formula.colorHarmonics.secondaryAccent}`}
              />
            )}
          </div>
          <p className="text-[10px] font-mono text-slate-400">
            Contrast: {formula.colorHarmonics.contrastRatio}
          </p>
        </div>

        {/* Typography Pairing */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">3. Typography</span>
            <Type className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-purple-300">
            {formula.typographyPairing.name.split('+')[0]}
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Display: {formula.typographyPairing.displayFace}
          </p>
          <p className="text-[10px] font-mono text-slate-500">
            Body: {formula.typographyPairing.bodyFace}
          </p>
        </div>

        {/* Uniqueness & Proof */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">4. Collision Defense</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold font-mono text-amber-300">
            {((1 - formula.antiDuplicateProof.structuralCollisionScore) * 100).toFixed(0)}% Unique
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {formula.antiDuplicateProof.dHashVariance}
          </p>
          <div className="pt-1 text-[10px] font-mono text-emerald-400 truncate">
            {formula.antiDuplicateProof.uniquenessCertificate}
          </div>
        </div>
      </div>

      {/* Agent API Endpoint & Integration Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Endpoint & cURL Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Real Agent API Endpoint (HTTP GET)</span>
              </span>

              <button
                onClick={handleTestApiCall}
                className="px-2.5 py-1 rounded text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Test Endpoint
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto select-all">
              <code>{apiCurlCommand}</code>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              When your swarm agents (Maestro, "Little Dude", or Claude) build an app, they make this single HTTP GET request. The server returns the mathematical formula parameters above so the agent NEVER generates identical layouts.
            </p>
          </div>

          {/* System Prompt Instruction for Agents */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Agent System Directive (Sensei Rule)</span>
              </span>

              <button
                onClick={handleCopyAgentPrompt}
                className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
              >
                {copiedApi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Directive</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
              {agentPromptSnippet}
            </div>
          </div>
        </div>

        {/* Right: Full JSON API Response Payload */}
        <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden min-h-[460px]">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-200">
                GET /api/design-formula (Response Payload)
              </span>
            </div>

            <button
              onClick={handleCopyFormula}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
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
          </div>

          <div className="flex-1 p-5 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed text-slate-300 select-text">
            <pre className="whitespace-pre-wrap text-emerald-300">
              <code>{JSON.stringify(formula, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
