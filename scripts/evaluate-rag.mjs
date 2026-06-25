import pg from "pg";
const url = process.env.DATABASE_URL.replace("-pooler", "").replace("channel_binding=require", "channel_binding=prefer");
const pool = new pg.Pool({ connectionString: url });
const apiKey = process.env.GEMINI_API_KEY;

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

async function emb(text) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "models/gemini-embedding-001", content: { parts: [{ text: text.slice(0, 2000) }] }, outputDimensionality: 768 }),
  });
  return (await r.json()).embedding?.values || [];
}

// Each question: query + expected keywords (raw text, not stemmed) that should appear in top-3
const questions = [
  // === 1. Physical & Optical Constants ===
  { q: "refractive index of ruby", expect: ["ruby", "1.762"] },
  { q: "specific gravity of emerald", expect: ["2.67", "emerald"] },
  { q: "mohs hardness of diamond", expect: ["diamond", "10"] },
  { q: "birefringence of peridot", expect: ["peridot", "0.036"] },
  { q: "refractive index of moissanite", expect: ["moissanite", "2.648"] },
  { q: "crystal system of spinel", expect: ["spinel", "cubic"] },
  { q: "specific gravity of zircon", expect: ["zircon", "4.60"] },
  { q: "refractive index of tourmaline", expect: ["tourmaline", "1.640"] },
  { q: "mohs hardness of topaz", expect: ["topaz", "8"] },
  { q: "specific gravity of chrysoberyl", expect: ["chrysoberyl", "3.70"] },

  // === 2. Chelsea Colour Filter ===
  { q: "chelsea filter reaction of emerald", expect: ["chelsea", "emerald", "red"] },
  { q: "CCF reaction of synthetic Co-blue spinel", expect: ["cobalt", "red", "spinel"] },
  { q: "CCF reaction of aquamarine", expect: ["chelsea", "aquamarine", "green"] },
  { q: "CCF reaction difference between natural and synthetic ruby", expect: ["chelsea", "ruby", "red"] },

  // === 3. UV Fluorescence ===
  { q: "UV fluorescence of ruby under LW", expect: ["fluorescence", "ruby", "red"] },
  { q: "synthetic blue sapphire under SWUV", expect: ["sapphire", "chalky", "bluish"] },
  { q: "UV fluorescence of natural emerald", expect: ["emerald", "inert"] },
  { q: "phosphorescence in HPHT synthetic diamond", expect: ["phosphorescence", "diamond", "synthetic"] },

  // === 4. Treatment Detection ===
  { q: "heat treatment diagnostic visual cues corundum", expect: ["heat", "treatment", "corundum", "discoid"] },
  { q: "emerald oil treatment UV fluorescence", expect: ["oil", "emerald", "yellow"] },
  { q: "dye detection in green jadeite CCF", expect: ["dye", "jadeite", "red"] },
  { q: "HPHT diamond detection SWUV phosphorescence", expect: ["hpht", "diamond", "phosphorescence"] },
  { q: "irradiation detection in blue topaz", expect: ["irradiation", "topaz", "blue"] },

  // === 5. Systematic Identification ===
  { q: "how to identify red gemstones step by step", expect: ["red", "ruby", "spinel"] },
  { q: "pathognomonic inclusions of demantoid", expect: ["horsetail", "demantoid"] },
  { q: "diagnostic inclusions of peridot", expect: ["lily", "pad", "peridot"] },
  { q: "three phase inclusions in emerald", expect: ["inclusions", "emerald", "three", "phase"] },

  // === 6. Simulant Discrimination ===
  { q: "how to tell moissanite from diamond", expect: ["diamond", "moissanite", "facet"] },
  { q: "ruby versus red spinel identification", expect: ["ruby", "spinel", "pleochroism"] },
  { q: "natural versus synthetic corundum curved striae", expect: ["synthetic", "corundum", "curved", "striae"] },

  // === 7. Optical Phenomena ===
  { q: "what causes play of colour in opal", expect: ["opal", "play", "colour", "silica"] },
  { q: "chatoyancy in chrysoberyl cat eye", expect: ["chatoyancy", "chrysoberyl", "cat"] },
  { q: "asterism in star ruby and star sapphire", expect: ["asterism", "star", "ruby", "sapphire"] },
  { q: "adularescence in moonstone", expect: ["adularescence", "moonstone", "feldspar"] },

  // === 8. Polariscope ===
  { q: "isotropic gems under polariscope", expect: ["polariscope", "isotropic", "extinct"] },
  { q: "aggregate reaction in jade under polariscope", expect: ["aggregate", "jade", "mottled"] },

  // === 9. Spectroscope ===
  { q: "chromium doublet lines in ruby spectroscope", expect: ["chromium", "ruby", "694", "692"] },
  { q: "iron absorption lines 450 460 470 in blue sapphire", expect: ["sapphire", "450", "460", "470"] },
  { q: "diagnostic zircon lines at 653 659 662 nm", expect: ["zircon", "653", "659", "662"] },

  // === 10. Field Testing ===
  { q: "how to use a refractometer", expect: ["refractometer", "contact", "liquid"] },
  { q: "specific gravity hydrostatic weighing procedure", expect: ["specific", "gravity", "hydrostatic"] },
  { q: "how to use dichroscope for pleochroism", expect: ["dichroscope", "dichroic", "colour"] },
  { q: "using methylene iodide for specific gravity", expect: ["methylene", "iodide", "3.32"] },
  // === 11. Gemstone Care & Durability ===
  { q: "gemstones that should never be cleaned with ultrasonic cleaner", expect: ["ultrasonic", "emerald", "tanzanite", "turquoise", "opal", "pearl", "topaz", "peridot", "moonstone"] },
  { q: "which gemstones are at risk of thermal shock", expect: ["thermal", "shock", "peridot", "zircon"] },
  { q: "cleaning restrictions for glass filled ruby", expect: ["glass", "filled", "ruby", "no", "ultrasonic", "damp", "cloth"] },
  { q: "care requirements for diffusion treated sapphire", expect: ["diffusion", "treated", "sapphire", "recutting", "polishing"] },
  { q: "how to care for mystic topaz", expect: ["mystic", "topaz", "coated", "no", "ultrasonic", "steam", "abrasives"] },
  { q: "cleaning restrictions for polymer impregnated jadeite b jade", expect: ["polymer", "jadeite", "b", "jade", "ultrasonic", "heat", "solvents"] },

  // === 12. Advanced Treatment Detection ===
  { q: "what is the flash effect in glass filled ruby", expect: ["flash", "effect", "glass", "filled", "ruby", "pathognomonic"] },
  { q: "definitive detection method for beryllium diffused sapphire", expect: ["beryllium", "diffusion", "sapphire", "la", "icp", "ms"] },
  { q: "how to detect sugar acid treated opal", expect: ["sugar", "acid", "opal", "lizard", "skin", "amorphous", "carbon"] },
  { q: "diamondview detection of hpht treated diamond", expect: ["hpht", "diamond", "diamondview", "geometric", "growth", "patterns"] },
  { q: "spectroscopic detection of irradiated diamond", expect: ["irradiated", "diamond", "gr1", "741", "nm"] },

  // === 13. Synthetic & Laboratory-Grown Identification ===
  { q: "most diagnostic feature of flame fusion synthetic ruby", expect: ["flame", "fusion", "curved", "striae", "ruby"] },
  { q: "diagnostic inclusions in czochralski grown corundum", expect: ["czochralski", "metallic", "inclusions", "iridium", "platinum"] },
  { q: "ftir detection of flux grown synthetic emerald", expect: ["flux", "emerald", "ftir", "water", "flat"] },
  { q: "chevron graining in hydrothermal emerald", expect: ["chevron", "graining", "hydrothermal", "emerald", "diagnostic"] },
  { q: "siv center detection in cvd diamond", expect: ["cvd", "diamond", "siv", "737", "nm"] },
  { q: "ftir difference between natural and czochralski alexandrite", expect: ["czochralski", "alexandrite", "ftir", "flat", "hydrogen"] },

  // === 14. Advanced Reference Data ===
  { q: "chelsea filter test for synthetic cobalt blue spinel", expect: ["cobalt", "blue", "spinel", "synthetic", "bright", "red"] },
  { q: "anomalous double refraction in synthetic spinel", expect: ["anomalous", "double", "refraction", "spinel", "tabby", "extinction"] },
  { q: "key test to identify moissanite versus diamond", expect: ["moissanite", "facet", "doubling", "diamond"] },

  // === 15. Geographic Origin & Notable Properties ===
  { q: "where does tanzanite come from geographically", expect: ["tanzanite", "tanzania", "merelani", "hills", "only", "source"] },
  { q: "what is kashmir sapphire known for", expect: ["kashmir", "sapphire", "cornflower", "blue", "velvety"] },
  { q: "where is benitoite found", expect: ["benitoite", "san", "benito", "california", "only", "commercial"] },
  { q: "what is the toughest natural gem material", expect: ["nephrite", "toughest", "natural", "gem"] },
  { q: "pleochroism of iolite", expect: ["iolite", "trichroic", "strong", "pleochroism"] },
  { q: "how to detect oil treatment in emerald using uv", expect: ["emerald", "oil", "resin", "fluorescence", "yellow", "green"] },
];

