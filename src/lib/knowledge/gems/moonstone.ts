import type { GemKnowledge } from "./types"

export const moonstone: GemKnowledge = {
  name: "Moonstone",
  group: "Feldspar",
  properties: {
    ri: "1.518–1.526",
    birefringence: "0.005–0.008",
    sg: "2.55–2.63",
    mohs: 6,
    crystal: "Monoclinic",
    optical: "Biaxial (−)",
  },
  chromophore: "N/A — adularescence from alternating orthoclase/albite lamellae",
  ccf: "Inert",
  uv: {
    lwuv: "Weak blue-white",
    swuv: "Inert",
  },
  spectroscope: "N/A",
  inclusions: ["Centipede cracks (diagnostic)", "Twinning bands", "Fingerprints"],
  treatments: ["Oil or resin filling (to enhance adularescence)"],
  origins: ["Sri Lanka", "India", "Madagascar", "Myanmar", "Tanzania"],
  syntheticDetection: "Rare; flux-grown feldspar possible",
  simulants: "Labradorite (rainbow moonstone — different feldspar), opal (lower RI, play-of-colour), glass (SR, bubbles)",
  care: "Avoid ultrasonic (Mohs 6, cleavage). Warm soapy water. Protect from knocks.",
  description: "Feldspar with adularescence — floating blue-white glow. Sri Lankan blue sheen most prized.",
}

export const labradorite: GemKnowledge = {
  name: "Labradorite",
  group: "Feldspar",
  properties: {
    ri: "1.559–1.573",
    birefringence: "0.008–0.010",
    sg: "2.68–2.75",
    mohs: 6,
    crystal: "Triclinic",
    optical: "Biaxial (−)",
  },
  chromophore: "N/A — labradorescence from exsolution lamellae",
  ccf: "Inert",
  uv: {
    lwuv: "Inert",
    swuv: "Inert",
  },
  spectroscope: "N/A",
  inclusions: ["Exsolution lamellae", "Fingerprints"],
  treatments: ["Oil filling"],
  origins: ["Madagascar", "Canada", "Finland", "Russia", "USA"],
  syntheticDetection: "Rare",
  simulants: "Moonstone (different feldspar, adularescence not labradorescence), glass (SR, bubbles)",
  care: "Avoid ultrasonic. Protect from knocks.",
  description: "Feldspar with labradorescence (iridescent colour flash). Rainbow Moonstone is actually labradorite.",
}
