import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/session";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const rows = await sql`
    SELECT DISTINCT m.image, m.content, m.timestamp, c.title
    FROM messages m
    JOIN conversations c ON m.conversation_id = c.id
    WHERE m.image IS NOT NULL AND c.user_id = ${payload.userId}
    ORDER BY m.timestamp DESC
  ` as { image: string; content: string; timestamp: string; title: string }[];

  return NextResponse.json({ images: rows });
}
