import { ProjectTemplateFile, GeneratorOptions } from '../types';

export const templateFiles: ProjectTemplateFile[] = [
  {
    name: 'libs.versions.toml',
    path: 'gradle/libs.versions.toml',
    format: 'toml',
    category: 'build',
    description: 'Centralized Gradle Version Catalog managing dependencies, plugins, and libraries for Android and KMP.',
    getContent: (opts: GeneratorOptions) => `[versions]
kotlin = "2.1.10"
agp = "8.8.0"
compose-multiplatform = "1.7.3"
androidx-activityCompose = "1.10.0"
androidx-lifecycle = "2.8.4"
${opts.includeRoomKmp ? 'androidx-room = "2.7.0-alpha12"\nsqlite = "2.5.0-alpha12"\n' : ''}${opts.includeKtor ? 'ktor = "3.1.0"\n' : ''}coroutines = "1.10.1"
serialization = "1.8.0"
${opts.includeFilament ? 'filament = "1.56.0"\n' : ''}koin = "4.0.0"

[libraries]
androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activityCompose" }
androidx-lifecycle-viewmodel = { module = "org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose", version.ref = "androidx-lifecycle" }
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "serialization" }
${opts.includeKtor ? `ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor" }
ktor-serialization-kotlinx-json = { module = "io.ktor:ktor-serialization-kotlinx-json", version.ref = "ktor" }
` : ''}${opts.includeRoomKmp ? `androidx-room-runtime = { module = "androidx.room:room-runtime", version.ref = "androidx-room" }
androidx-room-compiler = { module = "androidx.room:room-compiler", version.ref = "androidx-room" }
sqlite-bundled = { module = "androidx.sqlite:sqlite-bundled", version.ref = "sqlite" }
` : ''}${opts.includeFilament ? `filament-android = { module = "com.google.android.filament:filament-android", version.ref = "filament" }
filament-utils = { module = "com.google.android.filament:filament-utils-android", version.ref = "filament" }
filament-gltfio = { module = "com.google.android.filament:gltfio-android", version.ref = "filament" }
` : ''}koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-compose = { module = "io.insert-koin:koin-compose", version.ref = "koin" }

[plugins]
androidApplication = { id = "com.android.application", version.ref = "agp" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
composeMultiplatform = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
composeCompiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
kotlinSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
${opts.includeRoomKmp ? 'ksp = { id = "com.google.devtools.ksp", version = "2.1.10-1.0.29" }\nandroidxRoom = { id = "androidx.room", version.ref = "androidx-room" }\n' : ''}`
  },
  {
    name: 'gradle.properties',
    path: 'gradle.properties',
    format: 'properties',
    category: 'config',
    description: 'JVM memory settings, AndroidX optimization flags, and Kotlin Multiplatform flags.',
    getContent: (_opts: GeneratorOptions) => `# JVM & Memory Allocation for Parallel Compilation
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m -XX:+UseParallelGC -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configuration-cache=true
org.gradle.vfs.watch=true

# AndroidX Core Settings
android.useAndroidX=true
android.nonTransitiveRClass=true
android.defaults.buildfeatures.buildconfig=true

# Kotlin Multiplatform Settings
kotlin.code.style=official
kotlin.mpp.enableCInteropCommonization=true
kotlin.mpp.androidSourceSetLayoutVersion=2
compose.experimental.uikit.enabled=true
`
  },
  {
    name: 'settings.gradle.kts',
    path: 'settings.gradle.kts',
    format: 'kotlin',
    category: 'build',
    description: 'Gradle plugin management and subproject module declarations.',
    getContent: (opts: GeneratorOptions) => `pluginManagement {
    repositories {
        google {
            mavenContent {
                includeGroupAndSubgroups("androidx")
                includeGroupAndSubgroups("com.android")
                includeGroupAndSubgroups("com.google")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${opts.projectName.replace(/\s+/g, '')}"
include(":composeApp")
`
  },
  {
    name: '.gitignore',
    path: '.gitignore',
    format: 'gitignore',
    category: 'config',
    description: 'Comprehensive ignore rules across Android, iOS (Xcode), Kotlin Multiplatform, and Web.',
    getContent: (_opts: GeneratorOptions) => `# Build Output & Binaries
.gradle/
build/
**/build/
dist/
node_modules/

# Local Overrides & Secrets
local.properties
.env*
!.env.example

# IDE & Editor Settings
.idea/
*.iml
*.iws
*.ipr
.vscode/
*.swp
.DS_Store
Thumbs.db
*.log

# iOS & Apple (Xcode)
*.mode1v3
*.mode2v3
*.moved-aside
*.pbxuser
*.perspectivev3
xcuserdata/
DerivedData/
*.hmap
*.xccheckout
*.xcscmblueprint
.build/
Pods/

# Captures & Profiler Reports
captures/
.externalNativeBuild/
.cxx/
*.apk
*.aab
`
  },
  {
    name: '.editorconfig',
    path: '.editorconfig',
    format: 'config',
    category: 'config',
    description: 'Unified cross-IDE formatting rules for Kotlin, Swift, TypeScript, JSON, and YAML.',
    getContent: (_opts: GeneratorOptions) => `root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.{kt,kts}]
indent_size = 4
max_line_length = 120

[*.swift]
indent_size = 4

[*.{json,yaml,yml,md,toml}]
indent_size = 2
`
  },
  {
    name: 'ci.yml',
    path: '.github/workflows/ci.yml',
    format: 'yaml',
    category: 'ci',
    description: 'Multiplatform CI pipeline with parallel matrix builds, caching, and automated testing.',
    getContent: (opts: GeneratorOptions) => `name: Multiplatform CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate-kmp:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
          cache: 'gradle'

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew

      - name: Run Detekt Static Analysis
        run: ./gradlew detekt

      - name: Build Android Artifact
        run: ./gradlew :composeApp:assembleDebug :composeApp:testDebugUnitTest

  validate-ios:
    runs-on: macos-14
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
          cache: 'gradle'

      - name: Compile Kotlin iOS Framework
        run: |
          chmod +x gradlew
          ./gradlew :composeApp:compileKotlinIosX64
`
  },
  {
    name: 'detekt.yml',
    path: 'config/detekt/detekt.yml',
    format: 'yaml',
    category: 'config',
    description: 'Static analysis and quality guardrails for Kotlin Multiplatform.',
    getContent: (_opts: GeneratorOptions) => `build:
  maxIssues: 0
  weights:
    complexity: 2
    formatting: 1

complexity:
  LongMethod:
    threshold: 60
  ComplexCondition:
    threshold: 4

naming:
  FunctionNaming:
    functionPattern: '^[a-zA-Z][a-zA-Z0-9]*$'
    ignoreAnnotated: ['Composable']

style:
  WildcardImport:
    active: true
  UnusedPrivateMember:
    active: true
  MagicNumber:
    active: false
`
  },
  {
    name: 'metadata.json',
    path: 'metadata.json',
    format: 'json',
    category: 'config',
    description: 'Structured metadata schema, capabilities, and platform permissions.',
    getContent: (opts: GeneratorOptions) => JSON.stringify({
      name: opts.projectName,
      package: opts.packageName,
      architecture: {
        pattern: "MVI Unidirectional Data Flow",
        renderingPipeline: opts.includeFilament ? "Filament PBR Native Viewport" : "Compose Hardware Canvas",
        persistence: opts.includeRoomKmp ? "AndroidX Room Multiplatform" : "In-Memory StateFlow",
        networking: opts.includeKtor ? "Ktor 3.x Multiplatform Client" : "Standard HTTP"
      },
      standards: {
        zeroEmojiPolicy: opts.includeStrictZeroEmoji,
        versionCatalog: opts.versionCatalogEnabled,
        compositorAnimationBudgetMs: 200
      },
      targets: opts.targetPlatforms
    }, null, 2)
  },
  {
    name: 'README.md',
    path: 'README.md',
    format: 'markdown',
    category: 'docs',
    description: 'Clean repository documentation with architecture, build scripts, and guidelines.',
    getContent: (opts: GeneratorOptions) => `# ${opts.projectName}

> Production Multiplatform application powered by **Compose Multiplatform**, **Kotlin 2.x**, and hardware-accelerated vector graphics.

---

## Architecture & Standards
- **Zero-Emoji Discipline**: All UI icons and status graphics use vector paths with programmatic stroke controls.
- **Dependency Catalog**: Single-source-of-truth in \`gradle/libs.versions.toml\`.
- **Graphics Pipeline**: ${opts.includeFilament ? 'Google Filament PBR Engine with explicit DisposableEffect lifecycle teardown.' : 'Declarative Compose Hardware Canvas with sub-pixel path animations.'}
- **Data Layer**: ${opts.includeRoomKmp ? 'AndroidX Room KMP (SQLite) shared across Android and iOS.' : 'Reactive Kotlin StateFlow.'}

---

## Getting Started

### Prerequisites
- JDK 17+ (Temurin or Zulu)
- Android Studio Ladybug / Meerkat or IntelliJ IDEA with KMP plugin
- Xcode 16+ (for iOS build targets)

### Building Android
\`\`\`bash
./gradlew :composeApp:assembleDebug
\`\`\`

### Building iOS Framework
\`\`\`bash
./gradlew :composeApp:compileKotlinIosX64
\`\`\`

---

## License
Apache-2.0
`
  }
];
