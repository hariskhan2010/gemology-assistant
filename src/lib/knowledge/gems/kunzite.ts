import type { GemKnowledge } from "./types"

export const kunzite: GemKnowledge = {
  name: "Kunzite",
  group: "Spodumene",
  properties: {
    ri: "1.660–1.676",
    birefringence: "0.015–0.016",
    sg: "3.15–3.21",
    mohs: "6.5–7",
    crystal: "Monoclinic",
    optical: "Biaxial (+)",
  },
  chromophore: "Mn²⁺",
  ccf: "Inert",
  uv: {
    lwuv: "Strong orange (diagnostic)",
    swuv: "Weak",
  },
  spectroscope: "Mn²⁺ lines",
  inclusions: ["Fingerprints", "Tubular inclusions", "Colour zoning"],
  treatments: ["Heat (to enhance colour)"],
  origins: ["Afghanistan", "Pakistan", "Brazil", "Madagascar", "USA"],
  syntheticDetection: "Rare; flux-grown spodumene possible",
  simulants: "Amethyst (lower RI, SG, UV inert), pink tourmaline (higher RI, birefringence, different UV), pink sapphire (much higher RI, SG)",
  care: "Colour fades in sunlight (permanent fading, not reversible). Avoid prolonged light exposure. Ultrasonic not recommended. Mohs 6.5-7.",
  description: "Pink spodumene. Strong orange LWUV diagnostic. Colour fades in sunlight permanently. Hiddenite is green Cr-variety.",
}
