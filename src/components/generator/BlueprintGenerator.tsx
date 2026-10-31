import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Settings,
  FolderGit2,
  Cpu,
  Layers,
  Shield,
  Box,
  FileCode
} from 'lucide-react';
import { GeneratorOptions, ProjectTemplateFile, PlatformTarget } from '../../types';
import { templateFiles } from '../../data/templatesData';
import { downloadSingleFile, downloadProjectZip } from '../../lib/zipExport';

interface BlueprintGeneratorProps {
  options: GeneratorOptions;
  onOptionsChange: (newOptions: GeneratorOptions) => void;
}

export const BlueprintGenerator: React.FC<BlueprintGeneratorProps> = ({
  options,
  onOptionsChange,
}) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(templateFiles[0].path);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const selectedFile = templateFiles.find((f) => f.path === selectedFilePath) || templateFiles[0];
  const fileContent = selectedFile.getContent(options);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const filename = selectedFile.path.split('/').pop() || selectedFile.name;
    downloadSingleFile(filename, fileContent);
  };

  const handleDownloadAllZip = async () => {
    setIsExporting(true);
    try {
      await downloadProjectZip(templateFiles, options);
    } finally {
      setIsExporting(false);
    }
  };

  const togglePlatform = (p: PlatformTarget) => {
    const exists = options.targetPlatforms.includes(p);
    const updated = exists
      ? options.targetPlatforms.filter((item) => item !== p)
      : [...options.targetPlatforms, p];
    onOptionsChange({ ...options, targetPlatforms: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings / Configuration Sidebar */}
      <div className="lg:col-span-4 space-y-5">
        {/* Project Metadata Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
            <Settings className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-200">Repository Specification</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Project Name</label>
              <input
                type="text"
                value={options.projectName}
                onChange={(e) => onOptionsChange({ ...options, projectName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Base Package</label>
              <input
                type="text"
                value={options.packageName}
                onChange={(e) => onOptionsChange({ ...options, packageName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Target Platforms */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="text-xs text-slate-400 font-medium block mb-2.5">Target Platforms</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'kmp', label: 'KMP (Shared UI)' },
              { id: 'android', label: 'Native Android' },
              { id: 'ios', label: 'iOS (SwiftUI)' },
              { id: 'web', label: 'Web (React/Wasm)' },
            ].map((platform) => {
              const active = options.targetPlatforms.includes(platform.id as PlatformTarget);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id as PlatformTarget)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all ${
                    active
                      ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{platform.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Switches */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <label className="text-xs text-slate-400 font-medium block mb-1">Stack Components</label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={options.includeFilament}
              onChange={(e) => onOptionsChange({ ...options, includeFilament: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
            />
            <div>
              <span className="font-medium text-slate-200">Filament 3D PBR Engine</span>
              <p className="text-[11px] text-slate-500">Includes native JNI model viewer & memory rules</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={options.includeRoomKmp}
              onChange={(e) => onOptionsChange({ ...options, includeRoomKmp: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
            />
            <div>
              <span className="font-medium text-slate-200">AndroidX Room KMP (SQLite)</span>
              <p className="text-[11px] text-slate-500">Shared persistence in commonMain for iOS & Android</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={options.includeKtor}
              onChange={(e) => onOptionsChange({ ...options, includeKtor: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
            />
            <div>
              <span className="font-medium text-slate-200">Ktor 3.x Multiplatform Client</span>
              <p className="text-[11px] text-slate-500">Darwin & OkHttp engines with kotlinx.serialization</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={options.includeStrictZeroEmoji}
              onChange={(e) => onOptionsChange({ ...options, includeStrictZeroEmoji: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
            />
            <div>
              <span className="font-medium text-slate-200">Strict Zero-Emoji Policy</span>
              <p className="text-[11px] text-slate-500">Enforces vector paths and Lucide iconography</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={options.versionCatalogEnabled}
              onChange={(e) => onOptionsChange({ ...options, versionCatalogEnabled: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
            />
            <div>
              <span className="font-medium text-slate-200">Gradle Version Catalog (TOML)</span>
              <p className="text-[11px] text-slate-500">Type-safe centralized library definitions</p>
            </div>
          </label>
        </div>

        {/* Global Save Bundle Action */}
        <button
          onClick={handleDownloadAllZip}
          disabled={isExporting}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Packaging Blueprint...' : 'Download Full Repo Blueprint (.ZIP)'}</span>
        </button>
      </div>

      {/* Code & Files Section */}
      <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden min-h-[580px]">
        {/* File Navigator Tabs */}
        <div className="border-b border-slate-800 bg-slate-950/70 p-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          {templateFiles.map((file) => {
            const isSelected = selectedFilePath === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active File Header */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-200 truncate">
                {selectedFile.path}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {selectedFile.format}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {selectedFile.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Copy file contents"
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
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
              title="Save this individual file to disk"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save File</span>
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
          <pre className="text-slate-300">
            <code>{fileContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
