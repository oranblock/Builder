import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

interface AuditFinding {
  id: string;
  type: 'banned-dependency' | 'missing-flag' | 'emoji-detected' | 'legacy-pattern';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestedFix: string;
}

export const DependencyAuditor: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>(`// Sample gradle/libs.versions.toml snippet
[versions]
gson = "2.10.1"
rxjava = "3.1.5"
moment = "2.29.4"
framer-motion = "10.16.4"

[libraries]
google-gson = { module = "com.google.code.gson:gson", version.ref = "gson" }
rxjava3 = { module = "io.reactivex.rxjava3:rxjava", version.ref = "rxjava" }

// Button label with emoji:
// val title = "🚀 Deploy Now 🎉"
`);

  const [copied, setCopied] = useState<boolean>(false);

  // Analyze code for issues
  const analyzeCode = (code: string): AuditFinding[] => {
    const findings: AuditFinding[] = [];
    const lower = code.toLowerCase();

    if (lower.includes('gson')) {
      findings.push({
        id: 'gson-detected',
        type: 'banned-dependency',
        severity: 'critical',
        title: 'Gson Dependency Detected',
        description: 'Gson uses runtime reflection which breaks R8/ProGuard minification, slows cold start, and fails in KMP/iOS.',
        suggestedFix: 'Replace with kotlinx.serialization (compiler plugin, zero reflection, native KMP).',
      });
    }

    if (lower.includes('rxjava') || lower.includes('rxkotlin') || lower.includes('rxswift')) {
      findings.push({
        id: 'rx-detected',
        type: 'banned-dependency',
        severity: 'critical',
        title: 'ReactiveX (RxJava/RxSwift) Detected',
        description: 'Rx libraries add massive binary overhead and redundant operator chains that duplicate language-native coroutines.',
        suggestedFix: 'Replace with native Kotlin Coroutines & Flow (or Swift Concurrency / AsyncStream).',
      });
    }

    if (lower.includes('moment')) {
      findings.push({
        id: 'moment-detected',
        type: 'banned-dependency',
        severity: 'critical',
        title: 'moment.js Detected',
        description: 'moment.js is >300KB, mutable, and deprecated by its own maintainers.',
        suggestedFix: 'Replace with native ECMAScript Intl.DateTimeFormat or date-fns v4.',
      });
    }

    if (lower.includes('framer-motion')) {
      findings.push({
        id: 'framer-motion-legacy',
        type: 'legacy-pattern',
        severity: 'warning',
        title: 'Legacy framer-motion Detected',
        description: 'framer-motion (v10/v11) contains legacy polyfills and larger bundle sizes.',
        suggestedFix: 'Upgrade to modern motion (Motion for React v12+).',
      });
    }

    if (lower.includes('styled-components') || lower.includes('@emotion')) {
      findings.push({
        id: 'runtime-css',
        type: 'banned-dependency',
        severity: 'warning',
        title: 'Runtime CSS-in-JS Detected',
        description: 'Injects <style> tags on the client main thread during execution, causing interaction latency.',
        suggestedFix: 'Migrate to Tailwind CSS v4 for zero-runtime compiled CSS cascades.',
      });
    }

    // Emoji detection regex
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
    if (emojiRegex.test(code)) {
      findings.push({
        id: 'emoji-found',
        type: 'emoji-detected',
        severity: 'warning',
        title: 'Emoji UI Markers Detected',
        description: 'Emojis violate zero-emoji production standards and render inconsistently across mobile operating systems.',
        suggestedFix: 'Replace emojis with Lucide SVG vector icons or Compose Canvas paths.',
      });
    }

    return findings;
  };

  const findings = analyzeCode(inputCode);
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const warningCount = findings.filter((f) => f.severity === 'warning').length;

  const healthScore = Math.max(0, 100 - criticalCount * 30 - warningCount * 15);

  const handleAutoFix = () => {
    let fixed = inputCode;
    // Replace gson with kotlinx-serialization
    fixed = fixed.replace(/gson = ".*"/g, 'serialization = "1.8.0"');
    fixed = fixed.replace(/google-gson = {.*}/g, 'kotlinx-serialization = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "serialization" }');
    // Replace rxjava with coroutines
    fixed = fixed.replace(/rxjava = ".*"/g, 'coroutines = "1.10.1"');
    fixed = fixed.replace(/rxjava3 = {.*}/g, 'kotlinx-coroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }');
    // Replace moment with date-fns
    fixed = fixed.replace(/moment = ".*"/g, 'date-fns = "^4.1.0"');
    // Replace framer-motion with motion
    fixed = fixed.replace(/framer-motion = ".*"/g, 'motion = "^12.23.0"');
    // Strip emojis
    fixed = fixed.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu, '');
    setInputCode(fixed);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Automated Dependency & Anti-Pattern Auditor
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Paste your gradle configuration, TOML catalog, or package.json to detect banned bloatware and zero-emoji violations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">Repo Health Score:</span>
            <span
              className={`text-xs font-mono font-bold ${
                healthScore >= 80
                  ? 'text-emerald-400'
                  : healthScore >= 50
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {healthScore} / 100
            </span>
          </div>

          <button
            onClick={handleAutoFix}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Auto-Fix</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Input Area */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-300">
              Input Code (Paste libs.versions.toml, build.gradle, or JSON)
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 w-full min-h-[380px] p-4 bg-slate-950 font-mono text-xs text-slate-200 border-none focus:outline-none leading-relaxed resize-none"
            placeholder="Paste TOML or gradle dependencies here..."
          />
        </div>

        {/* Audit Results / Findings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-1 border-b border-slate-800">
            <span>Audit Findings ({findings.length})</span>
            <span className="text-[11px] text-slate-500 font-mono">
              {criticalCount} critical · {warningCount} warnings
            </span>
          </div>

          {findings.length === 0 ? (
            <div className="rounded-xl border border-emerald-950/60 bg-emerald-950/15 p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-semibold text-emerald-300">Zero Anti-Patterns Found</h3>
              <p className="text-xs text-slate-400">
                Your configuration adheres to clean architecture, zero reflection, and zero-emoji standards!
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
              {findings.map((finding) => (
                <div
                  key={finding.id}
                  className={`rounded-xl border p-4 space-y-2 transition-all ${
                    finding.severity === 'critical'
                      ? 'border-red-950/60 bg-red-950/15'
                      : 'border-amber-950/60 bg-amber-950/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        finding.severity === 'critical' ? 'text-red-300' : 'text-amber-300'
                      }`}
                    >
                      {finding.title}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        finding.severity === 'critical'
                          ? 'bg-red-950 text-red-400 border-red-800/40'
                          : 'bg-amber-950 text-amber-400 border-amber-800/40'
                      }`}
                    >
                      {finding.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {finding.description}
                  </p>

                  <div className="flex items-start gap-1.5 pt-1 text-xs text-emerald-400 font-medium">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
                    <span>Fix: {finding.suggestedFix}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
