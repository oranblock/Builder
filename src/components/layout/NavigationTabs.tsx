import React from 'react';
import {
  Layers,
  Box,
  GitBranch,
  ShieldCheck,
  BookOpen,
  ShieldAlert,
  Sparkles,
  FileCode2,
  BookMarked,
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'generator', label: 'Blueprint Generator', icon: Layers },
    { id: 'module-graph', label: 'KMP Architecture Graph', icon: GitBranch },
    { id: 'filament', label: 'Filament 3D Engine', icon: Box },
    { id: 'auditor', label: 'Dependency Auditor', icon: ShieldCheck },
    { id: 'rules', label: 'Engineering Rules', icon: BookOpen },
    { id: 'dependencies', label: 'Library Matrix', icon: ShieldAlert },
    { id: 'vector-studio', label: 'Vector & SVG Studio', icon: Sparkles },
    { id: 'schemas', label: 'Schema Inspector', icon: FileCode2 },
    { id: 'standards', label: 'Standards Exporter', icon: BookMarked },
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-900/40 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
