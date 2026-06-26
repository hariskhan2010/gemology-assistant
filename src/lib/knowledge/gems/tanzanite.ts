import type { GemKnowledge } from "./types"

export const tanzanite: GemKnowledge = {
  name: "Tanzanite",
  group: "Zoisite",
  properties: {
    ri: "1.685–1.707",
    birefringence: "0.006–0.013",
    sg: "3.35",
    mohs: 6.5,
    crystal: "Orthorhombic",
    optical: "Biaxial (+)",
  },
  chromophore: "V⁴⁺",
  ccf: "Greenish",
  uv: {
    lwuv: "Variable",
    swuv: "Variable",
  },
  spectroscope: "N/A",
  inclusions: ["Fingerprints", "Growth tubes"],
  treatments: ["Heat (mandatory — removes brown component)"],
  origins: ["Tanzania (single location — Merelani Hills)"],
  syntheticDetection: "Rare; some flux-grown zoisite exists but uncommon",
  simulants: "Sapphire (higher RI, SG, no trichroism), iolite (lower RI, SG, trichroic), blue spinel (SR, CCF greenish)",
  care: "Avoid ultrasonic, heat, sudden temperature changes (Mohs 6.5, brittle). Warm soapy water only.",
  description: "Blue-violet zoisite, single source Tanzania. Strong trichroic: blue/violet/burgundy. Heat treatment standard.",
}
