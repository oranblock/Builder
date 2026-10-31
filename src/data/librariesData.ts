import { LibraryComparison } from '../types';

export const librariesData: LibraryComparison[] = [
  // Web
  {
    name: 'motion (Motion for React)',
    category: 'Animation & Vectors',
    status: 'recommended',
    platform: 'web',
    recommendedVersion: '^12.23.0',
    expenseReason: 'Lightweight modern successor to Framer Motion. Zero-lag SVG pathLength, hardware-accelerated transforms, and React 19 concurrent mode ready.',
    benefits: ['Optimized for SVG vector drawings', 'React 19 support', 'Small bundle footprint', 'Accessible prefers-reduced-motion']
  },
  {
    name: 'framer-motion (v10/v11 legacy)',
    category: 'Animation & Vectors',
    status: 'avoid',
    platform: 'web',
    modernAlternative: 'motion (v12+)',
    expenseReason: 'Carries legacy polyfills and outdated React context mechanics; significantly larger bundle size than new motion package.',
    benefits: []
  },
  {
    name: 'lucide-react',
    category: 'Iconography',
    status: 'recommended',
    platform: 'web',
    recommendedVersion: '^0.546.0',
    expenseReason: 'Tree-shakable SVG vector icons with uniform 2px stroke, clean geometric alignment, and zero runtime icon-font flicker.',
    benefits: ['100% tree-shakable', 'Consistent 24x24 grid', 'Accessible SVG titles', 'Zero emojis needed']
  },
  {
    name: 'Font Awesome / Icon Fonts',
    category: 'Iconography',
    status: 'avoid',
    platform: 'web',
    modernAlternative: 'lucide-react or inline SVGs',
    expenseReason: 'Forces downloading 2MB+ .woff2 font files even if only 5 icons are displayed; causes flash of invisible text (FOIT) on initial paint.',
    benefits: []
  },
  {
    name: 'Tailwind CSS v4',
    category: 'Styling',
    status: 'recommended',
    platform: 'web',
    recommendedVersion: '^4.3.0',
    expenseReason: 'Zero-runtime CSS engine written in Rust (Oxide). Configured via CSS-first directives with dynamic custom-variant dark tokens.',
    benefits: ['Zero JavaScript runtime overhead', 'Instant compile time', '100% cascade-safe', 'Native dark mode']
  },
  {
    name: 'styled-components / Emotion',
    category: 'Styling',
    status: 'avoid',
    platform: 'web',
    modernAlternative: 'Tailwind CSS v4 / CSS Modules',
    expenseReason: 'Injects <style> tags at runtime on the main thread, causing severe interaction latency and incompatibility with modern React 19 architectures.',
    benefits: []
  },
  {
    name: 'Native Intl / date-fns',
    category: 'Dates & Time',
    status: 'recommended',
    platform: 'web',
    recommendedVersion: 'Native ECMAScript / date-fns v4',
    expenseReason: 'Built directly into all modern web browsers or tree-shaken down to only the exact formatting functions imported.',
    benefits: ['Zero bundle overhead for Intl', 'Pure functional methods', 'Immutable', 'Full timezone support']
  },
  {
    name: 'moment.js',
    category: 'Dates & Time',
    status: 'avoid',
    platform: 'web',
    modernAlternative: 'Native Intl.DateTimeFormat or date-fns',
    expenseReason: 'Monolithic >300KB bundle size, mutable dates that cause subtle mutation bugs, deprecated by its original maintenance team.',
    benefits: []
  },

  // KMP & Android
  {
    name: 'AndroidX Room KMP',
    category: 'Persistence / Database',
    status: 'recommended',
    platform: 'kmp',
    recommendedVersion: '2.7.0+',
    expenseReason: 'Google official multiplatform SQLite engine. Verifies SQL queries at compile time and runs identically on Android, iOS, and JVM.',
    benefits: ['Compile-time SQL syntax checks', 'Reactive Coroutine Flow', 'Automatic schema migrations', 'Shared in commonMain']
  },
  {
    name: 'Realm / Raw SQLite C-Bridges',
    category: 'Persistence / Database',
    status: 'avoid',
    platform: 'kmp',
    modernAlternative: 'AndroidX Room KMP or SQLDelight 2',
    expenseReason: 'Heavy proprietary binaries, large APK/IPA bloat, and fragile C-pointer bridges across Darwin and Android.',
    benefits: []
  },
  {
    name: 'Coil 3.x',
    category: 'Image & Vector Loading',
    status: 'recommended',
    platform: 'kmp',
    recommendedVersion: '3.1.0',
    expenseReason: 'Built specifically for Kotlin Multiplatform and Compose. Loads vectors, network images, and cached assets across Android, iOS, Desktop, and Wasm.',
    benefits: ['First-class Compose Multiplatform', 'Network and memory disk cache', 'SVG vector decoding', 'Kotlin Coroutines native']
  },
  {
    name: 'kotlinx.serialization',
    category: 'JSON / Serialization',
    status: 'recommended',
    platform: 'kmp',
    recommendedVersion: '1.8.0',
    expenseReason: 'Compiler-plugin based serialization with zero runtime reflection. Works seamlessly across Kotlin Multiplatform and iOS.',
    benefits: ['Zero runtime reflection', 'Type safe', 'Compatible with R8 / ProGuard', 'Multiplatform (Android & iOS)']
  },
  {
    name: 'Gson',
    category: 'JSON / Serialization',
    status: 'avoid',
    platform: 'android',
    modernAlternative: 'kotlinx.serialization or Moshi',
    expenseReason: 'Relies heavily on Java reflection. Breaks under ProGuard/R8 minification, slows cold start times, and is incompatible with iOS/KMP.',
    benefits: []
  },
  {
    name: 'Ktor 3.x Client',
    category: 'Networking',
    status: 'recommended',
    platform: 'kmp',
    recommendedVersion: '3.1.0',
    expenseReason: 'Asynchronous multiplatform HTTP client with zero-copy engines (Darwin on iOS, OkHttp on Android, CIO on Desktop).',
    benefits: ['Shared networking in commonMain', 'WebSocket & SSE support', 'Typed request/response pipelines', 'Coroutines native']
  },
  {
    name: 'Koin 4.x / kotlin-inject',
    category: 'Dependency Injection',
    status: 'recommended',
    platform: 'kmp',
    recommendedVersion: '4.0.0',
    expenseReason: 'Pragmatic, lightweight dependency injection for Kotlin Multiplatform without heavy annotation processor overhead.',
    benefits: ['Multiplatform support', 'Compose ViewModel scope integration', 'Fast compilation', 'No reflection']
  },

  // iOS / Swift
  {
    name: 'Swift 6 @Observable & SwiftData',
    category: 'State & Persistence',
    status: 'recommended',
    platform: 'ios',
    recommendedVersion: 'iOS 17+ / Swift 6',
    expenseReason: 'Apple native macro-driven reactive state and persistence. Eliminates Combine boilerplate and heavy third-party ORMs.',
    benefits: ['Fine-grained property tracking', 'Zero external dependencies', 'Declarative Swift model schemas', 'CoreData successor']
  },
  {
    name: 'RxSwift / Combine (legacy patterns)',
    category: 'State & Reactive',
    status: 'avoid',
    platform: 'ios',
    modernAlternative: 'Swift Concurrency (AsyncStream) & Observation',
    expenseReason: 'Verbose subscription disposal bags, thread-safety pitfalls, and lack of integration with Swift 6 strict concurrency checks.',
    benefits: []
  }
];
