import React, { useState } from 'react';
import {
  Layers,
  Box,
  Radio,
  Database,
  Wifi,
  Sparkles,
  Copy,
  Check,
  Plus,
  Trash2,
  Settings2,
  FolderTree,
} from 'lucide-react';

interface FeatureModule {
  id: string;
  name: string;
  layer: 'presentation' | 'domain' | 'data' | 'core';
  icon: any;
  description: string;
  enabled: boolean;
  diDeclaration: string;
  navRoute?: string;
}

export const ArchitectureComposer: React.FC = () => {
  const [features, setFeatures] = useState<FeatureModule[]>([
    {
      id: 'feature-viewport3d',
      name: '3D Filament Viewport',
      layer: 'presentation',
      icon: Box,
      description: 'Filament PBR rendering with SurfaceView hardware overlay and leak-free DisposableEffect lifecycle.',
      enabled: true,
      diDeclaration: 'single { FilamentModelViewerProvider(get()) }',
      navRoute: 'composable("viewport3d") { FilamentViewportScreen(get()) }'
    },
    {
      id: 'feature-sensors',
      name: 'Hardware Sensors & BLE Scale',
      layer: 'data',
      icon: Radio,
      description: 'Acquires battery telemetry, BLE weight scale metrics, and device motion vectors.',
      enabled: true,
      diDeclaration: 'single<BatteryMonitor> { BatteryMonitorImpl(get()) }\nsingle<BleScaleScanner> { BleScaleScannerImpl(get()) }',
      navRoute: 'composable("sensors") { HardwareTelemetryScreen(get()) }'
    },
    {
      id: 'feature-room',
      name: 'AndroidX Room KMP Storage',
      layer: 'data',
      icon: Database,
      description: 'Cross-platform SQLite database in commonMain with compile-time verified schema and migration tools.',
      enabled: true,
      diDeclaration: 'single { get<AppDatabase>().projectDao() }',
      navRoute: undefined
    },
    {
      id: 'feature-ktor',
      name: 'Ktor 3 Network Client',
      layer: 'data',
      icon: Wifi,
      description: 'Asynchronous HTTP engine with Darwin (iOS) and OkHttp (Android) driver pipelines.',
      enabled: true,
      diDeclaration: 'single { createKtorHttpClient() }',
      navRoute: undefined
    },
    {
      id: 'feature-designsystem',
      name: 'Zero-Emoji Vector Design System',
      layer: 'core',
      icon: Sparkles,
      description: 'Crisp vector drawables and procedural Canvas path drawing functions.',
      enabled: true,
      diDeclaration: 'single { VectorDesignTokens() }',
      navRoute: undefined
    }
  ]);

  const [activeOutputTab, setActiveOutputTab] = useState<'di' | 'navigation' | 'tree'>('di');
  const [copied, setCopied] = useState<boolean>(false);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const enabledFeatures = features.filter((f) => f.enabled);

  // Generate Composed Koin DI Module
  const composedDiModule = `// Composed Multiplatform DI (Koin 4.x / commonMain)
package com.example.multiplatform.di

import org.koin.dsl.module
import org.koin.core.module.Module

val appModule: Module = module {
${enabledFeatures.map((f) => `    // ${f.name}\n    ${f.diDeclaration.split('\n').join('\n    ')}`).join('\n\n')}
}
`;

  // Generate Composed Compose Navigation Graph
  const composedNavGraph = `// Composed Navigation Graph (Compose Multiplatform)
package com.example.multiplatform.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import org.koin.compose.koinInject

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "${enabledFeatures.find((f) => f.navRoute)?.id ? 'home' : 'main'}"
    ) {
        composable("home") { HomeScreen(navController) }

${enabledFeatures
  .filter((f) => f.navRoute)
  .map((f) => `        // ${f.name}\n        ${f.navRoute}`)
  .join('\n\n')}
    }
}
`;

  // Generate Composed Project Tree Layout
  const composedTree = `composeApp/
├── src/
│   ├── commonMain/
│   │   ├── kotlin/com/example/app/
│   │   │   ├── di/
│   │   │   │   └── AppModule.kt          # Composed Koin 4.x Module
│   │   │   ├── navigation/
│   │   │   │   └── AppNavigation.kt       # Composed NavHost Routes
${enabledFeatures
  .map(
    (f) =>
      `│   │   │   ├── features/${f.id.replace('feature-', '')}/\n│   │   │   │   └── ${f.name.replace(/[^a-zA-Z]/g, '')}.kt`
  )
  .join('\n')}
│   │   └── composeResources/
│   ├── androidMain/                       # AndroidView + Filament SurfaceView
│   └── iosMain/                           # Metal + SwiftUI Bridge
`;

  const currentOutput =
    activeOutputTab === 'di'
      ? composedDiModule
      : activeOutputTab === 'navigation'
      ? composedNavGraph
      : composedTree;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Architecture & Feature Organizer Composer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize domain, presentation, data, and sensor modules to generate unified dependency injection and navigation graphs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Active Modules:</span>
          <span className="font-semibold text-blue-400">
            {enabledFeatures.length} of {features.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Organizer Checklist */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold text-slate-300 block pb-1 border-b border-slate-800">
            Compose Feature Modules:
          </span>

          <div className="space-y-2.5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    feature.enabled
                      ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-900/10'
                      : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          feature.enabled ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">
                        {feature.name}
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={feature.enabled}
                      onChange={() => {}}
                      className="rounded border-slate-700 text-blue-600 bg-slate-950 focus:ring-0"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Composed Output */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden min-h-[460px]">
          <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'di', label: 'AppModule.kt (DI)' },
                { id: 'navigation', label: 'AppNavigation.kt' },
                { id: 'tree', label: 'Directory Layout' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveOutputTab(tab.id as any)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeOutputTab === tab.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
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
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            <pre className="text-slate-300">
              <code>{currentOutput}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
