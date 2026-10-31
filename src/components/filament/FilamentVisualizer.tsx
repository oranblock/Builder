import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Box,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Activity,
  Copy,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const FilamentVisualizer: React.FC = () => {
  const [useDisposableEffect, setUseDisposableEffect] = useState<boolean>(true);
  const [surfaceType, setSurfaceType] = useState<'surface' | 'texture'>('surface');
  const [navigatedAwayCount, setNavigatedAwayCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Native memory simulation: if no DisposableEffect, memory builds up on every navigation
  const nativeMemoryMB = useDisposableEffect
    ? 14.5
    : Math.min(14.5 + navigatedAwayCount * 28.2, 180.0);

  const isMemoryCritical = nativeMemoryMB > 70;

  const handleSimulateScreenNavigation = () => {
    setNavigatedAwayCount((prev) => prev + 1);
  };

  const handleResetSimulation = () => {
    setNavigatedAwayCount(0);
  };

  const boilerplateCode = `// Production Filament in Jetpack Compose
@Composable
fun FilamentPbrViewport(
    glbAssetPath: String,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    var modelViewer by remember { mutableStateOf<ModelViewer?>(null) }
    var choreographerCallback by remember { mutableStateOf<Choreographer.FrameCallback?>(null) }

    // 1. LIFECYCLE MANAGEMENT (Zero JNI Leak Guarantee)
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_RESUME -> {
                    choreographerCallback = object : Choreographer.FrameCallback {
                        override fun doFrame(frameTimeNanos: Long) {
                            modelViewer?.render(frameTimeNanos)
                            Choreographer.getInstance().postFrameCallback(this)
                        }
                    }
                    Choreographer.getInstance().postFrameCallback(choreographerCallback!!)
                }
                Lifecycle.Event.ON_PAUSE -> {
                    choreographerCallback?.let { Choreographer.getInstance().removeFrameCallback(it) }
                }
                else -> {}
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            // Remove observer and tear down native C++ engine pointers
            choreographerCallback?.let { Choreographer.getInstance().removeFrameCallback(it) }
            lifecycleOwner.lifecycle.removeObserver(observer)
            modelViewer?.destroyModel()
            modelViewer?.engine?.destroy()
            modelViewer = null
        }
    }

    // 2. HARDWARE COMPOSITOR OVERLAY (SurfaceView)
    AndroidView(
        modifier = modifier.fillMaxSize(),
        factory = { ctx ->
            SurfaceView(ctx).apply {
                modelViewer = ModelViewer(this)
                // Load glTF / IBL on background coroutine
                CoroutineScope(Dispatchers.IO).launch {
                    val buffer = ctx.assets.open(glbAssetPath).use { it.readBytes() }
                    withContext(Dispatchers.Main) {
                        modelViewer?.loadModelGlb(ByteBuffer.wrap(buffer))
                        modelViewer?.transformToUnitCube()
                    }
                }
            }
        }
    )
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(boilerplateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Google Filament & Native 3D Architecture Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate native C++ JNI buffer lifecycles, SurfaceView hardware compositing, and Choreographer loop throttling.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copied Kotlin Code</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Production Compose Code</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator Control & Memory Gauge */}
        <div className="lg:col-span-5 space-y-5">
          {/* JNI Lifecycle Simulation Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                1. Native JNI Memory Lifecycle
              </span>
              <button
                onClick={handleResetSimulation}
                className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                title="Reset simulation"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Toggle DisposableEffect */}
            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 font-medium block">
                Teardown Pattern:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setUseDisposableEffect(true)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    useDisposableEffect
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>DisposableEffect</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Zero leaks (Clean)</span>
                </button>

                <button
                  onClick={() => setUseDisposableEffect(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    !useDisposableEffect
                      ? 'bg-red-950/40 border-red-700/60 text-red-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>No Cleanup</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Leaks native C++ heap</span>
                </button>
              </div>
            </div>

            {/* Navigation Simulator Action */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Simulate Screen Navigations:</span>
                <span className="font-mono text-blue-400">{navigatedAwayCount} times</span>
              </div>
              <button
                onClick={handleSimulateScreenNavigation}
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition-colors"
              >
                + Navigate Away & Re-enter Screen
              </button>
            </div>

            {/* Memory Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Native GPU/C++ Heap:</span>
                <span
                  className={`font-mono font-semibold ${
                    isMemoryCritical ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {nativeMemoryMB.toFixed(1)} MB
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <motion.div
                  className={`h-full ${
                    isMemoryCritical
                      ? 'bg-red-500'
                      : nativeMemoryMB > 30
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((nativeMemoryMB / 180) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {isMemoryCritical && (
                <p className="text-[11px] text-red-400/90 flex items-center gap-1 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Warning: Native heap fragmentation! OOM crash imminent without onDispose teardown.</span>
                </p>
              )}
            </div>
          </div>

          {/* SurfaceView vs TextureView Comparison */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-200 block">
              2. Compositor Architecture Comparison
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSurfaceType('surface')}
                className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                  surfaceType === 'surface'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-semibold block">SurfaceView</span>
                <span className="text-[10px] text-slate-400">Dedicated HW layer · 0 copies</span>
              </button>

              <button
                onClick={() => setSurfaceType('texture')}
                className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                  surfaceType === 'texture'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-semibold block">TextureView</span>
                <span className="text-[10px] text-slate-400">View hierarchy pass · 1 copy</span>
              </button>
            </div>

            {/* Pipeline Visual Diagram */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono space-y-2">
              <div className="text-slate-400">GPU Pipeline Flow:</div>
              {surfaceType === 'surface' ? (
                <div className="space-y-1 text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Filament Engine ➔ SurfaceView Buffer ➔ Hardware Compositor Layer ➔ Display</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans mt-1">
                    Bypasses the Android View hierarchy completely. Locked 120 FPS with minimal battery draw.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-amber-400">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Filament Engine ➔ Texture Buffer ➔ Blit Copy ➔ Compose Render Pass ➔ Compositor</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans mt-1">
                    Allows alpha transparency and Compose clipping, but costs 1 extra buffer copy per frame.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code & Entity Hierarchy View */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-300">
              FilamentPbrViewport.kt (Production Verified)
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Clean JNI Lifecycle
            </span>
          </div>

          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            <pre className="text-slate-300">
              <code>{boilerplateCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
