import type { GemKnowledge } from "./types"

export const peridot: GemKnowledge = {
  name: "Peridot",
  group: "Olivine",
  properties: {
    ri: "1.650–1.690",
    birefringence: "0.036",
    sg: "3.27–3.48",
    mohs: 6.5,
    crystal: "Orthorhombic",
    optical: "Biaxial (+)",
  },
  chromophore: "Fe²⁺",
  ccf: "Inert/greenish",
  uv: {
    lwuv: "Inert (Fe quenches)",
    swuv: "Inert",
  },
  spectroscope: "492/493nm doublet (diagnostic)",
  inclusions: ["Lily pad discoid fractures (very characteristic)", "Chromite crystals", "Fingerprints"],
  treatments: ["None (typically untreated)"],
  origins: ["Myanmar", "Pakistan", "China", "USA (Arizona)", "Egypt", "Vietnam"],
  syntheticDetection: "Rare in synthetic form; flux-grown forsterite possible but uncommon",
  simulants: "Green tourmaline (higher birefringence, strong pleochroism), green chrysoberyl (higher RI, SG), sinhalite (higher SG, 493/505nm Fe lines), demantoid (higher RI, SR, horsetail inclusions), tsavorite (SR)",
  care: "Avoid ultrasonic — peridot is sensitive to thermal shock and acid. Warm soapy water only. Protect from hard knocks (Mohs 6.5).",
  description: "Olivine gem variety. Formed in Earth's mantle, brought up by volcanoes. Bright lime-green most valued. Typically untreated.",
}
