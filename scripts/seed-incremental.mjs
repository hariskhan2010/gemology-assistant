import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL not set");

const pool = new Pool({ connectionString: dbUrl });
const directUrl = dbUrl.includes("-pooler") ? dbUrl.replace("-pooler", "") : dbUrl;
const ddl = neon(directUrl);

const MIN_CHUNK_WORDS = 150;
const MAX_CHUNK_WORDS = 400;
const CHUNK_OVERLAP = 50;
const RATE_LIMIT_DELAY = 1200; // ms between embeds (70 RPM max, stay way under)

const DOCS = [
  "gemological-reference-data.md",
  "extended-gemstone-data.md",
  "gemstone-treatment-detection.md",
  "synthetic-gemstone-identification.md",
  "gemstone-care-and-durability.md",
  "advanced-gemological-techniques.md",
];

async function ensureChunksTable() {
  await ddl.unsafe("CREATE EXTENSION IF NOT EXISTS vector");
  await ddl.unsafe(`
    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      source TEXT NOT NULL,
      section TEXT NOT NULL,
      embedding vector(768),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await ddl.unsafe("CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding ON knowledge_chunks USING hnsw (vector_cosine_ops)");
  await ddl.unsafe(`
    ALTER TABLE knowledge_chunks ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (to_tsvector('english', content)) STORED
  `);
  await ddl.unsafe("CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_fts ON knowledge_chunks USING gin (fts)");
}

async function embedText(text) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text: text.slice(0, 2000) }] },
        outputDimensionality: 768,
      }),
    }
  );
  if (!resp.ok) {
    const err = await resp.text();
    const msg = err.slice(0, 200);
    if (resp.status === 429) {
      console.error("  ! QUOTA EXCEEDED — pausing 60s...");
      await new Promise(r => setTimeout(r, 60000));
      console.error("  ! Retrying...");
      return embedText(text); // retry once
    }
    console.error("Embedding error:", resp.status, msg);
    return null;
  }
  const data = await resp.json();
  return data.embedding?.values || null;
}

function countWords(s) {
  return s.split(/\s+/).filter(Boolean).length;
}

function chunkSection(sectionTitle, content) {
  const words = countWords(content);
  if (words <= MAX_CHUNK_WORDS) return [content];

  const sentences = content.split(/(?<=\.)\s+/);
  const result = [];
  let buffer = [];
  let bufferWords = 0;

  for (const sentence of sentences) {
    buffer.push(sentence);
    bufferWords += countWords(sentence);
    if (bufferWords >= MAX_CHUNK_WORDS) {
      const chunk = buffer.join(" ");
      result.push(chunk);
      const overlapWords = chunk.split(/\s+/).slice(-CHUNK_OVERLAP);
      buffer = [overlapWords.join(" ")];
      bufferWords = countWords(buffer[0]);
    }
  }
  if (bufferWords > 0) result.push(buffer.join(" "));
  return result;
}

function chunkMarkdown(text) {
  const lines = text.split("\n");

  const rawSections = [];
  let currentTitle = "Preamble";
  let currentContent = [];

  for (const line of lines) {
    const isH1 = line.startsWith("# ") && !line.startsWith("##");
    const isH2 = line.startsWith("## ");
    if (isH1 || isH2) {
      if (currentContent.length > 0) {
        rawSections.push({ title: currentTitle, contentLines: currentContent });
      }
      currentTitle = line.replace(/^#+\s*/, "").trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentContent.length > 0) {
    rawSections.push({ title: currentTitle, contentLines: currentContent });
  }

  const skipPrefixes = [
    "For AI-Assisted",
    "Table of Contents",
    "End of Reference",
  ];
  const usefulSections = rawSections.filter((s) => {
    const t = s.title.trim();
    if (skipPrefixes.some((p) => t.startsWith(p))) return false;
    const text = s.contentLines.join("").trim();
    if (text.length < 20) return false;
    return true;
  });

  const merged = [];
  let buffer = null;

  for (const section of usefulSections) {
    const sectionText = section.contentLines.join("\n").trim();
    const wc = countWords(sectionText);
    if (wc === 0) continue;

    if (buffer && countWords(buffer.content) < MIN_CHUNK_WORDS) {
      buffer.content += "\n\n" + sectionText;
    } else if (wc < MIN_CHUNK_WORDS && !buffer) {
      buffer = { title: section.title, content: sectionText };
    } else {
      if (buffer) {
        merged.push(buffer);
        buffer = null;
      }
      merged.push({ title: section.title, content: sectionText });
    }
  }
  if (buffer) merged.push(buffer);

  const chunks = [];
  for (const section of merged) {
    const subChunks = chunkSection(section.title, section.content);
    for (const sub of subChunks) {
      chunks.push({ content: section.title + "\n" + sub, section: section.title });
    }
  }

  return chunks;
}

async function main() {
  console.log("Ensuring chunks table...");
  await ensureChunksTable();

  // Get existing chunks with content hash
  const existing = await pool.query("SELECT source, section, md5(content) as content_hash FROM knowledge_chunks");
  const existingSet = new Set(existing.rows.map(r => `${r.source}::${r.section}::${r.content_hash}`));

  // Build chunk plan for all docs
  const allChunks = [];
  for (const file of DOCS) {
    const filePath = join(root, "docs", file);
    const markdown = readFileSync(filePath, "utf-8");
    const chunks = chunkMarkdown(markdown);
    for (const c of chunks) {
      const contentHash = createHash("md5").update(c.content).digest("hex");
      allChunks.push({ ...c, source: file, key: `${file}::${c.section}::${contentHash}` });
    }
  }

  const missing = allChunks.filter(c => !existingSet.has(c.key));
  const existingCount = allChunks.length - missing.length;

  console.log(`Total chunks needed: ${allChunks.length}`);
  console.log(`Already in DB: ${existingCount}`);
  console.log(`Missing (need embedding): ${missing.length}`);

  if (missing.length === 0) {
    console.log("All chunks already embedded!");
    await pool.end();
    return;
  }

  let success = 0;
  for (let i = 0; i < missing.length; i++) {
    const chunk = missing[i];
    console.log(`  [${i+1}/${missing.length}] ${chunk.source} → "${chunk.section}"`);
    const embedding = await embedText(chunk.content);
    if (!embedding) {
      console.error(`  ✗ FAILED`);
      continue;
    }
    const vecStr = `[${embedding.join(",")}]`;
    try {
      await pool.query(
        "INSERT INTO knowledge_chunks (content, source, section, embedding) VALUES ($1, $2, $3, $4::vector)",
        [chunk.content, chunk.source, chunk.section, vecStr]
      );
      success++;
      console.log(`  ✓`);
    } catch (e) {
      console.error(`  ✗ DB error: ${e.message.slice(0, 150)}`);
    }
    await new Promise(r => setTimeout(r, RATE_LIMIT_DELAY));
  }

  await pool.end();

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Added: ${success}/${missing.length} new chunks`);
  console.log(`Total in DB: ${existingCount + success}/${allChunks.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
