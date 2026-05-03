import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/knowledge/system-prompt";
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

    console.log("Using model: gemini-1.5-flash");
    console.log("System prompt length:", fullPrompt.length);
    console.log("Contents count:", contents.length);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: fullPrompt,
    });

    const result = await model.generateContent({
      contents,
    });

    const responseText = result.response.text();
    
    // Save assistant response to DB
    if (conversationId) {
      await appendMessage(conversationId, {
        role: "model",
        content: responseText,
      });
    }

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
