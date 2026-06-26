import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const sql = neon(process.env.DATABASE_URL!);

export interface DbConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  image?: string;
  timestamp: string;
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      timestamp TEXT NOT NULL
    )
  `;
}

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

    await ensureTable();
    const conversations = await sql`
      SELECT * FROM conversations 
      WHERE user_id = ${session.userId} 
      ORDER BY updated_at DESC
    ` as DbConversation[];

    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await sql`
          SELECT * FROM messages 
          WHERE conversation_id = ${conv.id} 
          ORDER BY timestamp ASC
        ` as DbMessage[];
        return {
          id: conv.id,
          title: conv.title,
          createdAt: conv.created_at,
          updatedAt: conv.updated_at,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image,
            timestamp: m.timestamp,
          })),
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithMessages });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
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

    const convs = await sql`
      SELECT * FROM conversations 
      WHERE id = ${id} AND user_id = ${session.userId}
      LIMIT 1
    ` as DbConversation[];
    
    if (!convs.length) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    await sql`
      UPDATE conversations 
      SET title = ${title}, updated_at = ${new Date().toISOString()}
      WHERE id = ${id}
    `;

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

    const convs = await sql`
      SELECT * FROM conversations 
      WHERE id = ${id} AND user_id = ${session.userId}
      LIMIT 1
    ` as DbConversation[];
    
    if (!convs.length) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    await sql`DELETE FROM messages WHERE conversation_id = ${id}`;
    await sql`DELETE FROM conversations WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
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

    const { id, title, messages } = await request.json();
    const now = new Date().toISOString();
    let convId = id;

    await ensureTable();

    // If id provided and conversation exists, just append messages
    if (convId) {
      const existing = await sql`
        SELECT id FROM conversations WHERE id = ${convId} AND user_id = ${session.userId} LIMIT 1
      `;
      if (existing.length > 0) {
        if (messages && Array.isArray(messages)) {
          for (const msg of messages) {
            const msgId = randomUUID();
            await sql`
              INSERT INTO messages (id, conversation_id, role, content, image, timestamp)
              VALUES (${msgId}, ${convId}, ${msg.role}, ${msg.content}, ${msg.image || null}, ${msg.timestamp || now})
            `;
          }
          await sql`
            UPDATE conversations SET updated_at = ${now} WHERE id = ${convId}
          `;
        }
        return NextResponse.json({ conversation: { id: convId } });
      }
    }

    // Create new conversation
    convId = convId || randomUUID();
    await sql`
      INSERT INTO conversations (id, user_id, title, created_at, updated_at)
      VALUES (${convId}, ${session.userId}, ${title || "New Chat"}, ${now}, ${now})
    `;

    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        const msgId = randomUUID();
        await sql`
          INSERT INTO messages (id, conversation_id, role, content, image, timestamp)
          VALUES (${msgId}, ${convId}, ${msg.role}, ${msg.content}, ${msg.image || null}, ${msg.timestamp || now})
        `;
      }
    }

    return NextResponse.json({
      conversation: {
        id: convId,
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
