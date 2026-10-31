import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Sparkles, BookMarked } from 'lucide-react';
import { GeneratorOptions } from '../../types';
import { downloadSingleFile } from '../../lib/zipExport';

interface StandardsExporterProps {
  options: GeneratorOptions;
}

export const StandardsExporter: React.FC<StandardsExporterProps> = ({ options }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [formatType, setFormatType] = useState<'markdown' | 'cursorrules'>('markdown');

  const markdownContent = `# Unified Engineering Standards & Architecture Rules
> Generated for project: **${options.projectName}** (${options.packageName})

---

## 1. Zero-Emoji & Design Constitution
- **Strict Prohibition**: Prohibit using emojis as UI decoration, status indicators, or action labels in any component or screen.
- **Vectors Only**: Use dedicated vector icons (e.g. Lucide, VectorDrawables, SF Symbols, or SVG \`<path>\`) with consistent 2px stroke weights.
- **Zero-Pill Metadata**: Do not wrap static metadata in rounded capsule badges or colored pills. Use clean inline typography with separators (\`·\`, \`/\`).
- **Interaction Latency**: Micro-interactions and hover states must settle within $\\le 200\\text{ms}$ using compositor properties (\`transform\`, \`opacity\`).

---

## 2. Multiplatform & 3D Graphics Architecture
${
  options.includeFilament
    ? `- **Google Filament JNI Lifecycle**:
  - Always tear down native C++ engine pointers inside \`DisposableEffect(Unit) { onDispose { ... } }\`.
  - Pause rendering loops on \`ON_PAUSE\`/\`ON_STOP\` via Choreographer callbacks to eliminate background battery drain.
  - Default to \`SurfaceView\` for 3D viewports (hardware compositor overlay layer with 0 buffer copies) unless complex alpha blending requires \`TextureView\`.`
    : '- **Vector Rendering**: Use hardware-accelerated declarative Canvas paths or SVG pathLength.'
}
${
  options.includeRoomKmp
    ? `- **Persistence**: Use official AndroidX Room 2.7+ in \`commonMain\` for compile-time verified SQLite schemas across Android and iOS.`
    : ''
}
${
  options.includeKtor
    ? `- **Networking**: Use Ktor 3.x Multiplatform Client with kotlinx.serialization; never use reflection-based libraries (like Gson).`
    : ''
}

---

## 3. Dependency Discipline (Banned vs. Modern Standards)

| Banned / Avoid | Modern Recommended Alternative | Reason |
| :--- | :--- | :--- |
| **Gson** | **kotlinx.serialization** | Gson uses reflection, breaks R8/ProGuard, and does not work on KMP/iOS. |
| **moment.js** | **Native Intl.DateTimeFormat** or **date-fns** | Moment is >300KB, mutable, and deprecated. |
| **styled-components** | **Tailwind CSS v4** | Runtime CSS-in-JS lags main thread and breaks React 19 / Server Components. |
| **RxJava / RxSwift** | **Kotlin Coroutines / Swift Concurrency** | Redundant language duplication with heavy binary overhead. |
| **Icon Fonts (Font Awesome)** | **Lucide Icons / Vector SVGs** | Avoids downloading multi-megabyte font files for only a few icons. |

---

## 4. Build System Configuration
- **Version Catalog**: All dependencies must be defined in \`gradle/libs.versions.toml\`.
- **Parallel Builds**: Enable \`org.gradle.parallel=true\` and \`org.gradle.caching=true\` in \`gradle.properties\`.
- **CI/CD**: Enforce automated Detekt and compilation checks on pull requests before merging.
`;

  const cursorrulesContent = `# Project AI & Team Rules (.cursorrules)
# Project: ${options.projectName}

You are an expert multiplatform software engineer specializing in ${options.targetPlatforms.join(', ')}.

## Core Rules & Non-Negotiables:
1. Zero Emojis: NEVER use emojis as UI decoration, status indicators, or button labels. Use crisp vector SVGs or Lucide icons instead.
2. Anti-AI Slop: Never wrap static metadata in colored pills or pill badges. Lead with clean typography.
3. Filament & Native 3D:
   - When using Google Filament or JNI, ALWAYS implement DisposableEffect cleanup to destroy Engine, Renderer, and SwapChain pointers.
   - Prefer SurfaceView over TextureView for zero-copy hardware overlays.
   - Always throttle Choreographer loops on ON_PAUSE.
4. Dependency Standards:
   - NEVER use Gson -> use kotlinx.serialization.
   - NEVER use moment.js -> use native Intl.
   - Centralize dependencies in gradle/libs.versions.toml.
`;

  const activeContent = formatType === 'markdown' ? markdownContent : cursorrulesContent;
  const activeFilename =
    formatType === 'markdown' ? 'ENGINEERING_STANDARDS.md' : '.cursorrules';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadSingleFile(activeFilename, activeContent);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Team & AI Standards Document Exporter
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Export a unified markdown document or .cursorrules file to align your team, repository contributors, and AI assistants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFormatType('markdown')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                formatType === 'markdown'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ENGINEERING_STANDARDS.md
            </button>
            <button
              onClick={() => setFormatType('cursorrules')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                formatType === 'cursorrules'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              .cursorrules
            </button>
          </div>

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
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save {activeFilename}</span>
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-300">
            {activeFilename}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {activeContent.split('\n').length} lines · Markdown
          </span>
        </div>

        <div className="p-6 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed max-h-[600px]">
          <pre className="text-slate-300 whitespace-pre-wrap">
            <code>{activeContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
