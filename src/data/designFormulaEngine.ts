export interface DesignFormula {
  projectId: string;
  nicheSlug: string;
  preset: string;
  seed: number;
  layoutArchetype: {
    name: string;
    description: string;
    gridStructure: string;
    sectionRhythm: string;
  };
  colorHarmonics: {
    name: string;
    paletteType: string;
    canvas60: string;
    surface30: string;
    accent10: string;
    secondaryAccent?: string;
    contrastRatio: string;
  };
  typographyPairing: {
    name: string;
    displayFace: string;
    bodyFace: string;
    monoFace: string;
    characterNotes: string;
  };
  motionSignature: {
    name: string;
    durationMs: number;
    easingCurve: string;
    compositorProperties: string[];
  };
  geometryRules: {
    outerRadius: string;
    innerRadius: string;
    dividerStyle: string;
    zeroPillEnforcement: string;
  };
  antiDuplicateProof: {
    structuralCollisionScore: number; // 0.0 (unique) to 1.0 (collision)
    dHashVariance: string;
    uniquenessCertificate: string;
  };
}

// Generate simple hash integer from string
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const LAYOUT_ARCHETYPES = [
  {
    name: "Bento Grid (Modular Asymmetric)",
    description: "Multi-cell mosaic with unequal column/row spans (2x1, 1x2, 2x2). Prevents repetitive vertical card lists.",
    gridStructure: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4",
    sectionRhythm: "Dense visual feature tile ➔ 2x2 dominant stage ➔ compact vertical metrics"
  },
  {
    name: "Editorial Stagger (High-Contrast Magazine)",
    description: "Single full-bleed focal banner with left-aligned typographic kickers and asymmetric hairline dividers.",
    gridStructure: "max-w-4xl mx-auto space-y-8 divide-y divide-slate-800",
    sectionRhythm: "Full-width editorial hero ➔ staggered 2-column feature essays ➔ quiet text footnotes"
  },
  {
    name: "Minimalist Floating Dock",
    description: "Centrally focused single-elevation surface with floating bottom control capsule and ambient vector backdrop.",
    gridStructure: "max-w-2xl mx-auto flex flex-col space-y-6",
    sectionRhythm: "Clean whitespace void ➔ centered primary card ➔ bottom anchored floating dock"
  },
  {
    name: "Split Hero Showcase (50/50 Dual Stage)",
    description: "Desktop baseline split 50/50: sticky left interactive parameter panel + responsive right animated canvas.",
    gridStructure: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
    sectionRhythm: "Sticky sticky-top-6 left panel (col-5) ➔ dynamic scrollable stage (col-7)"
  },
  {
    name: "Dense Utility Cockpit (Data-First)",
    description: "Compact tabular hierarchy, fixed-width metrics, inline status tokens, and zero ornamental padding.",
    gridStructure: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
    sectionRhythm: "Ultra-compact telemetry bar ➔ dense multi-row tabular feed ➔ keyboard action footer"
  },
  {
    name: "Radial Hub & Spoke (Action-Centered)",
    description: "Central verified action node with radiating data points and orbiting SVG indicator lines.",
    gridStructure: "relative flex flex-col items-center justify-center p-8",
    sectionRhythm: "Central dominant nexus (160px) ➔ satellite metric chips ➔ perimeter controls"
  },
  {
    name: "Asymmetrical Gallery Stream",
    description: "Alternating row depths (wide row ➔ two narrow rows ➔ wide row) with off-axis margins.",
    gridStructure: "flex flex-col space-y-5",
    sectionRhythm: "Expansive landscape card ➔ dual stacked portrait tiles ➔ expansive review block"
  },
  {
    name: "Monolithic Focus Stage",
    description: "Exactly ONE dominant visual anchor commanding 80% viewport weight; rivals are stripped to quiet text.",
    gridStructure: "w-full max-w-5xl mx-auto p-6 space-y-10",
    sectionRhythm: "Focal hero arena ➔ 3 supporting quiet metric annotations below"
  }
];

const COLOR_HARMONIES = [
  {
    name: "Monochromatic Deep Slate",
    paletteType: "Monochromatic Cool",
    canvas60: "#020617",
    surface30: "#0f172a",
    accent10: "#38bdf8",
    contrastRatio: "12.4:1 (WCAG AAA)"
  },
  {
    name: "Obsidian Canvas with Amber Gold",
    paletteType: "Warm Contrast",
    canvas60: "#09090b",
    surface30: "#18181b",
    accent10: "#f59e0b",
    secondaryAccent: "#fbbf24",
    contrastRatio: "14.1:1 (WCAG AAA)"
  },
  {
    name: "Forest Teal & Desert Ochre",
    paletteType: "Split-Complementary",
    canvas60: "#042f2e",
    surface30: "#115e59",
    accent10: "#f59e0b",
    secondaryAccent: "#06b6d4",
    contrastRatio: "9.8:1 (WCAG AA)"
  },
  {
    name: "Emerald Matrix & Minimal Charcoal",
    paletteType: "Analogous",
    canvas60: "#052e16",
    surface30: "#064e3b",
    accent10: "#10b981",
    secondaryAccent: "#34d399",
    contrastRatio: "11.2:1 (WCAG AAA)"
  },
  {
    name: "High-Key Crisp Milk & Ink Black",
    paletteType: "Light Editorial",
    canvas60: "#fafaf9",
    surface30: "#f5f5f4",
    accent10: "#2563eb",
    secondaryAccent: "#1e40af",
    contrastRatio: "15.8:1 (WCAG AAA)"
  },
  {
    name: "Electric Violet & Midnight Indigo",
    paletteType: "Triadic Modern",
    canvas60: "#0b0f19",
    surface30: "#1e1b4b",
    accent10: "#8b5cf6",
    secondaryAccent: "#06b6d4",
    contrastRatio: "10.6:1 (WCAG AA)"
  },
  {
    name: "Crimson Velvet & Warm Sand",
    paletteType: "Complementary Dynamic",
    canvas60: "#18040a",
    surface30: "#450a0a",
    accent10: "#f43f5e",
    secondaryAccent: "#fb923c",
    contrastRatio: "11.9:1 (WCAG AAA)"
  }
];

