import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Box, Radio, ShieldCheck, Sparkles, BookOpen, FileCode2, ArrowRight, Smartphone, Cpu, Send, Building, Radar } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          const btn = document.getElementById('cmd-palette-btn');
          if (btn) btn.click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { title: 'Board Governance & Owner Audit', category: 'Governance', tabId: 'board-audit', icon: Building, desc: 'board_owner_audit.py: 20-project cohorts, Headmaster grading & board directives' },
    { title: 'Mostaql Scout Daemon & Monitor', category: 'Scout', tabId: 'scout-daemon', icon: Radar, desc: 'monitor.py: Stealth randomized polling, smart rate limiter & Gemini AI proposals' },
    { title: 'Factory Control Room (SQLite Vault)', category: 'Factory', tabId: 'factory-room', icon: Cpu, desc: 'factory_engine.py: Zero-emoji guard, Pixel 6 CI harness & ephemeral sandbox' },
    { title: 'Mobile Preview Shell (Master Shell)', category: 'Simulator', tabId: 'simulator', icon: Smartphone, desc: 'Interactive iPhone/Pixel frame with 2KB JSON specs & RTL Arabic' },
    { title: 'Blueprint Generator', category: 'Tool', tabId: 'generator', icon: Layers, desc: 'Customize and export KMP/Android/iOS/Web repository bundles' },
    { title: 'Architecture Composer', category: 'Composer', tabId: 'composer', icon: Layers, desc: 'Organize feature modules and generate AppModule.kt & NavHost' },
    { title: 'API Tester & Acquirer', category: 'API', tabId: 'api-tester', icon: Send, desc: 'Test live endpoints and acquire telemetry with Ktor/React code' },
    { title: 'Hardware, Battery & BLE Scales', category: 'Sensors', tabId: 'sensors', icon: Radio, desc: 'expect/actual battery, BLE weight scales, and infrared' },
    { title: 'Code Rosetta Stone', category: 'Tool', tabId: 'rosetta', icon: ArrowRight, desc: 'Compare React 19, Compose KMP, and SwiftUI side-by-side' },
    { title: 'KMP Architecture Graph', category: 'Architecture', tabId: 'module-graph', icon: Layers, desc: 'Interactive visual module graph of commonMain to native targets' },
    { title: 'Google Filament 3D Engine', category: '3D Graphics', tabId: 'filament', icon: Box, desc: 'JNI memory simulator, SurfaceView vs TextureView' },
    { title: 'Dependency Auditor', category: 'Quality', tabId: 'auditor', icon: ShieldCheck, desc: 'Scan gradle configs and auto-fix banned reflection bloatware' },
    { title: 'Engineering Rules & Constitution', category: 'Standards', tabId: 'rules', icon: BookOpen, desc: 'Zero-emoji rules, anti-AI slop, and latency budgets' },
    { title: 'Vector & SVG Studio', category: 'Graphics', tabId: 'vector-studio', icon: Sparkles, desc: 'Interactive drawn SVG path lab with zero emojis' },
    { title: 'Multi-Schema Inspector', category: 'Schemas', tabId: 'schemas', icon: FileCode2, desc: 'JSON, YAML, TOML, Properties, and Markdown live viewer' },
    { title: 'Standards Exporter (.md)', category: 'Docs', tabId: 'standards', icon: FileCode2, desc: 'Export unified ENGINEERING_STANDARDS.md and .cursorrules' },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-4 pt-20 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search commands, board audit, scout daemon, or rules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching commands or tools found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => {
                    onNavigateTab(item.tabId);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-blue-600/10 hover:border-blue-500/30 border border-transparent text-left flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-950/60 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press ESC to close</span>
          <span className="font-mono">⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  );
};
