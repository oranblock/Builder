import React, { useState } from 'react';
import { Search, BookOpen, Check, Copy, AlertTriangle, ShieldCheck, Tag, Code2 } from 'lucide-react';
import { rulesCategories } from '../../data/rulesData';
import { RuleItem } from '../../types';

export const RulesExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allRules: RuleItem[] = rulesCategories.flatMap((c) => c.rules);

  const filteredRules = allRules.filter((rule) => {
    const matchesSearch =
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    const cat = rulesCategories.find((c) => c.id === selectedCategory);
    return cat ? cat.rules.some((r) => r.id === rule.id) : true;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules, Filament JNI, zero-emoji, shaders, memory, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Categories ({allRules.length})
          </button>
          {rulesCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.title.split(' ')[0]} ({cat.rules.length})
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 gap-5">
        {filteredRules.map((rule) => {
          const isMandatory = rule.level === 'mandatory';
          return (
            <div
              key={rule.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono uppercase px-2 py-0.5 rounded border ${
                      isMandatory
                        ? 'bg-amber-950/40 text-amber-400 border-amber-800/50'
                        : 'bg-blue-950/40 text-blue-400 border-blue-800/50'
                    }`}
                  >
                    {isMandatory ? (
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                    )}
                    <span>{rule.level}</span>
                  </span>
                  <h3 className="text-sm font-semibold text-slate-100">{rule.title}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {rule.platform.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Summary and Details */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-300">{rule.summary}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{rule.details}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {rule.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              {/* Bad vs Good Code Snippet */}
              {rule.codeSnippet && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {rule.codeSnippet.badCode && (
                    <div className="rounded-lg border border-red-950/60 bg-red-950/10 p-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-red-400 font-mono font-medium">
                        <span>❌ Anti-Pattern (Avoid)</span>
                      </div>
                      <pre className="text-xs font-mono text-red-300/90 overflow-x-auto whitespace-pre-wrap">
                        <code>{rule.codeSnippet.badCode}</code>
                      </pre>
                    </div>
                  )}

                  <div className="rounded-lg border border-emerald-950/60 bg-emerald-950/10 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono font-medium">
                      <span>✅ Recommended Standard</span>
                      <button
                        onClick={() =>
                          handleCopyCode(rule.id, rule.codeSnippet!.goodCode)
                        }
                        className="hover:text-emerald-300 transition-colors"
                        title="Copy code"
                      >
                        {copiedId === rule.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-emerald-300/90 overflow-x-auto whitespace-pre-wrap">
                      <code>{rule.codeSnippet.goodCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
