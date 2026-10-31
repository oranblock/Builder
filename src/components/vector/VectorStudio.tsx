import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCw, Copy, Check, Sparkles, Sliders, Code2 } from 'lucide-react';

export const VectorStudio: React.FC = () => {
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [duration, setDuration] = useState<number>(1.4);
  const [activePlatformCode, setActivePlatformCode] = useState<'web' | 'compose' | 'swiftui'>('web');
  const [copied, setCopied] = useState<boolean>(false);

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  const webCode = `// React 19 + Motion for React (Pure Vector SVG)
import { motion } from 'motion/react';

export function VerifiedShield() {
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-blue-500 fill-none" strokeWidth="${strokeWidth}">
      {/* Outer Geometric Shield */}
      <motion.path
        d="M50 14 L78 28 V52 C78 70 50 86 50 86 C50 86 22 70 22 52 V28 Z"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: ${duration}, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Inner Verification Checkmark */}
      <motion.path
        d="M36 50 L46 60 L64 40"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: ${duration * 0.7}, duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}`;

  const composeCode = `// Compose Multiplatform (Android & iOS)
@Composable
fun AnimatedVerifiedShield(
    modifier: Modifier = Modifier.size(96.dp),
    strokeWidth: Dp = ${strokeWidth}.dp
) {
    val progress = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        progress.animateTo(1f, animationSpec = tween(${Math.round(duration * 1000)}))
    }

    Canvas(modifier = modifier) {
        val shieldPath = Path().apply {
            moveTo(size.width * 0.5f, size.height * 0.14f)
            lineTo(size.width * 0.78f, size.height * 0.28f)
            // ... quadratic / cubic bezier curves ...
        }
        val pathMeasure = PathMeasure().apply { setPath(shieldPath, false) }
        val animatedSegment = Path()
        pathMeasure.getSegment(0f, pathMeasure.length * progress.value, animatedSegment, true)

        drawPath(
            path = animatedSegment,
            color = Color(0xFF3B82F6),
            style = Stroke(width = strokeWidth.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
        )
    }
}`;

  const swiftUiCode = `// SwiftUI Native iOS (Swift 6)
struct AnimatedVerifiedShield: View {
    @State private var progress: CGFloat = 0.0

    var body: some View {
        ZStack {
            ShieldShape()
                .trim(from: 0.0, to: progress)
                .stroke(Color.blue, style: StrokeStyle(lineWidth: ${strokeWidth}, lineCap: .round, lineJoin: .round))
                .frame(width: 96, height: 96)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: ${duration})) {
                progress = 1.0
            }
        }
    }
}`;

  const currentCode =
    activePlatformCode === 'web'
      ? webCode
      : activePlatformCode === 'compose'
      ? composeCode
      : swiftUiCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Zero-Emoji Vector & Path Animation Lab
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Declarative, resolution-independent vector illustrations drawn via GPU path algorithms without emojis.
          </p>
        </div>

        <button
          onClick={handleReplay}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Replay Path Drawing</span>
        </button>
      </div>

      {/* Interactive Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Stage */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center justify-center space-y-6 min-h-[380px]">
          {/* Animated SVG */}
          <div
            key={animationKey}
            className="w-48 h-48 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-center p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Background vector grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            <svg
              viewBox="0 0 100 100"
              className="w-32 h-32 stroke-blue-400 fill-none z-10 filter drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              style={{ strokeWidth: strokeWidth }}
            >
              {/* Shield Outline */}
              <motion.path
                d="M50 14 L78 28 V52 C78 70 50 86 50 86 C50 86 22 70 22 52 V28 Z"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: duration, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Concentric Node Rings */}
              <motion.circle
                cx="50"
                cy="50"
                r="16"
                className="stroke-blue-500/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: duration * 0.8, delay: 0.3 }}
              />
              {/* Inner Checkmark */}
              <motion.path
                d="M40 50 L47 57 L62 42"
                className="stroke-emerald-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  delay: duration * 0.75,
                  duration: 0.45,
                  ease: 'easeOut',
                }}
              />
            </svg>
          </div>

          {/* Interactive Controls */}
          <div className="w-full space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Stroke Width ({strokeWidth}px)</span>
              </span>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                className="w-32 accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Drawing Speed ({duration}s)</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-32 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Code Generator for all 3 Platforms */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col">
          {/* Platform Switcher */}
          <div className="border-b border-slate-800 bg-slate-950/70 p-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'web', label: 'Web (React Motion)' },
                { id: 'compose', label: 'KMP (Compose Canvas)' },
                { id: 'swiftui', label: 'iOS (SwiftUI Path)' },
              ].map((plat) => (
                <button
                  key={plat.id}
                  onClick={() => setActivePlatformCode(plat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    activePlatformCode === plat.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {plat.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
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
          </div>

          {/* Generated Code */}
          <div className="flex-1 p-4 bg-slate-950 overflow-auto font-mono text-xs leading-relaxed">
            <pre className="text-slate-300">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
