import type { GemKnowledge } from "./types"

export const iolite: GemKnowledge = {
  name: "Iolite",
  group: "Cordierite",
  properties: {
    ri: "1.542–1.551",
    birefringence: "0.008–0.012",
    sg: "2.57–2.61",
    mohs: "7–7.5",
    crystal: "Orthorhombic",
    optical: "Biaxial (−)",
  },
  chromophore: "Fe²⁺, Fe³⁺",
  ccf: "Green",
  uv: {
    lwuv: "Inert",
    swuv: "Inert",
  },
  spectroscope: "N/A",
  inclusions: ["Trichroic colour patches (dark blue/light blue/yellow-brown — diagnostic)", "Haematite blood spots"],
  treatments: ["None"],
  origins: ["India", "Sri Lanka", "Madagascar", "Tanzania", "Brazil", "Myanmar"],
  syntheticDetection: "Not commercially synthesized",
  simulants: "Sapphire (much higher RI, SG, no trichroism), tanzanite (higher RI, SG, trichroic but different colours), blue spinel (SR, CCF)",
  care: "Ultrasonic safe. Durable for most jewelry.",
  description: "Strong trichroic: dark blue/light blue/yellow-brown. Misnamed 'water sapphire'. CCF green.",
}
