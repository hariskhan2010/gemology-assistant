import type { GemKnowledge } from "./types"

export const lapis: GemKnowledge = {
  name: "Lapis Lazuli",
  group: "Lazurite (rock)",
  properties: {
    ri: "1.500",
    birefringence: "N/A (aggregate)",
    sg: "2.40–2.80",
    mohs: 5.5,
    crystal: "Aggregate (rock — lazurite + calcite + pyrite)",
    optical: "Aggregate",
  },
  chromophore: "S²⁻, S₃⁻ (lazurite blue)",
  ccf: "Weak brownish red",
  uv: {
    lwuv: "Calcite = pink fluorescence",
    swuv: "Variable",
  },
  spectroscope: "N/A",
  inclusions: ["Gold pyrite flecks (desirable)", "White calcite veins", "Aggregate texture"],
  treatments: ["Dye enhancement (lower grades)", "Wax impregnation"],
  origins: ["Afghanistan (primary source 6000+ years)", "Chile", "Russia (Siberia)", "Pakistan"],
  syntheticDetection: "Synthetic lapis (Gilson) — no pyrite, uniform colour, different composition",
  simulants: "Dyed howlite (blue SWUV, lower SG), sodalite (lower SG, no pyrite), dyed jasper (no pyrite), glass (bubbles)",
  care: "Avoid ultrasonic, heat, chemicals (porous). Wipe with damp cloth.",
  description: "Metamorphic rock of lazurite + calcite + pyrite. Deep royal blue with gold pyrite flecks most valued.",
}
