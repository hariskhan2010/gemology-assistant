import type { GemKnowledge } from "./types"

export const tourmaline: GemKnowledge = {
  name: "Tourmaline",
  group: "Tourmaline",
  properties: {
    ri: "1.614–1.666",
    birefringence: "0.014–0.030",
    sg: "3.02–3.26",
    mohs: 7,
    crystal: "Hexagonal (trigonal)",
    optical: "Uniaxial (−)",
  },
  chromophore: "Mn²⁺ (pink/red), Fe²⁺ (blue), Cr³⁺ (chrome), Cu²⁺+Mn²⁺ (Paraíba), Mn+Fe (watermelon)",
  ccf: "Variable: red (chrome), inert (most), greenish (Fe-rich)",
  uv: {
    lwuv: "Weak red possible (rubellite)",
    swuv: "Inert",
  },
  spectroscope: "Variable by species; strong pleochroism diagnostic",
  inclusions: ["Tubular hollow cavities", "Fingerprints", "Liquid inclusions", "Crystals"],
  treatments: ["Heat", "Irradiation", "Coating", "Fracture filling"],
  origins: ["Brazil", "Afghanistan", "Pakistan", "Madagascar", "USA (California)", "Nigeria", "Mozambique"],
  syntheticDetection: "Rare; flux-grown tourmaline possible but uncommon",
  simulants: "Varied by colour — cross-reference RI, SG, pleochroism",
  care: "Ultrasonic safe for most, but avoid for fractured stones. Protect from hard knocks.",
  description: "Extremely versatile with more colour varieties than any gem. Paraíba neon blue-green most expensive. Watermelon = pink core, green rind.",
}
