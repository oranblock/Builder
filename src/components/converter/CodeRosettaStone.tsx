import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  ArrowRightLeft,
  Sparkles,
  Smartphone,
  Globe,
  Layers,
} from 'lucide-react';

interface RosettaPattern {
  id: string;
  name: string;
  category: 'state' | 'lifecycle' | 'networking' | 'storage' | 'haptics';
  description: string;
  snippets: {
    react: string;
    compose: string;
    swiftui: string;
  };
}

export const CodeRosettaStone: React.FC = () => {
  const [activePatternId, setActivePatternId] = useState<string>('state-management');
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const patterns: RosettaPattern[] = [
    {
      id: 'state-management',
      name: 'Reactive State & Mutability',
      category: 'state',
      description: 'How fine-grained UI state is declared, read, and updated reactively without triggering redundant layout passes.',
      snippets: {
        react: `// React 19: State with hooks
import { useState, useMemo } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);
  const isEven = useMemo(() => count % 2 === 0, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count} ({isEven ? 'Even' : 'Odd'})
    </button>
  );
}`,
        compose: `// Jetpack Compose / Compose Multiplatform
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    val isEven by remember { derivedStateOf { count % 2 == 0 } }

    Button(onClick = { count++ }) {
        Text("Count: $count (\${if (isEven) "Even" else "Odd"})")
    }
}`,
        swiftui: `// SwiftUI (Swift 6)
struct CounterView: View {
    @State private var count: Int = 0
    private var isEven: Bool { count % 2 == 0 }

    var body: some View {
        Button(action: { count += 1 }) {
            Text("Count: \\(count) (\\(isEven ? "Even" : "Odd"))")
        }
    }
}`
      }
    },
    {
      id: 'lifecycle-effects',
      name: 'Side Effects & Cleanup',
      category: 'lifecycle',
      description: 'Mounting asynchronous tasks, listening to hardware/network events, and guaranteed disposal teardown.',
      snippets: {
        react: `// React 19: useEffect with cleanup
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // Disposal on unmount
  return () => clearInterval(timer);
}, []);`,
        compose: `// Compose: LaunchedEffect + DisposableEffect
LaunchedEffect(Unit) {
    // Coroutine automatically cancelled on disposal
    while (isActive) {
        delay(1000)
        println("Tick")
    }
}

// For native unmanaged pointers (Filament, Sensor listeners):
DisposableEffect(Unit) {
    onDispose {
        nativeEngine.destroy()
    }
}`,
        swiftui: `// SwiftUI: .task with automatic cancellation
.task {
    while !Task.isCancelled {
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        print("Tick")
    }
}
.onDisappear {
    // Teardown logic
}`
      }
    },
    {
      id: 'async-networking',
      name: 'Async Network Fetching & Serialization',
      category: 'networking',
      description: 'Zero-reflection typed HTTP GET with error handling and json parsing.',
      snippets: {
        react: `// Web: Fetch with AbortController
async function fetchUser(id: string, signal?: AbortSignal): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`, { signal });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}`,
        compose: `// KMP: Ktor 3 + kotlinx.serialization
suspend fun fetchUser(id: String): Result<User> = runCatching {
    httpClient.get("https://api.example.com/users/$id") {
        contentType(ContentType.Application.Json)
    }.body<User>()
}`,
        swiftui: `// Swift 6: URLSession + Codable
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\\(id)")!
    let (data, response) = try await URLSession.shared.data(from: url)
    guard (response as? HTTPURLResponse)?.statusCode == 200 else {
        throw URLError(.badServerResponse)
    }
    return try JSONDecoder().decode(User.self, from: data)
}`
      }
    },
    {
      id: 'haptic-feedback',
      name: 'Haptic Actuator Feedback',
      category: 'haptics',
      description: 'Triggering tactile micro-vibrations for button clicks, toggles, and warnings.',
      snippets: {
        react: `// Web: Vibration API
function triggerHaptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(15); // 15ms crisp tap
  }
}`,
        compose: `// Compose / Android: HapticFeedbackConstants
val haptic = LocalHapticFeedback.current
Button(onClick = {
    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
}) { Text("Press") }`,
        swiftui: `// SwiftUI: UIImpactFeedbackGenerator
Button("Press") {
    let generator = UIImpactFeedbackGenerator(style: .medium)
    generator.impactOccurred()
}`
      }
    }
  ];

  const activePattern = patterns.find((p) => p.id === activePatternId) || patterns[0];

  const handleCopy = (lang: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Cross-Platform Code Rosetta Stone
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare idiomatic production patterns side-by-side: React 19 (Web), Jetpack Compose (KMP/Android), and SwiftUI (iOS).
          </p>
        </div>
      </div>

      {/* Pattern Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {patterns.map((p) => {
          const isSelected = p.id === activePatternId;
          return (
            <button
              key={p.id}
              onClick={() => setActivePatternId(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                isSelected
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-900/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Active Pattern Description */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
        <span className="font-semibold text-slate-200">{activePattern.name}: </span>
        <span>{activePattern.description}</span>
      </div>

      {/* 3-Way Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* React Column */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
              <Globe className="w-3.5 h-3.5" />
              <span>React 19 (Modern Web)</span>
            </div>
            <button
              onClick={() => handleCopy('react', activePattern.snippets.react)}
              className="hover:text-slate-200 text-slate-400 transition-colors"
              title="Copy code"
            >
              {copiedLang === 'react' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            <pre className="text-slate-300">
              <code>{activePattern.snippets.react}</code>
            </pre>
          </div>
        </div>

        {/* Compose Column */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Compose Multiplatform (KMP)</span>
            </div>
            <button
              onClick={() => handleCopy('compose', activePattern.snippets.compose)}
              className="hover:text-slate-200 text-slate-400 transition-colors"
              title="Copy code"
            >
              {copiedLang === 'compose' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            <pre className="text-slate-300">
              <code>{activePattern.snippets.compose}</code>
            </pre>
          </div>
        </div>

        {/* SwiftUI Column */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>SwiftUI (Native iOS / Swift 6)</span>
            </div>
            <button
              onClick={() => handleCopy('swiftui', activePattern.snippets.swiftui)}
              className="hover:text-slate-200 text-slate-400 transition-colors"
              title="Copy code"
            >
              {copiedLang === 'swiftui' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            <pre className="text-slate-300">
              <code>{activePattern.snippets.swiftui}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
