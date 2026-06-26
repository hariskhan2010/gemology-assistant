import type { GemKnowledge } from "./types"

export const alexandrite: GemKnowledge = {
  name: "Alexandrite",
  group: "Chrysoberyl",
  properties: {
    ri: "1.741–1.760",
    birefringence: "0.008–0.010",
    sg: "3.70–3.78",
    mohs: 8.5,
    crystal: "Orthorhombic",
    optical: "Biaxial (+)",
  },
  chromophore: "Cr³⁺",
  ccf: "Strong red (both daylight and incandescent)",
  uv: {
    lwuv: "Weak-moderate red",
    swuv: "Weak",
  },
  spectroscope: "Cr³⁺ lines",
  inclusions: ["Fingerprints", "Tubular inclusions", "Silk"],
  treatments: ["None (colour-change is natural)"],
  origins: ["Russia (Ural Mountains — original source)", "Sri Lanka", "Brazil", "Tanzania", "India", "Madagascar"],
  syntheticDetection: "Czochralski-grown: curved striae, metallic inclusions (iridium/platinum), flat FTIR (no hydrogen peaks). Flux-grown: flux residues.",
  simulants: "Colour-change sapphire (lower birefringence), colour-change spinel (SR, no pleochroism), colour-change garnet (SR, lower hardness)",
  care: "Very durable (Mohs 8.5). Ultrasonic safe. Protect from hard knocks.",
  description: "Colour-change chrysoberyl: green (daylight) / red (incandescent). Russian with strong change most valuable.",
}
