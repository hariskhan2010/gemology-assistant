import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import {
  listConversations,
  getMessages,
  createConversation,
  getConversationMeta,
  updateConversationTitle,
} from "@/lib/file-store/conversations";
import { randomUUID } from "crypto";
import fs from "fs";
import { getConversationPath } from "@/lib/file-store/ensure";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = listConversations(session.userId);

    const conversationsWithMessages = conversations.map((conv) => {
      const messages = getMessages(conv.id);
      return {
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messages,
      };
    });

    return NextResponse.json({ conversations: conversationsWithMessages });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, messages } = await request.json();
    const id = randomUUID();
    const now = new Date().toISOString();

    createConversation({
      id,
      userId: session.userId,
      title: title || "New Chat",
      createdAt: now,
      updatedAt: now,
    });

    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        const msgPath = getConversationPath(id);
        const line = JSON.stringify({
          role: msg.role,
          content: msg.content,
          image: msg.image || undefined,
          timestamp: now,
        });
        fs.appendFileSync(msgPath, line + "\n");
      }
    }

    return NextResponse.json({
      conversation: {
        id,
        title: title || "New Chat",
        createdAt: now,
        updatedAt: now,
        messages: messages || [],
      },
    });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title } = await request.json();
    if (!id || !title) {
      return NextResponse.json({ error: "id and title are required" }, { status: 400 });
    }

    const meta = getConversationMeta(id);
    if (!meta || meta.userId !== session.userId) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    updateConversationTitle(id, title);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meta = getConversationMeta(id);
    if (!meta || meta.userId !== session.userId) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const msgPath = getConversationPath(id);
    if (fs.existsSync(msgPath)) {
      fs.unlinkSync(msgPath);
    }
    const metaPath = getConversationPath(`${id}.meta`);
    if (fs.existsSync(metaPath)) {
      fs.unlinkSync(metaPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
  }
}
