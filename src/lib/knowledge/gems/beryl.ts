import type { GemKnowledge } from "./types"

export const emerald: GemKnowledge = {
  name: "Emerald",
  group: "Beryl",
  properties: {
    ri: "1.565–1.602",
    birefringence: "0.005–0.009",
    sg: "2.67–2.78",
    mohs: 7.5,
    crystal: "Hexagonal (trigonal)",
    optical: "Uniaxial (−)",
  },
  chromophore: "Cr³⁺/V³⁺",
  ccf: "Strong red (Cr-rich Colombian/Brazilian); inert/weak (Fe-rich Zambian)",
  uv: {
    lwuv: "Inert (Fe quenches); yellow if oil/resin filled",
    swuv: "Inert",
    synthetic: "Dull brick red LWUV, stronger CCF red",
  },
  spectroscope: "Cr³⁺ lines in Cr-rich varieties",
  inclusions: ["Three-phase inclusions (liquid+gas+crystal) — diagnostic", "Jardin (garden of fractures)"],
  treatments: ["Fracture filling (oil, resin)", "Colour enhancement", "Surface coating"],
  origins: ["Colombia", "Zambia", "Brazil", "Afghanistan", "Ethiopia", "Pakistan"],
  syntheticDetection: "Dull brick red LWUV, stronger CCF red, chevron graining (hydrothermal), flux residues (flux-grown), flat water FTIR (hydrothermal)",
  simulants: "Green tourmaline (DR, strong pleochroism, CCF greenish), tsavorite (SR, CCF inert, no inclusions), chrome diopside (softer, Mohs 5.5), demantoid (higher RI, SR, horsetail inclusions), glass (SR, bubbles)",
  care: "Never ultrasonic — almost all emeralds are fracture-filled. Warm soapy water only. Avoid heat, solvents, and sudden temperature changes.",
  description: "Green beryl. Colombian finest quality. Almost all fracture-filled. Handle with care.",
}

export const aquamarine: GemKnowledge = {
  name: "Aquamarine",
  group: "Beryl",
  properties: {
    ri: "1.564–1.596",
    birefringence: "0.005–0.009",
    sg: "2.68–2.74",
    mohs: 7.5,
    crystal: "Hexagonal (trigonal)",
    optical: "Uniaxial (−)",
  },
  chromophore: "Fe²⁺",
  ccf: "Inert/greenish",
  uv: {
    lwuv: "Inert",
    swuv: "Inert",
  },
  spectroscope: "427nm Fe band",
  inclusions: ["Two-phase inclusions", "Growth tubes", "Fingerprints"],
  treatments: ["Heat (removes green tones, enhances blue)"],
  origins: ["Brazil", "Madagascar", "Pakistan", "Nigeria", "Mozambique", "Sri Lanka"],
  syntheticDetection: "Rare; flux-grown beryl possible, check for flux residues",
  simulants: "Blue topaz (higher RI, SG), blue zircon (much higher RI, DR), synthetic spinel (SR, tabby extinction)",
  care: "Stable in ultrasonic, but gentle cleaning recommended. Avoid sudden heat.",
  description: "Blue beryl. Named aqua marina (seawater). Deep Santa Maria blue most prized.",
}
