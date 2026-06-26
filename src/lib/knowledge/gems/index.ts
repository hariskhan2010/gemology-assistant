import type { GemKnowledge } from "./types"
import { ruby, sapphire } from "./corundum"
import { emerald, aquamarine } from "./beryl"
import { amethyst, citrine } from "./quartz"
import { pyrope, almandine, spessartite, tsavorite, demantoid } from "./garnet"
import { tourmaline } from "./tourmaline"
import { spinel } from "./spinel"
import { peridot } from "./peridot"
import { diamond } from "./diamond"
import { tanzanite } from "./tanzanite"
import { opal } from "./opal"
import { topaz } from "./topaz"
import { zircon } from "./zircon"
import { moonstone, labradorite } from "./moonstone"
import { alexandrite } from "./alexandrite"
import { chrysoberyl } from "./chrysoberyl"
import { jadeite, nephrite } from "./jade"
import { turquoise } from "./turquoise"
import { kunzite } from "./kunzite"
import { benitoite } from "./benitoite"
import { iolite } from "./iolite"
import { lapis } from "./lapis"
import { pearl } from "./pearl"
import { amber } from "./amber"
import { coral } from "./coral"

const knowledgeBase: Record<string, GemKnowledge> = {
  ruby, sapphire, emerald, aquamarine,
  amethyst, citrine,
  pyrope, almandine, spessartite, tsavorite, demantoid,
  tourmaline, spinel, peridot, diamond, tanzanite, opal, topaz, zircon,
  moonstone, labradorite, alexandrite, chrysoberyl,
  jadeite, nephrite, turquoise, kunzite, benitoite, iolite, lapis,
  pearl, amber, coral,
}

const aliases: Record<string, string> = {
  "garnet": "pyrope",
  "rubellite": "tourmaline",
  "indicolite": "tourmaline",
  "paraíba": "tourmaline",
  "chrysoprase": "amethyst",
  "alexandrite": "alexandrite",
  "cats eye": "chrysoberyl",
  "cat's eye": "chrysoberyl",
  "rhodolite": "pyrope",
  "hessonite": "spessartite",
  "grossular": "tsavorite",
  "andradite": "demantoid",
  "jade": "jadeite",
  "morganite": "emerald",
  "heliodor": "emerald",
  "goshenite": "emerald",
  "smoky quartz": "amethyst",
  "rose quartz": "amethyst",
  "aventurine": "amethyst",
  "tigers eye": "amethyst",
  "tiger's eye": "amethyst",
  "chalcedony": "amethyst",
  "sunstone": "moonstone",
  "amazonite": "moonstone",
  "orthoclase": "moonstone",
  "uvarovite": "demantoid",
  "sphene": "zircon",
  "hiddenite": "kunzite",
}

export function getGemKnowledge(name: string): GemKnowledge | undefined {
  const key = name.toLowerCase().trim().replace(/\s+/g, " ")
  if (knowledgeBase[key]) return knowledgeBase[key]
  if (aliases[key]) return knowledgeBase[aliases[key]]
  return undefined
}

export function getAllGemKnowledge(): GemKnowledge[] {
  return Object.values(knowledgeBase)
}

export function formatGemKnowledge(gem: GemKnowledge): string {
  return [
    `REFERENCE: ${gem.name} (${gem.group})`,
    `- RI: ${gem.properties.ri} | Birefringence: ${gem.properties.birefringence} | SG: ${gem.properties.sg} | Mohs: ${gem.properties.mohs}`,
    `- Crystal: ${gem.properties.crystal} | Optical: ${gem.properties.optical}`,
    `- Chromophore: ${gem.chromophore}`,
    `- CCF: ${gem.ccf}`,
    `- UV (LW/SW): ${gem.uv.lwuv} / ${gem.uv.swuv}`,
    gem.uv.synthetic ? `- UV (synthetic): ${gem.uv.synthetic}` : "",
    `- Spectroscope: ${gem.spectroscope}`,
    `- Diagnostic inclusions: ${gem.inclusions.join(", ")}`,
    `- Common treatments: ${gem.treatments.join(", ")}`,
    `- Key origins: ${gem.origins.join(", ")}`,
    `- Synthetic detection: ${gem.syntheticDetection}`,
    `- Simulants: ${gem.simulants}`,
    `- Care: ${gem.care}`,
    `- ${gem.description}`,
  ].filter(Boolean).join("\n")
}

export function getAllKnowledgeContext(stones: string[]): string {
  const unique = new Set(stones.flatMap(s => {
    const gem = getGemKnowledge(s)
    return gem ? [gem.name] : []
  }))
  if (unique.size === 0) return ""
  const blocks = Array.from(unique).map(n => {
    const gem = getGemKnowledge(n)
    return gem ? formatGemKnowledge(gem) : ""
  }).filter(Boolean)
  return "\n\n## RELEVANT GEMSTONE KNOWLEDGE\n" + blocks.join("\n\n---\n")
}
