export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  readTime: string;
  published: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "how-to-identify-gemstones-with-ai",
    title: "How to Identify Gemstones with AI",
    description: "Learn how AI-powered gem identification works and how GemSage can help you identify gemstones instantly from photos and descriptions.",
    category: "Identification",
    readTime: "5 min",
    published: "2026-05-20",
    content: `
## What Is AI Gem Identification?

Traditional gem identification requires years of training, expensive equipment like refractometers and spectroscopes, and access to reference collections. AI gem identification changes this by letting anyone identify a gemstone from a photo or description in seconds.

## How GemSage Identifies Gems

GemSage combines two approaches for accurate identification:

### 1. Visual Analysis
Upload a photo of your gemstone, and GemSage analyzes its color, clarity, and visual characteristics. The AI compares these against a database of known gemstone properties to suggest matches.

### 2. Property-Based Identification
Describe your gem's physical properties — color, hardness, refractive index, specific gravity — and GemSage cross-references them against 25+ gemstone profiles to find the closest match.

## Key Properties Used for Identification

| Property | What It Tells Us |
|----------|-----------------|
| **Color** | Primary visual clue — ruby is red, emerald is green, sapphire is blue |
| **Hardness (Mohs)** | Diamond (10) scratches everything; talc (1) scratches with a fingernail |
| **Refractive Index** | How much light bends — diamond (2.42) sparkles more than quartz (1.54) |
| **Specific Gravity** | How dense the stone feels — hematite (5.3) is much heavier than opal (2.1) |
| **Crystal System** | Internal atomic structure — cubic (diamond), hexagonal (emerald), monoclinic (jade) |

## Common Lookalikes the AI Can Differentiate

- **Ruby vs Garnet** — Both red, but ruby is harder (9 vs 7.5) and has distinctive fluorescence
- **Diamond vs Moissanite** — Both brilliant, but moissanite has higher birefringence (double refraction)
- **Emerald vs Peridot** — Both green, but emerald has typical inclusions ("jardin") while peridot is cleaner
- **Sapphire vs Tanzanite** — Both blue, but tanzanite is softer (6.5 vs 9) and shows pleochroism (different colors from different angles)

## Tips for Accurate Identification

1. **Clean your stone** — Dirt and oil affect color and transparency
2. **Good lighting** — Natural daylight shows true color best
3. **Multiple photos** — Capture different angles and lighting conditions
4. **Include known properties** — If you know hardness or weight, include it

Try it now with the [GemSage Assistant](/assistant) — upload a photo or describe your stone to get an instant identification.
  `,
  },
  {
    slug: "gemstone-hardness-comparison-complete-mohs-guide",
    title: "Gemstone Hardness Comparison: Complete Mohs Guide",
    description: "A complete guide to the Mohs hardness scale for gemstones. Compare hardness across 25+ gemstones and learn what it means for durability and care.",
    category: "Education",
    readTime: "6 min",
    published: "2026-05-18",
    content: `
## What Is the Mohs Hardness Scale?

The Mohs scale (created by Friedrich Mohs in 1812) ranks minerals by scratch resistance from 1 (softest) to 10 (hardest). Each mineral can scratch anything with a lower number.

## The Full Scale

| Hardness | Mineral | Can Be Scratched By |
|----------|---------|-------------------|
| 1 | Talc | Fingernail |
| 2 | Gypsum | Fingernail |
| 3 | Calcite | Copper coin |
| 4 | Fluorite | Steel knife |
| 5 | Apatite | Steel knife |
| 6 | Feldspar | Steel file |
| 7 | Quartz | Hardened steel |
| 8 | Topaz | Corundum |
| 9 | Corundum (Ruby, Sapphire) | Diamond |
| 10 | Diamond | Nothing (except another diamond) |

## Gemstone Hardness Reference

Knowing hardness is critical for jewelry selection and care:

### 10 — Diamond
The hardest natural material. Suitable for daily wear rings. Diamond can only be scratched by another diamond.

### 9 — Ruby & Sapphire (Corundum)
Second only to diamond. Excellent for all jewelry types. Ruby and sapphire are the same mineral (corundum) — color is the only difference.

### 8.5 — Alexandrite
Very hard and durable. Suitable for daily wear. Rare and valuable.

### 8 — Topaz & Spinel
Hard enough for most jewelry, but can chip on impact. Be careful with ring settings.

### 7.5 — Garnet
Good for earrings and pendants, but may show wear on rings over time.

### 7 — Quartz (Amethyst, Citrine), Tourmaline
Moderate hardness. Suitable for earrings and pendants. Ring stones may need repolishing after years of wear.

### 6.5 — Peridot, Tanzanite
Soft for a gemstone. Best in earrings, pendants, or protective ring settings.

### 6 — Opal
Delicate. Avoid hard wear. Opal also contains water (up to 10%) and can crack if dried out.

### 5 and below — Pearl, Amber, Coral
Very soft. Never for rings. Best for earrings, brooches, or necklaces.

## Does Hardness Equal Toughness?

No. **Hardness** is scratch resistance. **Toughness** is impact resistance. Jadeite (hardness 7) is extremely tough — it can be carved into intricate shapes. Diamond (hardness 10) is brittle — a sharp blow can cleave it.

## Caring for Gems by Hardness

- **Hardness 7+** — Ultrasonic cleaners are generally safe
- **Hardness under 7** — Warm water, mild soap, soft brush only
- **All gems** — Store separately to prevent scratching softer stones

Browse our [Gemstone Encyclopedia](/gems/encyclopedia) for complete hardness information on all 25+ gemstones.
  `,
  },
  {
    slug: "ruby-vs-sapphire-comparison-guide",
    title: "Ruby vs Sapphire: What's the Difference?",
    description: "Ruby and sapphire are both corundum, so what makes them different? Learn about color, value, treatments, and how to tell them apart.",
    category: "Comparison",
    readTime: "4 min",
    published: "2026-05-15",
    content: `
## The Surprising Truth: They're the Same Mineral

Ruby and sapphire are both **corundum** (aluminum oxide, Al₂O₃). The only chemical difference is trace elements that cause color:

- **Ruby** — Chromium (Cr) replaces some aluminum, producing red
- **Blue Sapphire** — Iron (Fe) and titanium (Ti) produce blue
- **Fancy Sapphire** — Other trace elements create pink, yellow, green, purple, orange, and padparadscha (pink-orange)

## The Ruby vs Sapphire Distinction

By gemological convention:
- **Red corundum = Ruby** (specific saturation required)
- **All other colors = Sapphire** (including pink sapphire)

This is a historical classification, not a scientific one. In some markets, pink corundum between ruby red and pink sapphire causes debate.

## Side-by-Side Comparison

| Property | Ruby | Sapphire |
|----------|------|----------|
| **Mineral** | Corundum | Corundum |
| **Hardness** | 9 Mohs | 9 Mohs |
| **Refractive Index** | 1.762–1.770 | 1.762–1.770 |
| **Specific Gravity** | 3.97–4.05 | 3.95–4.03 |
| **Color Cause** | Chromium | Iron + Titanium |
| **Fluorescence** | Strong red (UV) | None (blue), variable (fancy) |

## Value Differences

**Ruby** is generally more valuable than sapphire at comparable quality. Fine ruby over 1 carat is extremely rare.

- **Ruby:** $1,000–$100,000+/ct (fine Burmese pigeon's blood red)
- **Blue Sapphire:** $500–$15,000/ct (fine Kashmir cornflower blue)
- **Fancy Sapphire:** $200–$5,000/ct

## Common Treatments

Both are routinely heat-treated to improve color and clarity:
- **Heating** — Standard, accepted practice for both
- **Lead glass filling** — Ruby only (controversial, reduces value)
- **Diffusion** — Both (creating colors like padparadscha)
- **Fracture filling** — Both (less common)

## How to Tell Ruby and Sapphire Apart in the Field

1. **Color is the primary clue** — Red = ruby, blue = sapphire
2. **Fluorescence** — Ruby glows red under UV light; blue sapphire doesn't
3. **Inclusions** — Ruby typically has more silk (rutile needles); sapphire has color zoning

Browse the [Ruby](/gems/encyclopedia/ruby) and [Sapphire](/gems/encyclopedia/sapphire) encyclopedia entries for detailed property information.
  `,
  },
  {
    slug: "understanding-gemstone-treatments",
    title: "Understanding Gemstone Treatments: Heat, Oil, and Irradiation",
    description: "A comprehensive guide to common gemstone enhancement methods. Learn how heat, oil, irradiation, and other treatments affect value and care.",
    category: "Education",
    readTime: "7 min",
    published: "2026-05-12",
    content: `
## What Are Gemstone Treatments?

Most gemstones on the market today have been treated to improve their appearance. Treatment refers to any human intervention beyond cutting and polishing. Understanding treatments is essential for evaluating value and caring for your gems.

## Common Treatment Types

### 1. Heat Treatment
The most common and accepted treatment. Gems are heated to 400–1800°C to improve or change color, remove unwanted tones, or enhance clarity.

**Typical gems:** Ruby, sapphire, tanzanite, amethyst, citrine, aquamarine

**Effect on value:** Minimal — heat treatment is expected and fully disclosed. Untreated fine stones command significant premiums.

**Stability:** Permanent

### 2. Oil Treatment
Fractures in a gem are filled with colorless oil to improve apparent clarity. The oil has a similar refractive index to the gem, making inclusions less visible.

**Typical gems:** Emerald (most are oiled), some ruby

**Effect on value:** Reduces value compared to untreated. Re-oiling is needed periodically.

**Stability:** Not permanent — oil can dry out, leak, or be removed by ultrasonic cleaners.

### 3. Irradiation
Gems are exposed to radiation to create or intensify color. Often combined with heat treatment.

**Typical gems:** Blue topaz (most common), diamond (green, blue), quartz (smoky), pearl

**Effect on value:** Generally accepted for blue topaz. For diamonds, irradiated colors are less valued than natural fancy colors.

**Stability:** Permanent (when done correctly)

### 4. Fracture Filling
Glass or resin is forced into surface-reaching fractures. Used for diamonds and rubies.

**Typical gems:** Diamond (lead glass), ruby (lead glass)

**Effect on value:** Significant reduction — considered a major enhancement

**Stability:** Can be damaged by heat, repair, or ultrasonic cleaning

### 5. Diffusion
Elements are diffused into the surface layer at high heat to create color. The color is only skin-deep.

**Typical gems:** Sapphire (padparadscha color), ruby

**Effect on value:** Major reduction — recutting removes the color

**Stability:** Permanent (unless recut or chipped)

### 6. Waxing / Impregnation
Porous gems are filled with wax, plastic, or resin to improve stability and appearance.

**Typical gems:** Turquoise, opal, jadeite, lapis lazuli

**Effect on value:** Depends on extent — from standard (opal doublets) to heavily reduced (dyed howlite sold as turquoise)

**Stability:** Varies — wax can wear off, resin is more permanent

## Disclosure Requirements

In most markets (FTC, CIBJO guidelines), all treatments must be disclosed at sale. Undisclosed treatment is fraud. When buying, always ask:

1. Has this gem been treated?
2. What type of treatment?
3. Is the treatment permanent?
4. Does it require special care?

## Care by Treatment Type

| Treatment | Care Warning |
|-----------|-------------|
| **Oiled** (emerald) | No ultrasonic, no heat, no harsh chemicals |
| **Fracture filled** (diamond) | No ultrasonic, no repair heat |
| **Diffused** (sapphire) | Avoid recutting or chipping |
| **Waxed** (turquoise) | Avoid alcohol, perfume, heat |

Browse our [Encyclopedia](/gems/encyclopedia) to see specific treatment information for each gemstone.
  `,
  },
  {
    slug: "what-determines-gemstone-price",
    title: "What Determines Gemstone Price? A Complete Guide",
    description: "Learn the key factors that determine gemstone value: the 4 Cs, rarity, origin, treatments, and market trends. Includes price ranges for popular gems.",
    category: "Value",
    readTime: "6 min",
    published: "2026-05-10",
    content: `
## The Four Cs of Gem Value

Just like diamonds, colored gemstones are evaluated by four key factors — but color weighs much more heavily for colored stones.

### 1. Color (60–70% of Value)
For colored gems, color is king. Three dimensions matter:

- **Hue** — The primary color (red, blue, green). Pure hues without secondary modifiers are most valuable
- **Saturation** — Intensity of color. Vivid, saturated colors command premiums
- **Tone** — Lightness or darkness. Medium to medium-dark tones are usually most desirable

**Example:** A vivid "pigeon's blood" ruby can be 10x more expensive than a similar sized pinkish-red ruby.

### 2. Clarity (10–20% of Value)
Inclusions are expected in colored gems (unlike diamonds). The impact depends on the gem:

- **Type I** (aquamarine, topaz) — Normally eye-clean. Inclusions hurt value significantly
- **Type II** (sapphire, garnet) — Some inclusions expected
- **Type III** (emerald, ruby) — Inclusions are normal. Emeralds are almost never eye-clean

### 3. Cut (10–15% of Value)
A well-cut gem shows good brilliance, even color distribution, and no windowing (light passing through). Poorly cut gems waste rough and look dull.

### 4. Carat Weight (5–10% of Value)
Prices increase exponentially with size, especially for rare gems. A 5-carat ruby costs much more than 5x a 1-carat ruby.

## Beyond the Four Cs

### Rarity
The single biggest value driver. Fine ruby is rarer than diamond at comparable quality. Some gems are rare by nature (alexandrite, grandidierite) while others are abundant (amethyst, citrine).

### Origin
Certain origins command premiums due to historical prestige:

| Gem | Premium Origin | Premium |
|-----|---------------|---------|
| Ruby | Myanmar (Burma) | 2–5x |
| Sapphire | Kashmir (now depleted) | 5–20x |
| Emerald | Colombia (Muzo) | 2–3x |
| Jadeite | Myanmar | 2–4x |

### Treatment
Untreated gems typically command 50–500% premium over treated equivalents. The premium is highest for ruby and sapphire.

### Market Trends
- **Rising:** Tourmaline (especially Paraíba), spinel, padparadscha sapphire
- **Stable:** Ruby, emerald, blue sapphire, diamond
- **Falling:** Amethyst (too abundant), citrine, topaz

## Price Range Reference

| Gem | Price Range (per carat) |
|-----|------------------------|
| Diamond (colorless) | $500–$20,000 |
| Ruby (fine) | $1,000–$100,000+ |
| Emerald (fine) | $1,000–$15,000 |
| Blue Sapphire (fine) | $500–$15,000 |
| Alexandrite | $3,000–$30,000 |
| Spinel (red) | $500–$5,000 |
| Tanzanite | $200–$1,500 |
| Amethyst | $5–$50 |

For specific price ranges on all 25+ gemstones, visit our [Gemstone Encyclopedia](/gems/encyclopedia).
  `,
  },
];
