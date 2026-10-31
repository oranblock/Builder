import { GeneratorOptions, PlatformTarget } from '../types';

export interface ArchitecturePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  options: GeneratorOptions;
}

export const architecturePresets: ArchitecturePreset[] = [
  {
    id: 'kmp-filament-3d',
    name: '3D PBR Graphics & High-FPS',
    badge: 'Filament + Shaders',
    description: 'Hardware-accelerated 3D glTF models with Google Filament, AGSL runtime shaders, and leak-proof JNI lifecycles.',
    options: {
      projectName: 'FilamentPbrApp',
      packageName: 'com.graphics.filamentpbr',
      targetPlatforms: ['kmp', 'android', 'ios'],
      includeFilament: true,
      includeAgslShaders: true,
      includeRoomKmp: false,
      includeKtor: true,
      includeCiWorkflow: true,
      includeLinterConfigs: true,
      includeStrictZeroEmoji: true,
      versionCatalogEnabled: true,
    },
  },
  {
    id: 'kmp-enterprise-full',
    name: 'Enterprise KMP Full-Stack',
    badge: 'Room + Ktor + CI',
    description: 'Shared SQLite database with AndroidX Room KMP, Ktor 3.x networking, type-safe navigation, and multiplatform CI matrix.',
    options: {
      projectName: 'EnterpriseKmp',
      packageName: 'com.enterprise.app',
      targetPlatforms: ['kmp', 'android', 'ios', 'web'],
      includeFilament: false,
      includeAgslShaders: false,
      includeRoomKmp: true,
      includeKtor: true,
      includeCiWorkflow: true,
      includeLinterConfigs: true,
      includeStrictZeroEmoji: true,
      versionCatalogEnabled: true,
    },
  },
  {
    id: 'minimal-vector-first',
    name: 'Ultra-Lightweight & Vector First',
    badge: 'Zero-Bloat',
    description: 'Strict zero-emoji compliance, pure procedural vector paths, zero reflection, and sub-100ms startup speeds.',
    options: {
      projectName: 'VectorCoreApp',
      packageName: 'com.core.vectorapp',
      targetPlatforms: ['kmp', 'android', 'ios', 'web'],
      includeFilament: false,
      includeAgslShaders: true,
      includeRoomKmp: false,
      includeKtor: true,
      includeCiWorkflow: true,
      includeLinterConfigs: true,
      includeStrictZeroEmoji: true,
      versionCatalogEnabled: true,
    },
  },
  {
    id: 'native-dual-mobile',
    name: 'Native Android + Swift 6',
    badge: 'Pure Native',
    description: 'Independent native pipelines: Jetpack Compose on Android with AGSL, SwiftUI with SwiftData and Metal on iOS.',
    options: {
      projectName: 'NativeDualCore',
      packageName: 'com.native.dualcore',
      targetPlatforms: ['android', 'ios'],
      includeFilament: true,
      includeAgslShaders: true,
      includeRoomKmp: true,
      includeKtor: false,
      includeCiWorkflow: true,
      includeLinterConfigs: true,
      includeStrictZeroEmoji: true,
      versionCatalogEnabled: true,
    },
  },
];