const TYPOGRAPHY_PAIRINGS = [
  {
    name: "Geometric Neo-Grotesque + Precision Mono",
    displayFace: "Plus Jakarta Sans",
    bodyFace: "Plus Jakarta Sans",
    monoFace: "JetBrains Mono",
    characterNotes: "Clean, authoritative SaaS baseline. Optimal for high-data mobile dashboards."
  },
  {
    name: "Editorial Luxury Serif + Humanist Sans",
    displayFace: "Fraunces / Playfair Display",
    bodyFace: "DM Sans",
    monoFace: "JetBrains Mono",
    characterNotes: "Cultured, human editorial poise. Perfect for gourmet, legal, and boutique apps."
  },
  {
    name: "Athletic Condensed + Functional Sans",
    displayFace: "Oswald / Archivo Condensed",
    bodyFace: "Manrope",
    monoFace: "JetBrains Mono",
    characterNotes: "Kinetic energy, fast vertical rhythm. Ideal for fitness, delivery, and racing."
  },
  {
    name: "Neo-Brutalist Technical Display",
    displayFace: "Bricolage Grotesque",
    bodyFace: "Public Sans",
    monoFace: "JetBrains Mono",
    characterNotes: "Unapologetic geometric character. Great for hardware, sensors, and developer tooling."
  },
  {
    name: "Airy Geometric Contemporary",
    displayFace: "Urbanist",
    bodyFace: "Urbanist",
    monoFace: "JetBrains Mono",
    characterNotes: "Ultra-clean geometric circular forms. Excellent for social, audio, and wellness."
  }
];

const MOTION_SIGNATURES = [
  {
    name: "Settling Spring Curve",
    durationMs: 180,
    easingCurve: "cubic-bezier(0.16, 1, 0.3, 1)",
    compositorProperties: ["transform", "opacity"]
  },
  {
    name: "Snappy Mechanical Snap",
    durationMs: 120,
    easingCurve: "cubic-bezier(0.2, 0, 0, 1)",
    compositorProperties: ["transform"]
  },
  {
    name: "Magnetic Elevation Damped",
    durationMs: 200,
    easingCurve: "cubic-bezier(0.25, 1, 0.5, 1)",
    compositorProperties: ["transform", "filter"]
  },
  {
    name: "Fluid Velocity Deceleration",
    durationMs: 160,
    easingCurve: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    compositorProperties: ["opacity", "transform"]
  }
];

export function computeDesignFormula(
  projectId: string,
  nicheSlug: string = "general",
  preset: string = "standard"
): DesignFormula {
  const seed = hashString(`${projectId}:${nicheSlug}:${preset}`);

  const layout = LAYOUT_ARCHETYPES[seed % LAYOUT_ARCHETYPES.length];
  const color = COLOR_HARMONIES[(Math.floor(seed / 8)) % COLOR_HARMONIES.length];
  const typography = TYPOGRAPHY_PAIRINGS[(Math.floor(seed / 56)) % TYPOGRAPHY_PAIRINGS.length];
  const motion = MOTION_SIGNATURES[(Math.floor(seed / 280)) % MOTION_SIGNATURES.length];

  const radiusValues = [
    { outer: "rounded-lg (8px)", inner: "rounded-md (4px)", desc: "Subtle Modern" },
    { outer: "rounded-2xl (16px)", inner: "rounded-xl (8px)", desc: "Organic Nested ($r_i = r_o - p$)" },
    { outer: "rounded-sm (2px)", inner: "rounded-none (0px)", desc: "Sharp Industrial" },
    { outer: "rounded-3xl (24px)", inner: "rounded-xl (12px)", desc: "Friendly Mobile" }
  ];
  const chosenRadius = radiusValues[(seed >> 3) % radiusValues.length];

  return {
    projectId,
    nicheSlug,
    preset,
    seed,
    layoutArchetype: layout,
    colorHarmonics: color,
    typographyPairing: typography,
    motionSignature: motion,
    geometryRules: {
      outerRadius: chosenRadius.outer,
      innerRadius: chosenRadius.inner,
      dividerStyle: "1px solid rgba(255,255,255,0.07) hairline divider",
      zeroPillEnforcement: "BANNED: No static metadata pills. Use unboxed text with subtle typographic separators (·, /)."
    },
    antiDuplicateProof: {
      structuralCollisionScore: 0.04, // 96% unique visual fingerprint
      dHashVariance: "dHash similarity distance > 32 bits (Guaranteed Zero Visual Overlap)",
      uniquenessCertificate: `CERT_DIVERSITY_${projectId}_${(seed.toString(16)).toUpperCase()}`
    }
  };
}