async function main() {
  const c = await pool.connect();
  try {
    let passed = 0;
    let failed = 0;
    const failures = [];
    const total = questions.length;

    console.log(`\n  ${BOLD}RAG Q&A Evaluation — ${total} questions${RESET}\n`);
    console.log(`  ${"#".padEnd(3)} ${"Score".padEnd(8)} Section`);
    console.log(`  ${"-".repeat(3)} ${"-".repeat(8)} ${"-".repeat(50)}`);

    for (let i = 0; i < questions.length; i++) {
      const { q, expect: expected } = questions[i];
      const e = await emb(q);
      const orQ = q.split(/\s+/).filter(Boolean).map((w) => `to_tsquery('english', '${w.replace(/'/g, "''")}')`).join(" || ");

      const { rows } = await c.query(
        `WITH scored AS (SELECT section, content, (1 - (embedding <=> $1::vector)) * (1.0 + COALESCE(ts_rank(fts, (${orQ})), 0) * 5.0) AS raw FROM knowledge_chunks) SELECT section, content, LEAST(1.0, raw / (SELECT GREATEST(MAX(raw), 0.001) FROM scored)) AS sim FROM scored ORDER BY raw DESC LIMIT 3`,
        [`[${e.join(",")}]`]
      );

      // Check if any of the top 3 sections contain expected keywords
      const topSections = rows.map(r => r.section.toLowerCase());
      const topContent = rows.map(r => r.content.toLowerCase());
      const combined = [...topSections, ...topContent].join(" ");

      const allMatch = expected.every(kw => combined.includes(kw.toLowerCase()));
      const anyMatch = expected.some(kw => combined.includes(kw.toLowerCase()));
      const pass = allMatch;

      const score = rows[0]?.sim || 0;
      const topSec = rows[0]?.section?.slice(0, 55) || "—";

      if (pass) {
        console.log(`  ${GREEN}✓${RESET} ${String(i + 1).padEnd(2)} ${(score * 100).toFixed(1)}%  ${topSec}`);
        passed++;
      } else {
        const missing = expected.filter(kw => !combined.includes(kw.toLowerCase()));
        console.log(`  ${RED}✗${RESET} ${String(i + 1).padEnd(2)} ${(score * 100).toFixed(1)}%  ${topSec}`);
        console.log(`     ${YELLOW}missing: ${missing.join(", ")}${RESET}`);
        failed++;
        failures.push({ q, missing, topSec });
      }

      // Small delay to respect API rate limits
      await new Promise(r => setTimeout(r, 100));
    }

    const pct = ((passed / total) * 100).toFixed(1);
    console.log(`\n  ${BOLD}Results: ${GREEN}${passed}/${total} passed${RESET} (${pct}%)`);
    if (failed > 0) {
      console.log(`  ${RED}${failed} failed${RESET}`);
      console.log(`\n  ${BOLD}Failed questions:${RESET}`);
      for (const f of failures) {
        console.log(`  ${YELLOW}•${RESET} "${f.q}"`);
        console.log(`    missing: ${f.missing.join(", ")}`);
        console.log(`    top:     ${f.topSec}`);
      }
    }
  } finally {
    c.release();
    await pool.end();
  }
}
main().catch(console.error);
