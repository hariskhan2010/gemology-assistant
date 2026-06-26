import type { GemKnowledge } from "./types"

export const jadeite: GemKnowledge = {
  name: "Jadeite",
  group: "Pyroxene",
  properties: {
    ri: "1.654–1.688",
    birefringence: "N/A (aggregate)",
    sg: "3.24–3.43",
    mohs: "6.5–7",
    crystal: "Monoclinic (aggregate)",
    optical: "Aggregate",
  },
  chromophore: "Cr³⁺ (Imperial green), Fe²⁺ (green)",
  ccf: "Dyed green = red",
  uv: {
    lwuv: "Variable",
    swuv: "Variable",
  },
  spectroscope: "437nm Fe band (diagnostic)",
  inclusions: ["Fibrous interlocking crystal texture", "Grain boundaries"],
  treatments: ["Bleaching (Type B)", "Dyeing (Type C)", "Acid treatment", "Polymer impregnation (Type B)", "Waxing"],
  origins: ["Myanmar (Burma)", "Guatemala"],
  syntheticDetection: "Synthetic jadeite exists; look for curved striae, gas bubbles, lack of natural grain",
  simulants: "Nephrite (lower SG, lower RI), serpentine (lower hardness), quartzite (different RI), glass (bubbles)",
  care: "Never ultrasonic (Type B/C jade may be damaged). Warm soapy water. Avoid heat, solvents, acids.",
  description: "Na-Al pyroxene, one of two true jade minerals. Imperial green most valued. Types: A (natural), B (bleached+polymer), C (dyed), B+C.",
}

export const nephrite: GemKnowledge = {
  name: "Nephrite",
  group: "Amphibole",
  properties: {
    ri: "1.600–1.627",
    birefringence: "N/A (aggregate)",
    sg: "2.90–3.03",
    mohs: "6–6.5",
    crystal: "Monoclinic (aggregate)",
    optical: "Aggregate",
  },
  chromophore: "Fe²⁺",
  ccf: "Inert",
  uv: {
    lwuv: "Inert",
    swuv: "Inert",
  },
  spectroscope: "N/A",
  inclusions: ["Fibrous interlocking texture (more compact than jadeite)", "Graphite flecks"],
  treatments: ["Waxing", "Dyeing"],
  origins: ["China", "Russia", "Canada", "New Zealand", "USA"],
  syntheticDetection: "Not synthetically produced",
  simulants: "Jadeite (higher SG), serpentine (softer, Mohs 3-5), bowenite (lower hardness)",
  care: "Durable. Ultrasonic safe. Avoid acids.",
  description: "Ca-Mg amphibole, the second true jade mineral. Toughest natural gem material. Deep cultural significance in China.",
}
