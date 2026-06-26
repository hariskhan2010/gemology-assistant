import type { GemKnowledge } from "./types"

export const spinel: GemKnowledge = {
  name: "Spinel",
  group: "Spinel",
  properties: {
    ri: "1.712–1.736",
    birefringence: "N/A (SR)",
    sg: "3.54–3.63",
    mohs: 8,
    crystal: "Cubic (isometric)",
    optical: "Isotropic (SR)",
  },
  chromophore: "Cr³⁺ (red), Fe²⁺ (blue), Co²⁺ (synthetic blue), V³⁺ (colour-change)",
  ccf: "Red (red spinel, synthetic Co-blue); greenish/inert (natural blue)",
  uv: {
    lwuv: "Red fluorescence (red spinel, weaker than ruby)",
    swuv: "Variable",
    synthetic: "Co-blue spinel: bright red CCF (diagnostic), strong chalky blue SWUV",
  },
  spectroscope: "685, 698, 700nm Cr lines (red spinel, weaker than ruby doublet)",
  inclusions: ["Octahedral negative crystals", "Straight growth lines", "Fingerprints"],
  treatments: ["None (spinel is typically untreated)"],
  origins: ["Myanmar", "Sri Lanka", "Tajikistan", "Tanzania", "Vietnam", "Afghanistan"],
  syntheticDetection: "Co-blue spinel: CCF bright red (diagnostic), SWUV chalky blue. Synthetic spinel often shows ADR/tabby extinction.",
  simulants: "Ruby (DR, dichroic, higher RI), sapphire (DR), garnet (higher RI range), glass (SR, bubbles)",
  care: "Durable for all jewelry. Ultrasonic safe.",
  description: "Historically confused with ruby/sapphire (Black Prince's Ruby is spinel). Red and cobalt-blue most valued.",
}
