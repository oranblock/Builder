import { RuleCategory } from '../types';

export const rulesCategories: RuleCategory[] = [
  {
    id: 'frontend-constitution',
    title: 'Universal Design & Anti-AI Slop Constitution',
    iconName: 'Palette',
    description: 'Engineering and aesthetic discipline: anti-slop mandates, zero-pill metadata rules, and typographic restraint.',
    rules: [
      {
        id: 'zero-emoji-mandate',
        title: 'Zero Emojis in Production UI',
        platform: 'universal',
        level: 'mandatory',
        summary: 'Prohibit using emojis as UI decoration, status indicators, or action labels.',
        details: 'Emojis render inconsistently across operating systems (iOS vs Android vs Windows), carry informal connotations, and look like automated placeholders. Always use crisp vector iconography (e.g. Lucide, Compose VectorDrawables, SF Symbols) with controlled stroke weights, fills, and accessible semantic descriptions.',
        tags: ['Design', 'Accessibility', 'SVG', 'Typography'],
        codeSnippet: {
          language: 'tsx',
          badCode: `<button className="px-4 py-2 bg-blue-600 rounded-lg">🚀 Launch Project 🎉</button>`,
          goodCode: `<button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
  <RocketIcon className="w-4 h-4 stroke-[1.75]" />
  <span>Deploy Application</span>
</button>`,
          explanation: 'Vector icons provide deterministic sizing, customizable strokes, and professional visual hierarchy.'
        }
      },
      {
        id: 'zero-pill-metadata',
        title: 'Zero-Pill Metadata Discipline',
        platform: 'web',
        level: 'mandatory',
        summary: 'Never wrap static informational metadata in rounded pill boxes, bordered chips, or colored capsules.',
        details: 'Informational labels (tags, timestamps, category names, counts, publication dates) must be rendered as quiet inline text separated by typographic dividers (·, /, -). Reserve bordered or rounded button elements strictly for interactive controls with actual click handlers.',
        tags: ['UI', 'Tailwind', 'Design'],
        codeSnippet: {
          language: 'tsx',
          badCode: `<div className="flex gap-2">
  <span className="bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5 text-xs text-slate-700">Robotics</span>
  <span className="bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5 text-xs">Active</span>
</div>`,
          goodCode: `<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
  <span className="font-medium text-slate-700 dark:text-slate-300">Robotics</span>
  <span aria-hidden="true">·</span>
  <span>Operational</span>
  <span aria-hidden="true">·</span>
  <time dateTime="2026-10-31">Oct 2026</time>
</div>`,
          explanation: 'Eliminating static pill capsules reduces visual clutter and lets the primary content breathe.'
        }
      },
      {
        id: 'motion-budget',
        title: 'Interaction Latency Budget (≤200ms)',
        platform: 'universal',
        level: 'mandatory',
        summary: 'Micro-interactions, hover states, and button presses must respond within 100–200ms using smooth settling curves.',
        details: 'Animate only compositor properties (transform, opacity, filter). Never animate layout geometry (width, height, top, left, margin) on scroll or hover, which triggers expensive document reflows.',
        tags: ['Performance', 'Animation', 'Compositor'],
        codeSnippet: {
          language: 'css',
          badCode: `button { transition: width 0.4s ease, margin-left 0.4s ease; }`,
          goodCode: `button { 
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease;
  will-change: transform;
}`,
          explanation: 'Compositor-only transitions run on the GPU thread without locking main thread interactivity.'
        }
      }
    ]
  },
  {
    id: 'filament-graphics',
    title: 'Filament 3D & Native Compose Graphics',
    iconName: 'Box',
    description: 'Zero-leak native JNI lifecycle management, Choreographer pacing, and surface layer strategies.',
    rules: [
      {
        id: 'filament-jni-cleanup',
        title: 'Explicit Native JNI Destruction via DisposableEffect',
        platform: 'kmp',
        level: 'mandatory',
        summary: 'Tear down Filament native C++ engine pointers in reverse creation order inside DisposableEffect.',
        details: 'Filament allocates GPU buffers and native C++ pointers via JNI that bypass the JVM Garbage Collector. If the Composable is disposed without calling Engine.destroy(), Scene.destroy(), and SwapChain.destroy(), the app will suffer fatal native memory leaks (SIGSEGV).',
        tags: ['Filament', 'JNI', 'Memory', 'Compose'],
        codeSnippet: {
          language: 'kotlin',
          badCode: `@Composable
fun Filament3DView() {
    val viewer = remember { ModelViewer(...) }
    AndroidView(factory = { viewer.surfaceView })
    // LEAK: Native pointers remain allocated when leaving screen!
}`,
          goodCode: `@Composable
fun Filament3DView(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    var modelViewer by remember { mutableStateOf<ModelViewer?>(null) }

    DisposableEffect(Unit) {
        onDispose {
            // Tear down in reverse order
            modelViewer?.destroyModel()
            modelViewer?.engine?.destroy()
            modelViewer = null
        }
    }

    AndroidView(
        modifier = modifier,
        factory = { ctx ->
            SurfaceView(ctx).apply {
                modelViewer = ModelViewer(this)
            }
        }
    )
}`,
          explanation: 'DisposableEffect guarantees clean teardown immediately upon removing the composable from the tree.'
        }
      },
      {
        id: 'surfaceview-vs-textureview',
        title: 'SurfaceView Over TextureView for 3D Viewports',
        platform: 'android',
        level: 'recommended',
        summary: 'Default to SurfaceView for direct hardware compositor overlays; use TextureView only for complex UI blending.',
        details: 'SurfaceView provides its own dedicated hardware layer that bypasses Android View hierarchy blending, saving 1 full copy pass per frame. Only use TextureView if translucent Compose UI with alpha gradients or rounded clipping must sit directly over the 3D scene.',
        tags: ['GPU', 'SurfaceView', 'Hardware Overlay', 'Filament'],
        codeSnippet: {
          language: 'kotlin',
          badCode: `// TextureView incurs extra buffer copy and memory overhead
val textureView = TextureView(context)`,
          goodCode: `// Direct hardware compositor layer, zero buffer copy
val surfaceView = SurfaceView(context).apply {
    setZOrderOnTop(true)
}`,
          explanation: 'SurfaceView delivers 60/120fps lock with significantly reduced power consumption.'
        }
      },
      {
        id: 'choreographer-throttling',
        title: 'Choreographer Loop Throttling & Lifecycle Pausing',
        platform: 'android',
        level: 'mandatory',
        summary: 'Pause 3D rendering loops on ON_PAUSE/ON_STOP to avoid background battery drain and thermal throttling.',
        details: 'Continuous 3D render loops must hook into Choreographer.FrameCallback and unregister immediately when the Activity/Fragment goes into the background.',
        tags: ['Battery', 'Lifecycle', 'Performance'],
        codeSnippet: {
          language: 'kotlin',
          badCode: `// Runs non-stop even when user locks phone or switches apps!
while(isActive) { modelViewer.render(System.nanoTime()) }`,
          goodCode: `val lifecycleOwner = LocalLifecycleOwner.current
DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, event ->
        when (event) {
            Lifecycle.Event.ON_RESUME -> startChoreographer()
            Lifecycle.Event.ON_PAUSE -> stopChoreographer()
            else -> {}
        }
    }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
}`,
          explanation: 'Stops GPU rendering completely when the app is obscured.'
        }
      }
    ]
  },
  {
    id: 'kmp-architecture',
    title: 'Kotlin Multiplatform Architecture',
    iconName: 'Cpu',
    description: 'Shared commonMain business logic, Room KMP, Ktor 3, and version catalogs.',
    rules: [
      {
        id: 'version-catalog-discipline',
        title: 'Centralize Dependencies in gradle/libs.versions.toml',
        platform: 'kmp',
        level: 'mandatory',
        summary: 'Never hardcode version strings or artifact coordinates directly in build.gradle.kts.',
        details: 'Gradle Version Catalogs guarantee type-safe dependency access, automatic dependency bundle updates, and single-source-of-truth versioning across root and sub-projects.',
        tags: ['Gradle', 'Build', 'Maintenance'],
        codeSnippet: {
          language: 'kotlin',
          badCode: `// build.gradle.kts
dependencies {
    implementation("io.ktor:ktor-client-core:3.0.0")
    implementation("io.ktor:ktor-client-cio:3.0.0")
}`,
          goodCode: `// build.gradle.kts using Version Catalog
dependencies {
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.cio)
}`,
          explanation: 'Type-safe accessors in Kotlin DSL eliminate runtime string typo errors.'
        }
      },
      {
        id: 'room-kmp-storage',
        title: 'Adopt Official AndroidX Room KMP',
        platform: 'kmp',
        level: 'recommended',
        summary: 'Use AndroidX Room 2.7+ in commonMain for compile-time verified SQLite across Android and iOS.',
        details: 'Google has officially ported Room to Kotlin Multiplatform. It provides SQL schema validation at build time, coroutine Flow queries, and automated schema migrations for both mobile platforms.',
        tags: ['Database', 'Room', 'SQLite', 'iOS'],
        codeSnippet: {
          language: 'kotlin',
          badCode: `// Platform-specific SQLite boilerplate with manual cursor loops`,
          goodCode: `@Database(entities = [ProjectEntity::class], version = 1)
@ConstructedBy(AppDatabaseConstructor::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun projectDao(): ProjectDao
}`,
          explanation: 'Shared DAO and RoomDatabase run on SQLite on both Android and Darwin (iOS).'
        }
      }
    ]
  },
  {
    id: 'ios-swift6',
    title: 'Native iOS & Swift 6 Standards',
    iconName: 'Smartphone',
    description: 'Strict concurrency checking, Observation macros, and SwiftUI path graphics.',
    rules: [
      {
        id: 'swift-observation-macro',
        title: 'Use @Observable Macro Instead of Combine / ObservableObject',
        platform: 'ios',
        level: 'mandatory',
        summary: 'Replace ObservableObject and @Published with Swift modern Observation framework.',
        details: 'The @Observable macro tracks property reads with fine-grained precision. Views only re-render when the exact properties they display change, rather than whenever ANY published property on the object is modified.',
        tags: ['SwiftUI', 'Swift 6', 'State'],
        codeSnippet: {
          language: 'swift',
          badCode: `class UserSettings: ObservableObject {
    @Published var theme: String = "dark"
    @Published var counter: Int = 0
}`,
          goodCode: `@Observable
final class UserSettings {
    var theme: String = "dark"
    var counter: Int = 0
}`,
          explanation: 'Zero Combine dependency, no manual memory cancel-bag boilerplate, and faster SwiftUI view evaluation.'
        }
      },
      {
        id: 'swiftui-path-trim',
        title: 'GPU Vector Animations via Path.trim()',
        platform: 'ios',
        level: 'recommended',
        summary: 'Animate vector outlines using Shape trim(from:to:) for resolution-independent illustrations.',
        details: 'SwiftUI path trims run on the CoreAnimation render server with zero frame drops, eliminating the need for pre-rendered GIF or Lottie JSON dependencies.',
        tags: ['SwiftUI', 'Vector', 'CoreAnimation'],
        codeSnippet: {
          language: 'swift',
          badCode: `// Using heavy Lottie or WebP frames`,
          goodCode: `struct ShieldShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        // ... path commands ...
        return path
    }
}
// In View:
ShieldShape()
    .trim(from: 0, to: animationProgress)
    .stroke(Color.accentColor, lineWidth: 2)`,
          explanation: 'Draws crisp vector paths smoothly at native 120Hz ProMotion display speeds.'
        }
      }
    ]
  }
];
