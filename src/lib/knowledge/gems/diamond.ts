import type { GemKnowledge } from "./types"

export const diamond: GemKnowledge = {
  name: "Diamond",
  group: "Native Elements",
  properties: {
    ri: "2.417",
    birefringence: "N/A (SR)",
    sg: "3.52",
    mohs: 10,
    crystal: "Cubic (isometric)",
    optical: "Isotropic (SR)",
  },
  chromophore: "N/A (colourless); N3 centres (yellow), irradiation (blue/green/pink)",
  ccf: "Inert",
  uv: {
    lwuv: "~30% fluoresce blue",
    swuv: "HPHT synthetic: stronger than LWUV, phosphorescence diagnostic; CVD: may phosphoresce",
    synthetic: "HPHT: SWUV > LWUV, phosphorescence; CVD: may phosphoresce",
  },
  spectroscope: "415nm N3 line (type Ia, 98% of naturals)",
  inclusions: ["Trigons (natural octahedral faces)", "Metallic flux (synthetic)", "Feathers", "Crystals (garnet, olivine, etc.)", "Graining"],
  treatments: ["HPHT (colour enhancement)", "Irradiation (fancy colours)", "Fracture filling", "Coating", "Laser drilling"],
  origins: ["Botswana", "Russia", "Canada", "Australia (Argyle)", "South Africa", "Namibia"],
  syntheticDetection: "HPHT: SWUV > LWUV, phosphorescence, metallic flux inclusions, geometric growth patterns. CVD: SiV 737nm centre, layered growth, brown colour before HPHT treatment. DiamondView reveals growth patterns.",
  simulants: "Moissanite (DR, facet doubling, higher dispersion 0.104, greenish SWUV), CZ (very heavy SG 5.6-6.0, no facet doubling), YAG, GGG, Strontium Titanate, Sphene",
  care: "Hardest material but can chip along cleavage planes. Ultrasonic safe. Protect other gems in storage.",
  description: "Carbon crystallized under extreme pressure/temperature. Hardest natural material. Valued for brilliance and fire.",
}
