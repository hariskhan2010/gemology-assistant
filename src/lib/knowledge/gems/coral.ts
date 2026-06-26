import type { GemKnowledge } from "./types"

export const coral: GemKnowledge = {
  name: "Coral",
  group: "Organic",
  properties: {
    ri: "1.486–1.658",
    birefringence: "N/A (amorphous/biogenic)",
    sg: "2.60–2.70",
    mohs: 3,
    crystal: "Amorphous (biogenic calcium carbonate)",
    optical: "Aggregate",
  },
  chromophore: "Carotenoid pigments (red/pink)",
  ccf: "Variable",
  uv: {
    lwuv: "Weak to moderate",
    swuv: "Weak",
  },
  spectroscope: "N/A",
  inclusions: ["Porous structure (natural)", "Organic grain"],
  treatments: ["Bleaching", "Dyeing", "Impregnation"],
  origins: ["Mediterranean Sea (red coral)", "Japan/Taiwan (pink coral)", "Hawaii (black/gold coral)"],
  syntheticDetection: "Synthetic coral not commercially significant; imitations common (plastic, glass, dyed marble)",
  simulants: "Gilson synthetic coral (uniform, no porous structure), plastic (hot point), dyed marble (acid test — effervesces), glass (heavier)",
  care: "Very soft (Mohs 3). Avoid acid, heat, chemicals, ultrasonic. Damp cloth only.",
  description: "Skeleton of marine coral polyps. Precious coral (Corallium rubrum) deep red most valued.",
}
