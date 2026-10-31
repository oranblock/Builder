export type PlatformTarget = 'kmp' | 'android' | 'ios' | 'web';

export type FileFormat = 'toml' | 'properties' | 'yaml' | 'json' | 'markdown' | 'gitignore' | 'kotlin' | 'swift' | 'typescript' | 'config';

export interface ProjectTemplateFile {
  name: string;
  path: string;
  format: FileFormat;
  description: string;
  category: 'config' | 'build' | 'ci' | 'docs' | 'source';
  getContent: (options: GeneratorOptions) => string;
}

export interface GeneratorOptions {
  projectName: string;
  packageName: string;
  targetPlatforms: PlatformTarget[];
  includeFilament: boolean;
  includeAgslShaders: boolean;
  includeRoomKmp: boolean;
  includeKtor: boolean;
  includeCiWorkflow: boolean;
  includeLinterConfigs: boolean;
  includeStrictZeroEmoji: boolean;
  versionCatalogEnabled: boolean;
}

export interface RuleCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  rules: RuleItem[];
}

export interface RuleItem {
  id: string;
  title: string;
  platform: PlatformTarget | 'universal';
  level: 'mandatory' | 'recommended' | 'anti-pattern';
  summary: string;
  details: string;
  codeSnippet?: {
    language: string;
    badCode?: string;
    goodCode: string;
    explanation: string;
  };
  tags: string[];
}

export interface LibraryComparison {
  name: string;
  category: string;
  status: 'recommended' | 'avoid';
  platform: PlatformTarget | 'universal';
  modernAlternative?: string;
  expenseReason: string;
  recommendedVersion?: string;
  benefits: string[];
}

export interface VectorGraphicDemo {
  id: string;
  title: string;
  description: string;
  svgCode: string;
  composeCode: string;
  swiftUiCode: string;
}
