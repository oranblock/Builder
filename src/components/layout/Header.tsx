import React from 'react';
import { Download, Layers, ShieldCheck, Cpu } from 'lucide-react';
import { GeneratorOptions } from '../../types';

interface HeaderProps {
  options: GeneratorOptions;
  onExportBundle: () => void;
  isExporting: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  options,
  onExportBundle,
  isExporting,
  activeTab,
  onTabChange,
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
              Zero-Emoji · Animated Vectors · TOML Catalogs · Filament & Shader Rules
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExportBundle}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
            title="Download full project blueprint as ZIP with all configured files"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Packaging ZIP...' : 'Save Repository Bundle (.zip)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
