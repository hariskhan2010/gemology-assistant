import type { GemKnowledge } from "./types"

export const amber: GemKnowledge = {
  name: "Amber",
  group: "Organic",
  properties: {
    ri: "1.539–1.545",
    birefringence: "N/A (SR, amorphous)",
    sg: "1.05–1.10",
    mohs: 2.5,
    crystal: "Amorphous (fossilized tree resin)",
    optical: "Isotropic (SR)",
  },
  chromophore: "N/A — organic colour compounds",
  ccf: "Inert",
  uv: {
    lwuv: "Strong blue-white (Baltic); copal = weaker",
    swuv: "Variable",
  },
  spectroscope: "N/A",
  inclusions: ["Insect/plant inclusions (add value)", "Fractures", "Flow structure"],
  treatments: ["Heat (to clarify or produce sunspangles)", "Pressure (ambroid/pressed amber)", "Coating"],
  origins: ["Baltic region (Poland, Lithuania, Russia — 80% of world)", "Dominican Republic (blue amber)", "Myanmar", "Mexico", "Indonesia"],
  syntheticDetection: "Copal (younger resin, weaker UV, softens with acetone), ambroid (pressed, no flow structure), plastic (hot point test, different SG)",
  simulants: "Copal (acetone test — becomes tacky), plastic (hot point = acrid smell, different SG), glass (much heavier)",
  care: "Extremely soft (Mohs 2.5). Avoid heat, alcohol, perfume, acids, ultrasonic. Damp cloth only.",
  description: "Fossilized tree resin, 40-90 million years old. Insect inclusions add value. Baltic common, blue amber rare.",
}
