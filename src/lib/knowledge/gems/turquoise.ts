import type { GemKnowledge } from "./types"

export const turquoise: GemKnowledge = {
  name: "Turquoise",
  group: "Phosphate",
  properties: {
    ri: "1.61–1.65",
    birefringence: "N/A (cryptocrystalline)",
    sg: "2.60–2.80",
    mohs: 5,
    crystal: "Triclinic (cryptocrystalline)",
    optical: "Aggregate",
  },
  chromophore: "Cu²⁺",
  ccf: "Weak brownish red",
  uv: {
    lwuv: "Weak blue-white",
    swuv: "Inert",
  },
  spectroscope: "425nm broad band",
  inclusions: ["Matrix (host rock veins)", "Cryptocrystalline texture"],
  treatments: ["Stabilization (resin impregnation)", "Dyeing", "Reconstitution", "Zachery treatment"],
  origins: ["USA (Arizona, Nevada, New Mexico)", "Iran", "China", "Egypt (Sinai)", "Tibet", "Mexico"],
  syntheticDetection: "Synthetic turquoise exists (Gilson); look for more uniform colour, blue SWUV, no matrix, composition different",
  simulants: "Howlite (strong blue LWUV, lower SG), magnesite (lower SG), dyed chalcedony (no Cu lines), plastic (burn test)",
  care: "Never ultrasonic, never heat, avoid chemicals, acids, perfumes (porous). Damp cloth only. Most turquoise is stabilized.",
  description: "Hydrated copper aluminium phosphate. Sky-blue Persian finest. Most is stabilized (naturally soft and porous).",
}
