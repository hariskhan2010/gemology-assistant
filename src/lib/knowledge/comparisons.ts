export interface GemComparison {
  slug: string;
  title: string;
  description: string;
  gemA: string;
  gemB: string;
  intro: string;
  table: { label: string; gemA: string; gemB: string }[];
  conclusion: string;
}

export const comparisons: GemComparison[] = [
  {
    slug: "ruby-vs-sapphire",
    title: "Ruby vs Sapphire Comparison",
    description: "Ruby and sapphire are both corundum — the only difference is color. Compare hardness, value, treatments, and how to tell them apart.",
    gemA: "Ruby",
    gemB: "Sapphire",
    intro: "Ruby and sapphire are the same mineral — corundum (aluminum oxide). The color difference comes from trace elements: chromium makes ruby red, while iron and titanium make sapphire blue. By gemological convention, red corundum is ruby and everything else is sapphire.",
    table: [
      { label: "Mineral", gemA: "Corundum", gemB: "Corundum" },
      { label: "Chemical Formula", gemA: "Al₂O₃ + Cr", gemB: "Al₂O₃ + Fe, Ti" },
      { label: "Mohs Hardness", gemA: "9", gemB: "9" },
      { label: "Refractive Index", gemA: "1.762–1.770", gemB: "1.762–1.770" },
      { label: "Specific Gravity", gemA: "3.97–4.05", gemB: "3.95–4.03" },
      { label: "Color", gemA: "Red (pigeon's blood most valued)", gemB: "Blue, also pink, yellow, green, orange" },
      { label: "Fluorescence", gemA: "Strong red under UV", gemB: "None (blue), variable (fancy)" },
      { label: "Typical Price", gemA: "$1,000–$100,000+/ct", gemB: "$500–$15,000/ct" },
      { label: "Famous Origin", gemA: "Myanmar (Burma)", gemB: "Kashmir, Sri Lanka, Madagascar" },
      { label: "Common Treatments", gemA: "Heat, lead glass filling", gemB: "Heat, diffusion" },
    ],
    conclusion: "Ruby is rarer and generally more valuable than sapphire at comparable quality. Both are excellent for all jewelry types due to their hardness (9 Mohs). If you value rarity and deep red color, choose ruby. If you prefer color variety and better value, choose sapphire.",
  },
  {
    slug: "diamond-vs-moissanite",
    title: "Diamond vs Moissanite Comparison",
    description: "Moissanite looks similar to diamond but differs in hardness, brilliance, and cost. Learn the key differences to make an informed choice.",
    gemA: "Diamond",
    gemB: "Moissanite",
    intro: "Diamond and moissanite are often compared because moissanite is the most convincing diamond simulant. Both are colorless and brilliant, but they differ in composition, hardness, and optical properties. Moissanite is a lab-grown silicon carbide — it's not a diamond imitation but a gem in its own right.",
    table: [
      { label: "Composition", gemA: "Carbon (C)", gemB: "Silicon Carbide (SiC)" },
      { label: "Mohs Hardness", gemA: "10", gemB: "9.25" },
      { label: "Refractive Index", gemA: "2.42", gemB: "2.65–2.69" },
      { label: "Dispersion (Fire)", gemA: "0.044", gemB: "0.104 (2.4x diamond)" },
      { label: "Birefringence", gemA: "None (single refractive)", gemB: "0.043 (double refractive)" },
      { label: "Specific Gravity", gemA: "3.52", gemB: "3.21" },
      { label: "Cost", gemA: "$500–$20,000/ct", gemB: "$20–$600/ct" },
      { label: "Heat Conductivity", gemA: "Very high (thermal probe test)", gemB: "High (can fool thermal probes)" },
      { label: "Natural vs Lab", gemA: "Both natural and lab-grown", gemB: "Lab-created only (rare natural)" },
    ],
    conclusion: "Diamond is harder and has a warmer, more classic brilliance. Moissanite has more fire (rainbow flashes) and costs a fraction of the price. If budget is a concern, moissanite offers excellent durability and beauty. If you want traditional prestige and the hardest gem on earth, choose diamond.",
  },
  {
    slug: "emerald-vs-peridot",
    title: "Emerald vs Peridot Comparison",
    description: "Both green gems, but emerald and peridot differ in hardness, value, and color. Compare their properties to tell them apart.",
    gemA: "Emerald",
    gemB: "Peridot",
    intro: "Emerald and peridot are both green gemstones but are completely different minerals. Emerald is a beryl colored by chromium and vanadium, while peridot is olivine colored by iron. Their green hues differ — emerald is deep grass-green, peridot is yellowish-green.",
    table: [
      { label: "Mineral", gemA: "Beryl", gemB: "Olivine" },
      { label: "Chemical Formula", gemA: "Be₃Al₂(SiO₃)₆ + Cr, V", gemB: "(Mg,Fe)₂SiO₄" },
      { label: "Mohs Hardness", gemA: "7.5–8", gemB: "6.5–7" },
      { label: "Refractive Index", gemA: "1.565–1.602", gemB: "1.650–1.690" },
      { label: "Specific Gravity", gemA: "2.67–2.78", gemB: "3.27–3.37" },
      { label: "Color", gemA: "Grass-green to bluish-green", gemB: "Yellowish-green to olive" },
      { label: "Inclusions", gemA: "Nearly always included (jardin)", gemB: "Typically eye-clean" },
      { label: "Typical Price", gemA: "$500–$15,000/ct", gemB: "$30–$300/ct" },
      { label: "Famous Origin", gemA: "Colombia, Zambia, Brazil", gemB: "Myanmar, Pakistan, Arizona (USA)" },
      { label: "Common Treatments", gemA: "Oil/ resin filling (standard)", gemB: "Usually untreated" },
    ],
    conclusion: "Emerald is a classic precious gem with high value but requires careful handling due to its inclusions and oil treatment. Peridot is an affordable, clean gem with good durability for everyday wear. Choose emerald for prestige and deep green color; choose peridot for a bright, affordable green with no treatment concerns.",
  },
  {
    slug: "ruby-vs-garnet",
    title: "Ruby vs Garnet Comparison",
    description: "Ruby and red garnet look similar but differ in hardness, fluorescence, and value. Learn how to tell these red gemstones apart.",
    gemA: "Ruby",
    gemB: "Garnet",
    intro: "Ruby and red garnet (usually almandine or pyrope) can look nearly identical to the untrained eye. Both are red gemstones, but they differ significantly in hardness, optical properties, and value. Garnet is sometimes sold as 'ruby' by dishonest vendors, so knowing the difference is important.",
    table: [
      { label: "Mineral", gemA: "Corundum", gemB: "Garnet group" },
      { label: "Chemical Formula", gemA: "Al₂O₃ + Cr", gemB: "X₃Y₂(SiO₄)₃ (variable)" },
      { label: "Mohs Hardness", gemA: "9", gemB: "7–7.5" },
      { label: "Refractive Index", gemA: "1.762–1.770", gemB: "1.74–1.89 (varies by type)" },
      { label: "Specific Gravity", gemA: "3.97–4.05", gemB: "3.50–4.30" },
      { label: "Color", gemA: "Red to pinkish-red", gemB: "Red, also green, orange, purple, black" },
      { label: "Fluorescence", gemA: "Strong red under UV", gemB: "Weak to none" },
      { label: "Pleochroism", gemA: "Strong (different reds in different directions)", gemB: "None (garnet is isotropic)" },
      { label: "Typical Price", gemA: "$1,000–$100,000+/ct", gemB: "$10–$500/ct" },
      { label: "Common Treatments", gemA: "Heat (standard)", gemB: "Usually untreated" },
    ],
    conclusion: "Ruby is much harder, rarer, and more valuable than garnet. The quickest way to tell them apart: ruby shows strong red fluorescence under UV light and different shades of red from different angles (pleochroism). Garnet has neither property. If you see a 'bargain ruby,' it's almost certainly garnet.",
  },
  {
    slug: "diamond-vs-cubic-zirconia",
    title: "Diamond vs Cubic Zirconia Comparison",
    description: "Cubic zirconia is the most common diamond simulant. Compare weight, hardness, fire, and price to spot the difference.",
    gemA: "Diamond",
    gemB: "Cubic Zirconia",
    intro: "Cubic zirconia (CZ) has been the most popular diamond simulant since its commercial introduction in the 1970s. While it looks similar to diamond at a glance, CZ differs in several measurable ways. Understanding these differences helps with identification and purchasing decisions.",
    table: [
      { label: "Composition", gemA: "Carbon (C)", gemB: "Zirconium Dioxide (ZrO₂)" },
      { label: "Mohs Hardness", gemA: "10", gemB: "8.5" },
      { label: "Refractive Index", gemA: "2.42", gemB: "2.15–2.18" },
      { label: "Dispersion (Fire)", gemA: "0.044", gemB: "0.058–0.066 (more fire)" },
      { label: "Specific Gravity", gemA: "3.52 (light)", gemB: "5.6–6.0 (very heavy)" },
      { label: "Thermal Conductivity", gemA: "Very high", gemB: "Very low (thermal probe test)" },
      { label: "Clarity", gemA: "Varies (Flawless to I3)", gemB: "Usually flawless" },
      { label: "Cost", gemA: "$500–$20,000/ct", gemB: "$1–$30/ct" },
      { label: "Durability", gemA: "Hardest, but brittle", gemB: "Very durable, less likely to chip" },
    ],
    conclusion: "Cubic zirconia is heavier, softer, and has more fire than diamond. The easiest test: CZ is about 1.7x heavier than diamond of the same size. A thermal probe also distinguishes them instantly. CZ offers diamond-like appearance at a fraction of the cost, but lacks diamond's prestige and extreme hardness.",
  },
];
