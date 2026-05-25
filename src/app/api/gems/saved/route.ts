import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/session";
import { createSavedGem, getSavedGemsByUserId, deleteSavedGem } from "@/lib/neon";
import { randomUUID } from "crypto";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const gems = await getSavedGemsByUserId(payload.userId);
  return NextResponse.json({ gems });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const { name, description, image, properties } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Gem name is required" }, { status: 400 });
  }

  const gem: import("@/lib/neon").DbSavedGem = {
    id: String(randomUUID()),
    user_id: payload.userId,
    name,
    description: description || "",
    image: image || null,
    properties: properties ? JSON.stringify(properties) : null,
    created_at: new Date().toISOString(),
  };

  await createSavedGem(gem);

  return NextResponse.json({ success: true, gem });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Gem ID is required" }, { status: 400 });

  await deleteSavedGem(id);
  return NextResponse.json({ success: true });
}
