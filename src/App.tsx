import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { NavigationTabs } from './components/layout/NavigationTabs';
import { BlueprintGenerator } from './components/generator/BlueprintGenerator';
import { FilamentVisualizer } from './components/filament/FilamentVisualizer';
import { RulesExplorer } from './components/rules/RulesExplorer';
import { DependencyInspector } from './components/libraries/DependencyInspector';
import { VectorStudio } from './components/vector/VectorStudio';
import { SchemaViewer } from './components/schema/SchemaViewer';
import { StandardsExporter } from './components/standards/StandardsExporter';
import { GeneratorOptions } from './types';
import { templateFiles } from './data/templatesData';
import { downloadProjectZip } from './lib/zipExport';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [options, setOptions] = useState<GeneratorOptions>({
    projectName: 'MultiplatformApp',
    packageName: 'com.example.multiplatform',
    targetPlatforms: ['kmp', 'android', 'ios'],
    includeFilament: true,
    includeAgslShaders: true,
    includeRoomKmp: true,
    includeKtor: true,
    includeCiWorkflow: true,
    includeLinterConfigs: true,
    includeStrictZeroEmoji: true,
    versionCatalogEnabled: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportBundle = async () => {
    setIsExporting(true);
    try {
      await downloadProjectZip(templateFiles, options);
      showToast('Repository blueprint bundle downloaded as ZIP!');
    } catch (err) {
      console.error(err);
      showToast('Failed to create bundle ZIP');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-medium shadow-xl shadow-blue-600/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Bar */}
      <Header
        options={options}
        onExportBundle={handleExportBundle}
        isExporting={isExporting}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Sub-Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'generator' && (
          <BlueprintGenerator options={options} onOptionsChange={setOptions} />
        )}
        {activeTab === 'filament' && <FilamentVisualizer />}
        {activeTab === 'rules' && <RulesExplorer />}
        {activeTab === 'dependencies' && <DependencyInspector />}
        {activeTab === 'vector-studio' && <VectorStudio />}
        {activeTab === 'schemas' && <SchemaViewer options={options} />}
        {activeTab === 'standards' && <StandardsExporter options={options} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 px-6 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-slate-400">
              Multiplatform Standards Engine
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero-Emoji Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Filament 3D & JNI Safety</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Kotlin 2.x</span>
            <span>·</span>
            <span>Swift 6</span>
            <span>·</span>
            <span>React 19</span>
            <span>·</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
