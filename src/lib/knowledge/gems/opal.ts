import type { GemKnowledge } from "./types"

export const opal: GemKnowledge = {
  name: "Opal",
  group: "Opal",
  properties: {
    ri: "1.370–1.470",
    birefringence: "N/A (SR, amorphous)",
    sg: "1.98–2.25",
    mohs: 5.5,
    crystal: "Amorphous (non-crystalline)",
    optical: "Isotropic (SR)",
  },
  chromophore: "N/A — play-of-colour from silica sphere diffraction",
  ccf: "Variable",
  uv: {
    lwuv: "Variable; may phosphoresce",
    swuv: "Variable",
  },
  spectroscope: "N/A",
  inclusions: ["Play-of-colour (diffracting silica spheres 150-300nm)"],
  treatments: ["Sugar-acid treatment (black opal simulant)", "Smoke treatment", "Resin stabilization", "Doublet/triplet assembly"],
  origins: ["Australia (95% of world supply — Lightning Ridge black opal)", "Ethiopia", "Mexico", "Brazil", "USA"],
  syntheticDetection: "Synthetic opal shows more regular play-of-colour (lizard skin pattern); natural is more random. Hydrophane Ethiopian opal absorbs water. Doublets/triplets show flat joining plane.",
  simulants: "Synthetic opal, plastic (lower SG, burn test), glass (higher SG, bubbles)",
  care: "Never ultrasonic, never heat, never solvents. Avoid water (Ethiopian opal is hydrophane). Protect from knocks (Mohs 5.5).",
  description: "Hydrated silica with microscopic spheres diffracting light. Black opal (Lightning Ridge) rarest and most valuable.",
}
