import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/knowledge/system-prompt";
import { gemstones } from "@/lib/knowledge/gemstones";
import type { GemstoneData } from "@/lib/knowledge/gemstones";
import { getKnowledgeContext } from "@/lib/knowledge/rag";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const sql = neon(process.env.DATABASE_URL!);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function ensureNotesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `;
}

async function getNotes(): Promise<string[]> {
  try {
    await ensureNotesTable();
    const rows = await sql`SELECT content FROM notes ORDER BY created_at ASC` as { content: string }[];
    return rows.map(r => r.content);
  } catch {
    return [];
  }
}

async function addNote(content: string) {
  try {
    await ensureNotesTable();
    const id = randomUUID();
    await sql`
      INSERT INTO notes (id, content, created_at)
      VALUES (${id}, ${content}, ${new Date().toISOString()})
    `;
  } catch (e) {
    console.error("Failed to add note:", e);
  }
}

const GEMSTONE_KEYWORDS = [
  ...gemstones.map(g => g.name.toLowerCase()),
  ...gemstones.map(g => g.slug),
  "diamond", "ruby", "sapphire", "emerald", "amethyst", "citrine", "garnet",
  "topaz", "peridot", "opal", "tourmaline", "tanzanite", "spinel", "zircon",
  "aquamarine", "moonstone", "jade", "jadeite", "nephrite", "lapis", "turquoise",
  "alexandrite", "chrysoberyl", "amber", "coral", "pearl", "quartz", "beryl",
  "corundum", "feldspar", "chrysoprase", "heliodor", "morganite", "kunzite",
  "iolite", "sunstone", "labradorite", "benitoite", "demantoid", "tsavorite",
  "spessartite", "rhodolite", "pyrope", "almandine", "grossular", "hessonite",
  "indicolite", "rubellite", "unakite", "bloodstone", "carnelian", "kyanite",
  "diopside", "enstatite", "scapolite", "sodalite", "howlite", "variscite",
  "chrysocolla", "dioptase"
];

function getGemstoneMessage(msg: string): string {
  const lower = msg.toLowerCase();

  for (const gem of gemstones) {
    if (lower.includes(gem.name.toLowerCase()) || lower.includes(gem.slug)) {
      return formatGemRef(gem);
    }
  }

  const colorMap: Record<string, string[]> = {
    red: ["Ruby", "Red Spinel", "Garnet", "Rubellite", "Coral"],
    blue: ["Sapphire", "Blue Spinel", "Tanzanite", "Iolite", "Aquamarine", "Topaz (blue)", "Zircon", "Benitoite", "Kyanite", "Lapis Lazuli"],
    green: ["Emerald", "Peridot", "Tsavorite", "Demantoid", "Tourmaline", "Jadeite", "Nephrite", "Chrysoprase", "Diopside"],
    yellow: ["Citrine", "Yellow Sapphire", "Heliodor", "Topaz", "Chrysoberyl", "Spessartite"],
    purple: ["Amethyst", "Violet Sapphire", "Kunzite", "Tanzanite", "Spinel", "Fluorite"],
    pink: ["Morganite", "Kunzite", "Pink Sapphire", "Tourmaline", "Rose Quartz", "Spinel"],
    orange: ["Spessartite", "Hessonite", "Padparadscha", "Fire Opal", "Imperial Topaz"],
    black: ["Black Spinel", "Diamond", "Hematite", "Obsidian", "Onyx", "Tourmaline (schorl)"],
    white: ["Diamond", "Rock Crystal", "White Sapphire", "Moonstone", "Pearl", "Goshenite"],
    color: ["Alexandrite", "Sapphire (colour-change)", "Garnet (colour-change)", "Diaspore"],
  };

  for (const [color, candidates] of Object.entries(colorMap)) {
    if (lower.includes(color)) {
      const matched = gemstones.filter(g =>
        candidates.some(c => g.name.toLowerCase().includes(c.split(" ")[0].toLowerCase()))
      );
      if (matched.length > 0) {
        const keyword = matched.find(m => lower.match(new RegExp(`\\b${m.name.toLowerCase()}\\b`)));
        if (keyword) return formatGemRef(keyword);
        return matched.slice(0, 3).map(formatGemRef).join("\n\n");
      }
    }
  }

  return "";
}

function formatGemRef(gem: GemstoneData): string {
  return `REFERENCE: ${gem.name}
