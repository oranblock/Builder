import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { librariesData } from '../../data/librariesData';
import { PlatformTarget } from '../../types';

export const DependencyInspector: React.FC = () => {
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = librariesData.filter((lib) => {
    const matchesPlatform = filterPlatform === 'all' || lib.platform === filterPlatform;
    const matchesSearch =
      lib.name.toLowerCase().includes(search.toLowerCase()) ||
      lib.category.toLowerCase().includes(search.toLowerCase()) ||
      lib.expenseReason.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const recommendedLibs = filtered.filter((lib) => lib.status === 'recommended');
  const avoidLibs = filtered.filter((lib) => lib.status === 'avoid');

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search libraries (e.g. Gson, Room, Motion, Moment, Coil, RxSwift)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'web', 'kmp', 'android', 'ios'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase font-mono transition-colors ${
                filterPlatform === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Recommended Stack vs Bloatware to Avoid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Libraries Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-400">
              Modern Recommended Standards ({recommendedLibs.length})
            </h2>
          </div>

          <div className="space-y-3">
            {recommendedLibs.map((lib) => (
              <div
                key={lib.name}
                className="rounded-xl border border-emerald-950/50 bg-emerald-950/10 p-4 space-y-2.5 hover:border-emerald-800/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-emerald-300">
                    {lib.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {lib.recommendedVersion && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800/40">
                        {lib.recommendedVersion}
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                      {lib.platform}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lib.expenseReason}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {lib.benefits.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/20 text-emerald-300/80 border border-emerald-800/30"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid / Expenses Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <XCircle className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-red-400">
              Expensive Dependencies to Avoid ({avoidLibs.length})
            </h2>
          </div>

          <div className="space-y-3">
            {avoidLibs.map((lib) => (
              <div
                key={lib.name}
                className="rounded-xl border border-red-950/50 bg-red-950/10 p-4 space-y-2.5 hover:border-red-800/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-red-300 line-through decoration-red-500/60">
                    {lib.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                    {lib.platform}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {lib.expenseReason}
                </p>

                {lib.modernAlternative && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 pt-1">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>Replace with: <strong className="text-emerald-300">{lib.modernAlternative}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
