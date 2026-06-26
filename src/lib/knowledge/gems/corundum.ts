import type { GemKnowledge } from "./types"

export const ruby: GemKnowledge = {
  name: "Ruby",
  group: "Corundum",
  properties: {
    ri: "1.762–1.770",
    birefringence: "0.008",
    sg: "3.97–4.05",
    mohs: 9,
    crystal: "Hexagonal (trigonal)",
    optical: "Uniaxial (−)",
  },
  chromophore: "Cr³⁺",
  ccf: "Strong red",
  uv: {
    lwuv: "Strong red (Burma); weaker (Mozambique — Fe quenches)",
    swuv: "Weaker than LWUV",
    synthetic: "Very strong orangey-red, brighter than natural",
  },
  spectroscope: "694.2/692.8nm Cr doublet (diagnostic)",
  inclusions: ["Silk (rutile needles)", "Hexagonal zoning", "Treacle flow", "Discoid halos (heat treatment indicator)"],
  treatments: ["Heat", "Flux healing", "Fracture filling (lead glass)", "Surface diffusion"],
  origins: ["Myanmar (Burma)", "Mozambique", "Thailand", "Sri Lanka", "Tanzania", "Madagascar"],
  syntheticDetection: "Curved striae (flame fusion), gas bubbles, very strong orangey-red UV, SWUV transparency",
  simulants: "Red spinel (SR, no pleochroism, weaker Cr lines), red garnet (SR, inert UV, Fe spectrum), red tourmaline (lower RI, strong pleochroism), glass (bubbles, conchoidal fracture)",
  care: "Stable in ultrasonic, avoid extreme heat, protect from hard knocks",
  description: "Red corundum. Burmese pigeon's blood red most prized. Durable for all jewelry.",
}

export const sapphire: GemKnowledge = {
  name: "Sapphire",
  group: "Corundum",
  properties: {
    ri: "1.762–1.770",
    birefringence: "0.008",
    sg: "3.95–4.03",
    mohs: 9,
    crystal: "Hexagonal (trigonal)",
    optical: "Uniaxial (−)",
  },
  chromophore: "Fe²⁺–Ti⁴⁺ (blue), Cr³⁺ (pink), Fe³⁺ (yellow), V³⁺/Cr³⁺ (colour-change)",
  ccf: "Inert/greenish (blue)",
  uv: {
    lwuv: "Variable by origin",
    swuv: "Natural = inert; Synthetic = chalky bluish-white (most diagnostic UV test)",
    synthetic: "Chalky bluish-white SWUV (diagnostic)",
  },
  spectroscope: "450/460/470nm Fe lines (blue sapphire, diagnostic)",
  inclusions: ["Silk", "Colour zoning (straight/angular)", "Fingerprints", "Discoid halos (heat)"],
  treatments: ["Heat", "Beryllium diffusion", "Surface diffusion", "Fracture filling"],
  origins: ["Sri Lanka", "Madagascar", "Myanmar", "Kashmir", "Australia", "Montana (USA)"],
  syntheticDetection: "Curved striae (flame fusion), chalky bluish-white SWUV, gas bubbles, UV transparency at 2537Å",
  simulants: "Blue spinel (SR, CCF greenish), tanzanite (lower RI, trichroic), iolite (much lower SG, trichroic), benitoite (strong blue SWUV), blue topaz (lower RI), blue zircon (high DR, facet doubling)",
  care: "Stable in ultrasonic, avoid extreme heat. Diffusion-treated stones should not be re-polished.",
  description: "All corundum except red. Kashmir cornflower blue most legendary. Padparadscha rarest.",
}
