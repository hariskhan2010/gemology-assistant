import type { GemKnowledge } from "./types"

export const amethyst: GemKnowledge = {
  name: "Amethyst",
  group: "Quartz",
  properties: {
    ri: "1.544–1.553",
    birefringence: "0.009",
    sg: "2.65",
    mohs: 7,
    crystal: "Hexagonal (trigonal)",
    optical: "Uniaxial (+)",
  },
  chromophore: "Fe⁴⁺ irradiation centres",
  ccf: "Inert (all quartz, except aventurine)",
  uv: {
    lwuv: "Variable",
    swuv: "Variable",
  },
  spectroscope: "No diagnostic lines",
  inclusions: ["Zebra/banded colour zoning", "Rutile needles", "Fingerprints"],
  treatments: ["Heat (produces citrine or green prasiolite)", "Irradiation"],
  origins: ["Brazil", "Zambia", "Uruguay", "Russia", "South Korea", "USA"],
  syntheticDetection: "Synthetic amethyst exists; look for less colour zoning, metallic inclusions from flux",
  simulants: "Synthetic corundum (higher RI, SG), fluorite (lower RI, Mohs 4), glass (bubbles)",
  care: "Ultrasonic safe. Colour may fade with prolonged heat/light exposure.",
  description: "Purple quartz. Deep Siberian with red flashes most valued.",
}

export const citrine: GemKnowledge = {
  name: "Citrine",
  group: "Quartz",
  properties: {
    ri: "1.544–1.553",
    birefringence: "0.009",
    sg: "2.65",
    mohs: 7,
    crystal: "Hexagonal (trigonal)",
    optical: "Uniaxial (+)",
  },
  chromophore: "Fe³⁺",
  ccf: "Inert",
  uv: {
    lwuv: "Inert",
    swuv: "Inert",
  },
  spectroscope: "N/A",
  inclusions: ["Fingerprints", "Colour zoning"],
  treatments: ["Heat (most citrine is heat-treated amethyst or smoky quartz)"],
  origins: ["Brazil", "Madagascar", "Russia", "France", "USA"],
  syntheticDetection: "Rare; most is natural",
  simulants: "Yellow sapphire (much higher RI, SG), topaz (higher RI, SG), spessartite (SR, higher RI)",
  care: "Ultrasonic safe.",
  description: "Yellow-to-orange quartz. Most is heat-treated. Madeira deep orange most prized.",
}
