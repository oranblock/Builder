import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Smartphone,
  Globe,
  Database,
  Wifi,
  Palette,
  ArrowRight,
  CheckCircle2,
  Code2,
} from 'lucide-react';

interface ModuleNode {
  id: string;
  title: string;
  category: 'ui' | 'core' | 'data' | 'platform';
  description: string;
  dependencies: string[];
  snippet: string;
}

export const ModuleGraphVisualizer: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('compose-app');

  const modules: ModuleNode[] = [
    {
      id: 'compose-app',
      title: ':composeApp (Shared UI)',
      category: 'ui',
      description: 'Single-source-of-truth UI rendered across Android and iOS via Compose Multiplatform. Contains navigation routes, viewmodels, and screens.',
      dependencies: ['commonMain', 'core-designsystem', 'data-repository'],
      snippet: `@Composable
fun App() {
    MaterialTheme {
        NavHost(navController = rememberNavController(), startDestination = "home") {
            composable("home") { HomeScreen() }
            composable("viewport3d") { FilamentViewportScreen() }
        }
    }
}`
    },
    {
      id: 'android-main',
      title: ':composeApp:androidMain',
      category: 'platform',
      description: 'Native Android bridge: MainActivity hosting ComponentActivity, Filament SurfaceView interop, and AGSL runtime shaders.',
      dependencies: ['compose-app', 'filament-engine'],
      snippet: `class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { App() }
    }
}`
    },
    {
      id: 'ios-main',
      title: ':composeApp:iosMain',
      category: 'platform',
      description: 'Native iOS Darwin bridge: Exports ComposeUIViewController into SwiftUI UIViewControllerRepresentable with Metal rendering.',
      dependencies: ['compose-app'],
      snippet: `fun MainViewController() = ComposeUIViewController {
    App()
}

// In SwiftUI iOS:
struct ComposeView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewController()
    }
}`
    },
    {
      id: 'data-repository',
      title: ':data:repository (Domain)',
      category: 'core',
      description: 'Pure Kotlin business logic in commonMain: Coroutine StateFlow pipelines, offline-first syncing, and domain models.',
      dependencies: ['data-database', 'data-network'],
      snippet: `class ProjectRepository(
    private val localDao: ProjectDao,
    private val remoteApi: KtorProjectApi
) {
    val projects: Flow<List<Project>> = localDao.observeProjects()
    
    suspend fun refresh() = withContext(Dispatchers.IO) {
        val remote = remoteApi.fetchProjects()
        localDao.upsert(remote)
    }
}`
    },
    {
      id: 'data-database',
      title: ':data:database (Room KMP)',
      category: 'data',
      description: 'AndroidX Room 2.7+ multiplatform SQLite storage running identical schema queries on Android and iOS Darwin SQLite drivers.',
      dependencies: [],
      snippet: `@Database(entities = [ProjectEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun projectDao(): ProjectDao
}`
    },
    {
      id: 'data-network',
      title: ':data:network (Ktor 3)',
      category: 'data',
      description: 'Ktor 3 asynchronous HTTP client with Darwin (iOS) & OkHttp (Android) engine bindings and zero-reflection kotlinx.serialization.',
      dependencies: [],
      snippet: `val httpClient = HttpClient {
    install(ContentNegotiation) {
        json(Json { ignoreUnknownKeys = true })
    }
}`
    },
    {
      id: 'core-designsystem',
      title: ':core:designsystem (Vectors)',
      category: 'ui',
      description: 'Zero-emoji design tokens, custom Compose Canvas vector drawing paths, color palettes, and typographic scales.',
      dependencies: [],
      snippet: `@Composable
fun VectorShieldIcon(modifier: Modifier = Modifier, color: Color = Color(0xFF2563EB)) {
    Canvas(modifier = modifier) {
        // GPU Sub-pixel path drawing
    }
}`
    }
  ];

  const selectedNode = modules.find((m) => m.id === selectedNodeId) || modules[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Interactive KMP Architecture & Module Dependency Graph
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual breakdown of how shared commonMain logic integrates with native Android (Filament/AGSL) and iOS (Metal/SwiftUI).
          </p>
        </div>
      </div>

      {/* Visual Interactive Architecture Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Nodes Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Project Modules (Click to inspect)</span>
            <span className="text-[11px] text-slate-500 font-mono">7 modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {modules.map((mod) => {
              const isSelected = mod.id === selectedNodeId;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedNodeId(mod.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/60 shadow-lg shadow-blue-900/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-semibold text-slate-200 truncate">
                      {mod.title}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        mod.category === 'platform'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                          : mod.category === 'data'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                      }`}
                    >
                      {mod.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Module Detail & Code */}
        <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/70 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-semibold text-blue-400">
                {selectedNode.title}
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedNode.category} module
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedNode.description}
            </p>

            {selectedNode.dependencies.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="font-mono text-slate-500">Dependencies:</span>
                {selectedNode.dependencies.map((dep) => (
                  <span
                    key={dep}
                    className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded"
                  >
                    :{dep}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            <pre className="text-slate-300">
              <code>{selectedNode.snippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
