import type { GemKnowledge } from "./types"

export const zircon: GemKnowledge = {
  name: "Zircon",
  group: "Zircon",
  properties: {
    ri: "1.777–1.987",
    birefringence: "0.059 (very high)",
    sg: "4.60–4.80",
    mohs: 7.5,
    crystal: "Tetragonal",
    optical: "Uniaxial (+); SR for metamict low type",
  },
  chromophore: "U⁴⁺, Fe, various colour centres",
  ccf: "Variable",
  uv: {
    lwuv: "Variable",
    swuv: "Variable",
  },
  spectroscope: "653.5, 659, 662nm U lines (diagnostic)",
  inclusions: ["Strong facet doubling (very high birefringence — diagnostic)", "Colour zoning", "Crystals"],
  treatments: ["Heat (produces blue, colourless, golden)", "Irradiation"],
  origins: ["Cambodia", "Sri Lanka", "Myanmar", "Thailand", "Australia (Argyle)", "Tanzania"],
  syntheticDetection: "Not synthetically produced; synthetic cubic zirconia (CZ) is completely different material",
  simulants: "CZ (SR, higher SG 5.6-6.0, no facet doubling), diamond (lower SG, no facet doubling), synthetic spinel (SR, no facet doubling)",
  care: "Brittle — avoid ultrasonic. Heat-treated zircons may revert colour. Protect from knocks.",
  description: "Natural gem with high dispersion and fire. Heat-treated blue most popular. NOT cubic zirconia.",
}
