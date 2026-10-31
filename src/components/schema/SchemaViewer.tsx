import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { GeneratorOptions } from '../../types';
import { templateFiles } from '../../data/templatesData';
import { downloadSingleFile } from '../../lib/zipExport';

interface SchemaViewerProps {
  options: GeneratorOptions;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ options }) => {
  const [activeFormat, setActiveFormat] = useState<string>('json');
  const [copied, setCopied] = useState<boolean>(false);

  const schemas: Record<string, { title: string; filename: string; content: string; lang: string }> = {
    json: {
      title: 'Repository Architecture & Standards (JSON)',
      filename: 'architecture-schema.json',
      lang: 'json',
      content: JSON.stringify(
        {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          title: options.projectName,
          package: options.packageName,
          environment: {
            gradleVersion: '8.8.0',
            kotlinVersion: '2.1.10',
            composeVersion: '1.7.3',
            jvmTarget: '17',
          },
          standards: {
            zeroEmojiPolicy: true,
            compositorLatencyBudgetMs: 200,
            hardwareOverlays: options.includeFilament ? 'SurfaceView' : 'ComposeCanvas',
          },
          dependencies: {
            persistence: options.includeRoomKmp ? 'androidx.room:room-runtime:2.7.0' : 'none',
            networking: options.includeKtor ? 'io.ktor:ktor-client-core:3.1.0' : 'native',
            graphics: options.includeFilament ? 'com.google.android.filament:1.56.0' : 'native',
          },
          targets: options.targetPlatforms,
        },
        null,
        2
      ),
    },
    yaml: {
      title: 'GitHub Actions Continuous Integration Pipeline (YAML)',
      filename: 'ci-workflow.yaml',
      lang: 'yaml',
      content: templateFiles.find((f) => f.format === 'yaml')?.getContent(options) || '',
    },
    toml: {
      title: 'Gradle Version Catalog (TOML)',
      filename: 'libs.versions.toml',
      lang: 'toml',
      content: templateFiles.find((f) => f.format === 'toml')?.getContent(options) || '',
    },
    properties: {
      title: 'JVM Memory & AndroidX Flags (Properties)',
      filename: 'gradle.properties',
      lang: 'properties',
      content: templateFiles.find((f) => f.format === 'properties')?.getContent(options) || '',
    },
    markdown: {
      title: 'Open Source Documentation & Guidelines (Markdown)',
      filename: 'README.md',
      lang: 'markdown',
      content: templateFiles.find((f) => f.format === 'markdown')?.getContent(options) || '',
    },
  };

  const activeSchema = schemas[activeFormat] || schemas.json;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSchema.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    downloadSingleFile(activeSchema.filename, activeSchema.content);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Schema Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'json', label: 'JSON Schema' },
            { id: 'yaml', label: 'YAML (CI/CD)' },
            { id: 'toml', label: 'TOML (Catalog)' },
            { id: 'properties', label: 'Properties' },
            { id: 'markdown', label: 'Markdown (.md)' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setActiveFormat(fmt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeFormat === fmt.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save {activeSchema.filename}</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-300">
            {activeSchema.title}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {activeSchema.filename}
          </span>
        </div>

        <div className="p-5 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed max-h-[640px]">
          <pre className="text-slate-300">
            <code>{activeSchema.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
