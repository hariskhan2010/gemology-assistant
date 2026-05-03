import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/knowledge/system-prompt";
import { detectNote } from "@/lib/file-store/detect-note";
import { addNote, getNotes } from "@/lib/file-store/notes";
import { appendMessage, getRecentMessages } from "@/lib/file-store/conversations";
import { autoCompact } from "@/lib/file-store/compact";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildSystemPrompt(): string {
  const notes = getNotes();
  let prompt = SYSTEM_PROMPT;

  if (notes.length > 0) {
    prompt += "\n\nUSER NOTES (remember these about the user):\n";
    for (const note of notes) {
      prompt += `- ${note}\n`;
    }
  }

  return prompt;
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

    autoCompact();

    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").pop();
    if (lastUserMessage?.content) {
      const noteContent = detectNote(lastUserMessage.content);
      if (noteContent) {
        addNote(noteContent);
      }
    }

    if (conversationId) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg) {
        appendMessage(conversationId, {
          role: lastMsg.role,
          content: lastMsg.content,
          image: lastMsg.image,
          timestamp: new Date().toISOString(),
        });
      }
    }

    const systemPrompt = buildSystemPrompt();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const conversationHistory = conversationId
      ? getRecentMessages(conversationId, 200)
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
        { role: "user", parts: Array.isArray(currentParts) ? currentParts : [currentParts] },
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
