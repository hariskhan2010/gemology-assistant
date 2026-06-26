import type { GemKnowledge } from "./types"

export const pearl: GemKnowledge = {
  name: "Pearl",
  group: "Organic",
  properties: {
    ri: "1.530–1.685",
    birefringence: "N/A (amorphous/biogenic)",
    sg: "2.60–2.85",
    mohs: 2.5,
    crystal: "Amorphous (biogenic calcium carbonate — aragonite/conchiolin)",
    optical: "Aggregate",
  },
  chromophore: "N/A — nacre structure creates orient/lustre",
  ccf: "Variable",
  uv: {
    lwuv: "Variable by type; natural black pearl = moderate-strong red, dyed black = inert",
    swuv: "Variable",
  },
  spectroscope: "N/A",
  inclusions: ["Nacre layers (cultured)", "Bead nucleus (cultured)", "Organic matter (natural)"],
  treatments: ["Bleaching", "Dyeing", "Irradiation (to produce black)", "Coating", "Fracture filling"],
  origins: ["Japan (Akoya cultured)", "French Polynesia (Tahitian cultured)", "Australia (South Sea)", "Philippines/Indonesia (South Sea)", "China (freshwater cultured)"],
  syntheticDetection: "Cultured vs natural: X-ray reveals bead nucleus. Dyed black pearl: inert UV vs natural's red UV.",
  simulants: "Glass pearl (SR, heavier, cold to touch), plastic (lighter, burn test), shell (laminated structure)",
  care: "Extremely soft (Mohs 2.5). Never ultrasonic, never chemicals, never acid. Wipe with soft damp cloth after wearing. Store separately.",
  description: "Biogenic nacre from mollusks. Natural extremely rare. Cultured: Akoya, Tahitian, South Sea, Freshwater.",
}
