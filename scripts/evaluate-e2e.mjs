import pg from "pg";
import fs from "fs";
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

async function getRagContext(query) {
  const e = await emb(query);
  const orQ = query.split(/\s+/).filter(Boolean).map((w) => `to_tsquery('english', '${w.replace(/'/g, "''")}')`).join(" || ");
  const c = await pool.connect();
  try {
    const { rows } = await c.query(
      `WITH scored AS (SELECT section, content, (1 - (embedding <=> $1::vector)) * (1.0 + COALESCE(ts_rank(fts, (${orQ})), 0) * 5.0) AS raw FROM knowledge_chunks) SELECT section, content, LEAST(1.0, raw / (SELECT GREATEST(MAX(raw), 0.001) FROM scored)) AS sim FROM scored ORDER BY raw DESC LIMIT 5`,
      [`[${e.join(",")}]`]
    );
    if (rows.length === 0) return "";
    return "\n\n## RELEVANT KNOWLEDGE\n" + rows.map(r => `[${r.section}]: ${r.content}`).join("\n\n");
  } finally {
    c.release();
  }
}

async function callGemini(systemPrompt, userMsg) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  });
  const data = await r.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Subset of questions spanning all categories
const questions = [
  // 1. Physical & Optical Constants
  { q: "refractive index of ruby", expect: ["ruby", "1.762"] },
  { q: "mohs hardness of diamond", expect: ["diamond", "10"] },
  { q: "crystal system of spinel", expect: ["spinel", "cubic"] },
  // 2. Chelsea Colour Filter
  { q: "chelsea filter reaction of emerald", expect: ["chelsea", "emerald", "red"] },
  // 3. UV Fluorescence
  { q: "UV fluorescence of ruby under LW", expect: ["fluorescence", "ruby", "red"] },
  // 4. Treatment Detection
  { q: "emerald oil treatment UV fluorescence", expect: ["oil", "emerald", "yellow"] },
  { q: "how to detect sugar acid treated opal", expect: ["sugar", "acid", "opal"] },
  // 5. Systematic Identification
  { q: "pathognomonic inclusions of demantoid", expect: ["horsetail", "demantoid"] },
  // 6. Simulant Discrimination
  { q: "how to tell moissanite from diamond", expect: ["moissanite", "facet"] },
  // 7. Optical Phenomena
  { q: "what causes play of colour in opal", expect: ["opal", "play", "colour", "silica"] },
  // 8. Polariscope
  { q: "isotropic gems under polariscope", expect: ["polariscope", "isotropic"] },
  // 9. Spectroscope
  { q: "chromium doublet lines in ruby spectroscope", expect: ["chromium", "694"] },
  // 10. Field Testing
  { q: "how to use a refractometer", expect: ["refractometer", "contact", "liquid"] },
  // 11. Care
  { q: "cleaning restrictions for glass filled ruby", expect: ["glass", "filled", "ruby", "ultrasonic"] },
  // 12. Advanced Treatment
  { q: "diamondview detection of hpht treated diamond", expect: ["hpht", "diamondview"] },
  // 13. Synthetic ID
  { q: "chevron graining in hydrothermal emerald", expect: ["chevron", "graining", "hydrothermal"] },
  { q: "siv center detection in cvd diamond", expect: ["cvd", "siv", "737"] },
  // 14. Advanced Reference
  { q: "anomalous double refraction in synthetic spinel", expect: ["anomalous", "double", "refraction", "spinel"] },
  // 15. Geographic Origin
  { q: "where is benitoite found", expect: ["benitoite", "san", "benito", "california"] },
];

const systemBase = "You are a gemologist AI assistant. Answer the user's gemology question based on the provided knowledge. If the knowledge is insufficient, say so. Be concise and accurate.";

async function main() {
  let passed = 0;
  let failed = 0;
  const failures = [];
  const total = questions.length;

  console.log(`\n  ${BOLD}E2E Agent Accuracy Evaluation — ${total} questions${RESET}\n`);
  console.log(`  ${"#".padEnd(3)} ${"Result".padEnd(8)} Question`);
  console.log(`  ${"-".repeat(3)} ${"-".repeat(8)} ${"-".repeat(60)}`);

  for (let i = 0; i < questions.length; i++) {
    const { q, expect: expected } = questions[i];
    
    try {
      // Step 1: Get RAG context (same as chat API)
      const ragContext = await getRagContext(q);
      
      // Step 2: Build the full system prompt
      const systemPrompt = systemBase + ragContext;
      
      // Step 3: Call Gemini
      const response = await callGemini(systemPrompt, q);
      const lower = response.toLowerCase();
      
      // Step 4: Check expected keywords in response
      const allMatch = expected.every(kw => lower.includes(kw.toLowerCase()));
      const missing = expected.filter(kw => !lower.includes(kw.toLowerCase()));
      
      if (allMatch) {
        console.log(`  ${GREEN}✓${RESET} ${String(i + 1).padEnd(2)} pass      ${q.slice(0, 57)}`);
        passed++;
      } else {
        console.log(`  ${RED}✗${RESET} ${String(i + 1).padEnd(2)} FAIL      ${q.slice(0, 57)}`);
        console.log(`     ${YELLOW}missing: ${missing.join(", ")}${RESET}`);
        console.log(`     response: ${response.slice(0, 200)}...`);
        failed++;
        failures.push({ q, missing, snippet: response.slice(0, 200) });
      }
    } catch (e) {
      console.log(`  ${RED}✗${RESET} ${String(i + 1).padEnd(2)} ERROR     ${q.slice(0, 57)}`);
      console.log(`     ${YELLOW}${e.message}${RESET}`);
      failed++;
    }
    
    // Rate limit delay (free tier: ~15 RPM = 4s between requests)
    await new Promise(r => setTimeout(r, 4000));
  }

  const pct = ((passed / total) * 100).toFixed(1);
  console.log(`\n  ${BOLD}Results: ${GREEN}${passed}/${total} passed${RESET} (${pct}%)`);
  if (failed > 0) {
    console.log(`  ${RED}${failed} failed${RESET}`);
    console.log(`\n  ${BOLD}Failed questions:${RESET}`);
    for (const f of failures) {
      console.log(`  ${YELLOW}•${RESET} "${f.q}"`);
      console.log(`    missing: ${f.missing.join(", ")}`);
      console.log(`    response: ${f.snippet}`);
    }
  }
  
  await pool.end();
}

main().catch(console.error);
