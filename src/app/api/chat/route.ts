import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/knowledge/system-prompt";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const sql = neon(process.env.DATABASE_URL!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Ensure notes table exists
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
  await ensureNotesTable();
  const rows = await sql`SELECT content FROM notes ORDER BY created_at ASC` as { content: string }[];
  return rows.map(r => r.content);
}

async function addNote(content: string) {
  await ensureNotesTable();
  const id = randomUUID();
  await sql`
    INSERT INTO notes (id, content, created_at)
    VALUES (${id}, ${content}, ${new Date().toISOString()})
  `;
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
  const rows = await sql`
    SELECT role, content FROM messages 
    WHERE conversation_id = ${conversationId} 
    ORDER BY timestamp DESC 
    LIMIT ${limit}
  ` as { role: string; content: string }[];
  return rows.reverse();
}

async function appendMessage(conversationId: string, msg: { role: string; content: string; image?: string }) {
  const id = randomUUID();
  await sql`
    INSERT INTO messages (id, conversation_id, role, content, image, timestamp)
    VALUES (${id}, ${conversationId}, ${msg.role}, ${msg.content}, ${msg.image || null}, ${new Date().toISOString()})
  `;
}

function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export async function POST(request: Request) {
  try {
    const { messages, conversationId } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured. Add GEMINI_API_KEY to your environment." },
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

    const systemPrompt = buildSystemPrompt();
    const notes = await getNotes();
    let fullPrompt = systemPrompt;
    if (notes.length > 0) {
      fullPrompt += "\n\nUSER NOTES (remember these about the user):\n";
      for (const note of notes) {
        fullPrompt += `- ${note}\n`;
      }
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: fullPrompt,
    });

    const conversationHistory = conversationId
      ? await getRecentMessages(conversationId, 200)
      : [];

    const historyParts = conversationHistory.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const currentMsg = messages[messages.length - 1];
    let currentParts: { text?: string; inlineData?: { mimeType: string; data: string } }[];
    if (currentMsg?.image) {
      const base64Data = currentMsg.image.split(",")[1] || currentMsg.image;
      const mimeType = currentMsg.image.includes("data:image/png") ? "image/png" : "image/jpeg";
      currentParts = [
        { inlineData: { mimeType, data: base64Data } },
        { text: currentMsg.content },
      ];
    } else {
      currentParts = [{ text: currentMsg?.content || "" }];
    }

    const result = await model.generateContentStream({
      contents: [
        ...historyParts,
        { role: "user", parts: currentParts },
      ],
    } as any);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
