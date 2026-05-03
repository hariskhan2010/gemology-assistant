export interface FacetingData {
  name: string;
  material: string;
  cutStyle: string;
  crownAngle: number;
  pavilionAngle: number;
  table: number;
  girdle: string;
  totalDepth: number;
  notes: string;
}

export const facetingDesigns: FacetingData[] = [
  {
    name: "Standard Brilliant",
    material: "Quartz",
    cutStyle: "Brilliant",
    crownAngle: 42,
    pavilionAngle: 43,
    table: 58,
    girdle: "Medium",
    totalDepth: 65,
    notes: "Good all-around cut for quartz family gems including amethyst and citrine.",
  },
  {
    name: "Standard Brilliant",
    material: "Sapphire",
    cutStyle: "Brilliant",
    crownAngle: 40,
    pavilionAngle: 41,
    table: 55,
    girdle: "Slightly thick",
    totalDepth: 62,
    notes: "Optimized for corundum's high refractive index. Adjust for color zoning.",
  },
  {
    name: "Standard Brilliant",
    material: "Topaz",
    cutStyle: "Brilliant",
    crownAngle: 43,
    pavilionAngle: 43,
    table: 58,
    girdle: "Medium",
    totalDepth: 64,
    notes: "Watch for cleavage planes. Orient pre-form to avoid cleavage direction.",
  },
  {
    name: "Emerald Cut",
    material: "Emerald",
    cutStyle: "Step Cut",
    crownAngle: 35,
    pavilionAngle: 40,
    table: 65,
    girdle: "Medium to thick",
    totalDepth: 68,
    notes: "Classic step cut designed to preserve color and minimize waste on included material.",
  },
  {
    name: "Mixed Cut",
    material: "Garnet",
    cutStyle: "Mixed",
    crownAngle: 40,
    pavilionAngle: 40,
    table: 56,
    girdle: "Medium",
    totalDepth: 60,
    notes: "Brilliant crown with step pavilion. Good for deep-colored garnets to lighten tone.",
  },
  {
    name: "Portuguese",
    material: "Aquamarine",
    cutStyle: "Modified Brilliant",
    crownAngle: 42,
    pavilionAngle: 43,
    table: 55,
    girdle: "Medium",
    totalDepth: 65,
    notes: "Extra crown and pavilion facets add scintillation. Excellent for light-colored material.",
  },
  {
    name: "Concave Cut",
    material: "Peridot",
    cutStyle: "Custom",
    crownAngle: 40,
    pavilionAngle: 42,
    table: 60,
    girdle: "Medium",
    totalDepth: 62,
    notes: "Concave facets can reduce weight loss. Peridot's yellow-green benefits from deeper cuts.",
  },
  {
    name: "Scissor Cut",
    material: "Tourmaline",
    cutStyle: "Modified Brilliant",
    crownAngle: 42,
    pavilionAngle: 42,
    table: 58,
    girdle: "Medium",
    totalDepth: 64,
    notes: "Scissor-cut facets elongate the appearance. Ideal for tourmaline's typically long crystals.",
  },
  {
    name: "Step Cut",
    material: "Ruby",
    cutStyle: "Step Cut",
    crownAngle: 35,
    pavilionAngle: 40,
    table: 62,
    girdle: "Slightly thick",
    totalDepth: 65,
    notes: "Preserves weight and color in valuable rough. Orient for best face-up color.",
  },
  {
    name: "Oval Brilliant",
    material: "Spinel",
    cutStyle: "Brilliant",
    crownAngle: 41,
    pavilionAngle: 41,
    table: 57,
    girdle: "Medium",
    totalDepth: 63,
    notes: "Spinel's isotropic nature makes it easy to cut. No pleochroism to manage.",
  },
  {
    name: "Cushion Cut",
    material: "Zircon",
    cutStyle: "Brilliant",
    crownAngle: 40,
    pavilionAngle: 41,
    table: 56,
    girdle: "Slightly thick",
    totalDepth: 62,
    notes: "Zircon is brittle. Handle with care during cutting. High dispersion gives great fire.",
  },
  {
    name: "Tapered Baguette",
    material: "Alexandrite",
    cutStyle: "Step Cut",
    crownAngle: 33,
    pavilionAngle: 39,
    table: 68,
    girdle: "Thick",
    totalDepth: 60,
    notes: "Orient for maximum color change effect. Protect girdle due to cleavage.",
  },
];

export function getFacetingData(material: string): FacetingData[] {
  return facetingDesigns.filter((d) =>
    d.material.toLowerCase().includes(material.toLowerCase())
  );
}

export function getAllMaterials(): string[] {
  return [...new Set(facetingDesigns.map((d) => d.material))].sort();
}
