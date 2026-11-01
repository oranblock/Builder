import React from 'react';
import { Download, Layers, ShieldCheck, Cpu, Search, Command } from 'lucide-react';
import { GeneratorOptions } from '../../types';

interface HeaderProps {
  options: GeneratorOptions;
  onExportBundle: () => void;
  isExporting: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  options,
  onExportBundle,
  isExporting,
  activeTab,
  onTabChange,
  onOpenCommandPalette,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-slate-100">
                Multiplatform Standards Engine
              </h1>
              <span className="text-xs px-2 py-0.5 rounded text-blue-400 bg-blue-950/60 border border-blue-800/50 font-mono">
                KMP · Compose · iOS · Web
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Hardware Sensors · Filament 3D · Zero-Emoji · Rosetta Stone · TOML Catalogs
            </p>
          </div>
        </div>

        {/* Quick Search & Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            id="cmd-palette-btn"
            onClick={onOpenCommandPalette}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Search commands, sensors, or rules (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Quick Search</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onExportBundle}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
            title="Download full project blueprint as ZIP with all configured files"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Packaging ZIP...' : 'Save Bundle (.zip)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
