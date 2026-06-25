import { neon } from "@neondatabase/serverless";

const dbUrl = process.env.DATABASE_URL!;
const sql = neon(dbUrl);

// Derive a direct connection URL for DDL (pooled URLs don't support DDL via PgBouncer)
const directUrl = dbUrl.includes("-pooler")
  ? dbUrl.replace("-pooler", "")
  : dbUrl;
const ddl = neon(directUrl);

const MIN_CHUNK_WORDS = 150;
const MAX_CHUNK_WORDS = 400;
const CHUNK_OVERLAP = 50;

async function ensureChunksTable() {
  await ddl`${ddl.unsafe("CREATE EXTENSION IF NOT EXISTS vector")}`;
  await ddl`${ddl.unsafe(`
    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      source TEXT NOT NULL,
      section TEXT NOT NULL,
      embedding vector(768),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)}`;
  await ddl`${ddl.unsafe("CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)")}`;
  await ddl`${ddl.unsafe(`
    ALTER TABLE knowledge_chunks ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (to_tsvector('english', content)) STORED
  `)}`;
  await ddl`${ddl.unsafe("CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_fts ON knowledge_chunks USING gin (fts)")}`;
}

async function embedText(text: string): Promise<number[]> {
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
    console.error("Embedding API error:", resp.status, err.slice(0, 300));
    return [];
  }
  const data = await resp.json();
  return data.embedding?.values || [];
}

function countWords(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function chunkSection(
  sectionTitle: string,
  content: string
): string[] {
  const words = countWords(content);
  if (words <= MAX_CHUNK_WORDS) return [content];

  const sentences = content.split(/(?<=\.)\s+/);
  const result: string[] = [];
  let buffer: string[] = [];
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

function chunkMarkdown(text: string, _source: string): { content: string; section: string }[] {
  const lines = text.split("\n");

  // Extract sections at # and ## boundaries
  const rawSections: { title: string; contentLines: string[] }[] = [];
  let currentTitle = "Preamble";
  let currentContent: string[] = [];

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

  // Filter preamble/boring sections — keep everything useful
  const skipPrefixes = [
    "For AI-Assisted",
    "Table of Contents",
    "End of Reference",
  ];
  const usefulSections = rawSections.filter((s) => {
    const t = s.title.trim();
    if (skipPrefixes.some((p) => t.startsWith(p))) return false;
    // Skip pure-preamble sections (no actual content)
    const text = s.contentLines.join("").trim();
    if (text.length < 20) return false;
    return true;
  });

  // Merge adjacent tiny sections
  const merged: { title: string; content: string }[] = [];
  let buffer: { title: string; content: string } | null = null;

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

  // Split oversized sections
  const chunks: { content: string; section: string }[] = [];
  for (const section of merged) {
    const subChunks = chunkSection(section.title, section.content);
    for (const sub of subChunks) {
      chunks.push({ content: sub, section: section.title });
    }
  }

  return chunks;
}

export async function seedKnowledge(source: string, markdown: string) {
  await ensureChunksTable();
  const chunks = chunkMarkdown(markdown, source);
  console.log(`Chunked ${source} into ${chunks.length} pieces`);
  let successCount = 0;
  for (const chunk of chunks) {
    const embedding = await embedText(chunk.content);
    if (embedding.length === 0) continue;
    const vecStr = `[${embedding.join(",")}]`;
    const escContent = chunk.content.replace(/'/g, "''");
    const escSource = source.replace(/'/g, "''");
    const escSection = chunk.section.replace(/'/g, "''");
    const query = `INSERT INTO knowledge_chunks (content, source, section, embedding) VALUES ('${escContent}', '${escSource}', '${escSection}', '${vecStr}'::vector)`;
    await sql`${sql.unsafe(query)}`;
    successCount++;
    console.log(`  Embedded chunk ${successCount}/${chunks.length}: ${chunk.section}`);
  }
  return { total: chunks.length, success: successCount };
}

export async function searchKnowledge(query: string, limit: number = 5): Promise<{ content: string; section: string; similarity: number }[]> {
  const embedding = await embedText(query);
  if (embedding.length === 0) return [];
  const vecStr = `[${embedding.join(",")}]`;
  // Build OR tsquery: any word match contributes to the boost
  const words = query.split(/\s+/).filter(Boolean);
  const orQuery = words.length > 0
    ? words
        .map((w: string) => `to_tsquery('english', '${w.replace(/'/g, "''")}')`)
        .join(" || ")
    : "to_tsquery('english', '')";
  const queryStr = `
    WITH scored AS (
      SELECT content, section,
        (1 - (embedding <=> '${vecStr}'::vector)) *
          (1.0 + COALESCE(ts_rank(fts, (${orQuery})), 0) * 5.0) AS raw
      FROM knowledge_chunks
    )
    SELECT content, section,
      LEAST(1.0, raw / (SELECT GREATEST(MAX(raw), 0.001) FROM scored)) AS similarity
    FROM scored
    ORDER BY raw DESC
    LIMIT ${limit}
  `;
  const rows = await sql`${sql.unsafe(queryStr)}` as unknown as { content: string; section: string; similarity: number }[];
  return rows;
}

export async function getKnowledgeContext(query: string): Promise<string> {
  const results = await searchKnowledge(query, 5);
  if (results.length === 0) return "";
  const parts = results.map(
    (r, i) => `[${i + 1}] From "${r.section}" (relevance: ${(r.similarity * 100).toFixed(0)}%):\n${r.content}`
  );
  return "\n\n## RETRIEVED GEMOLOGICAL REFERENCE\n" + parts.join("\n\n---\n");
}

export async function clearKnowledge() {
  await ensureChunksTable();
  await sql`${sql.unsafe("DELETE FROM knowledge_chunks")}`;
}

export async function getStats() {
  await ensureChunksTable();
  const rows = await sql`${sql.unsafe("SELECT COUNT(*) as count FROM knowledge_chunks")}` as unknown as { count: number }[];
  return { chunks: rows[0]?.count || 0 };
}