- Color: ${gem.color}
- Mohs Hardness: ${gem.mohs}
- Refractive Index: ${gem.ri}
- Specific Gravity: ${gem.sg}
- Crystal System: ${gem.crystal}
- Common Treatments: ${gem.treatments.join(", ")}
- Key Origins: ${gem.origins.join(", ")}
- Price Range: ${gem.priceRange}
- Description: ${gem.description}`;
}

function detectNote(content: string): string | null {
  const lower = content.toLowerCase();
  if (lower.includes("remember:") || lower.includes("note:")) {
    const match = content.match(/(remember:|note:)\s*(.+)/i);
    if (match) return match[2].trim();
  }
  return null;
}

async function getRecentMessages(conversationId: string, limit: number) {
  try {
    const rows = await sql`
      SELECT role, content FROM messages 
      WHERE conversation_id = ${conversationId} 
      ORDER BY timestamp DESC 
      LIMIT ${limit}
    ` as { role: string; content: string }[];
    return rows.reverse();
  } catch {
    return [];
  }
}

async function appendMessage(conversationId: string, msg: { role: string; content: string; image?: string }) {
  try {
    const id = randomUUID();
    await sql`
      INSERT INTO messages (id, conversation_id, role, content, image, timestamp)
      VALUES (${id}, ${conversationId}, ${msg.role}, ${msg.content}, ${msg.image || null}, ${new Date().toISOString()})
    `;
  } catch (e) {
    console.error("Failed to append message:", e);
  }
}

export async function POST(request: Request) {
  try {
    const { messages, conversationId } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured." },
        { status: 500 }
      );
    }

    // Detect and store notes
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").pop();
    if (lastUserMessage?.content) {
      const noteContent = detectNote(lastUserMessage.content);
      if (noteContent) {
        await addNote(noteContent);
      }
    }

    // Save user message to DB
    if (conversationId && lastUserMessage) {
      await appendMessage(conversationId, {
        role: lastUserMessage.role,
        content: lastUserMessage.content,
        image: lastUserMessage.image,
      });
    }

    // Build system prompt with notes
    const notes = await getNotes();
    let fullPrompt = SYSTEM_PROMPT;
    if (notes.length > 0) {
      fullPrompt += "\n\nUSER NOTES you must remember:\n";
      for (const note of notes) {
        fullPrompt += `- ${note}\n`;
      }
    }

    // Inject relevant gemstone reference data
    if (lastUserMessage?.content) {
      const gemRef = getGemstoneMessage(lastUserMessage.content);
      if (gemRef) {
        fullPrompt += "\n\n## RELEVANT GEMSTONE REFERENCE DATA\n" + gemRef;
      }
    }

    // Inject RAG knowledge context
    if (lastUserMessage?.content) {
      const ragContext = await getKnowledgeContext(lastUserMessage.content);
      if (ragContext) {
        fullPrompt += ragContext;
      }
    }

    // Get history
    const history = conversationId ? await getRecentMessages(conversationId, 20) : [];

    // Build contents array
    const contents: any[] = [];
    
    // Add history
    for (const msg of history) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    // Add current message
    const currentMsg = messages[messages.length - 1];
    if (currentMsg?.image) {
      const base64Data = currentMsg.image.split(",")[1] || currentMsg.image;
      const mimeType = currentMsg.image.includes("data:image/png") ? "image/png" : "image/jpeg";
      contents.push({
        role: "user",
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: currentMsg.content || "" },
        ],
      });
    } else {
      contents.push({
        role: "user",
        parts: [{ text: currentMsg?.content || "" }],
      });
    }

    console.log("Using model: gemini-2.5-flash");
    console.log("System prompt length:", fullPrompt.length);
    console.log("Contents count:", contents.length);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: fullPrompt,
    });

    const stream = await model.generateContentStream({
      contents,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullText = "";

        try {
          for await (const chunk of stream.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              fullText += chunkText;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`));
            }
          }

          // Save assistant response to DB after stream completes
          if (conversationId && fullText) {
            await appendMessage(conversationId, {
              role: "model",
              content: fullText,
            }).catch((e) => console.error("Failed to save assistant message:", e));
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          console.error("Stream error:", e);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
