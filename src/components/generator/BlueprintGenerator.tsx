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
  FileCode,
  Terminal,
  Edit3,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { GeneratorOptions, ProjectTemplateFile, PlatformTarget } from '../../types';
import { templateFiles } from '../../data/templatesData';
import { architecturePresets } from '../../data/presetsData';
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
  const [cliCopied, setCliCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // In-browser custom edits per file path
  const [customEdits, setCustomEdits] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const selectedFile = templateFiles.find((f) => f.path === selectedFilePath) || templateFiles[0];

  const generatedContent = selectedFile.getContent(options);
  const activeContent = customEdits[selectedFile.path] ?? generatedContent;
  const isFileModified = customEdits[selectedFile.path] !== undefined;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const filename = selectedFile.path.split('/').pop() || selectedFile.name;
    downloadSingleFile(filename, activeContent);
  };

  const handleResetFile = () => {
    const next = { ...customEdits };
    delete next[selectedFile.path];
    setCustomEdits(next);
  };

  const handleDownloadAllZip = async () => {
    setIsExporting(true);
    try {
      // Create effective files with any in-memory user edits
      const effectiveFiles = templateFiles.map((f) => ({
        ...f,
        getContent: (opts: GeneratorOptions) => customEdits[f.path] ?? f.getContent(opts),
      }));
      await downloadProjectZip(effectiveFiles, options);
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

  const cliCommand = `curl -sSL https://raw.githubusercontent.com/archetype/${options.projectName.toLowerCase()}/main/setup.sh | bash -s -- --package "${options.packageName}"`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* 1. Architecture Presets Selector */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-semibold text-slate-200">
              One-Click Production Architecture Presets
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">Auto-tunes Gradle, KMP, and graphics flags</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {architecturePresets.map((preset) => {
            const isMatch =
              options.includeFilament === preset.options.includeFilament &&
              options.includeRoomKmp === preset.options.includeRoomKmp;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onOptionsChange(preset.options);
                  setCustomEdits({});
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isMatch
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-900/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">{preset.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings & Configuration Sidebar */}
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
                <span className="font-medium text-slate-200">Google Filament 3D PBR</span>
                <p className="text-[11px] text-slate-500">Native JNI model viewer with SurfaceView</p>
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
                <p className="text-[11px] text-slate-500">Darwin & OkHttp engines with serialization</p>
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
                <p className="text-[11px] text-slate-500">Centralized libs.versions.toml single-source-of-truth</p>
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
            <span>{isExporting ? 'Packaging Bundle...' : 'Download Full Repo Blueprint (.ZIP)'}</span>
          </button>
        </div>

        {/* Code & Files Section */}
        <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden min-h-[580px]">
          {/* File Navigator Tabs */}
          <div className="border-b border-slate-800 bg-slate-950/70 p-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {templateFiles.map((file) => {
              const isSelected = selectedFilePath === file.path;
              const hasEdit = customEdits[file.path] !== undefined;
              return (
                <button
                  key={file.path}
                  onClick={() => {
                    setSelectedFilePath(file.path);
                    setIsEditing(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                  {hasEdit && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Modified" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active File Header */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-200 truncate">
                  {selectedFile.path}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {selectedFile.format}
                </span>
                {isFileModified && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                    Custom Edited
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Toggle Live Edit */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isEditing
                    ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Edit this file directly"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Live Edit'}</span>
              </button>

              {isFileModified && (
                <button
                  onClick={handleResetFile}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Reset to generated default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

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

          {/* Code View Area / Live Editor */}
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            {isEditing ? (
              <textarea
                value={activeContent}
                onChange={(e) => {
                  setCustomEdits({ ...customEdits, [selectedFile.path]: e.target.value });
                }}
                className="w-full h-full min-h-[460px] bg-slate-950 text-slate-200 font-mono text-xs p-2 border border-slate-800 rounded focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            ) : (
              <pre className="text-slate-300">
                <code>{activeContent}</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* 3. Terminal Quick-Start CLI Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Quick Terminal Scaffolding Command
            </span>
            <code className="text-[11px] text-slate-400 font-mono mt-0.5 block truncate max-w-xl">
              {cliCommand}
            </code>
          </div>
        </div>

        <button
          onClick={handleCopyCli}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 transition-colors"
        >
          {cliCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Command Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Command</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
