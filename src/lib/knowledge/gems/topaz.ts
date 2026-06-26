import type { GemKnowledge } from "./types"

export const topaz: GemKnowledge = {
  name: "Topaz",
  group: "Topaz",
  properties: {
    ri: "1.606–1.638",
    birefringence: "0.008–0.010",
    sg: "3.49–3.57",
    mohs: 8,
    crystal: "Orthorhombic",
    optical: "Biaxial (+)",
  },
  chromophore: "Cr³⁺ (pink/red), colour centres (blue irradiated)",
  ccf: "Inert",
  uv: {
    lwuv: "Variable",
    swuv: "Variable",
  },
  spectroscope: "603, 626, 690nm (irradiated blue topaz diagnostic lines)",
  inclusions: ["Two-phase inclusions", "Fingerprints", "Frosted facet edges (perfect basal cleavage — handle carefully)"],
  treatments: ["Irradiation + heat (to produce blue)", "Heat (to modify colour)", "Coating (Mystic Topaz)"],
  origins: ["Brazil", "Pakistan", "Russia", "Mexico", "USA", "Sri Lanka"],
  syntheticDetection: "Synthetic topaz rare; most topaz is natural (blue is almost always irradiated)",
  simulants: "Aquamarine (lower RI, SG, different crystal), citrine (lower RI, SG), sapphire (higher RI, SG), zircon (higher RI, DR)",
  care: "Avoid ultrasonic (perfect cleavage). Warm soapy water. Protect from hard knocks. Mystic Topaz = coating can wear off.",
  description: "Hard silicate. Imperial (golden-pink-orange) most valuable. Blue almost always irradiated.",
}
