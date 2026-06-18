import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/session";
import { findUserById, updateUser } from "@/lib/neon";
import { createHash } from "crypto";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const emailHash = createHash("md5").update(payload.email.toLowerCase().trim()).digest("hex");
  const picture = payload.picture || `https://www.gravatar.com/avatar/${emailHash}?d=mp&s=80`;

  const user = await findUserById(payload.userId);
  if (!user) {
    return NextResponse.json({ user: { id: payload.userId, name: payload.name, email: payload.email, created_at: new Date().toISOString(), picture } });
  }

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at, picture } });
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const { name } = await request.json();
  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  await updateUser({ id: payload.userId }, { name: name.trim() });

  return NextResponse.json({ success: true, user: { id: payload.userId, name: name.trim(), email: payload.email } });
}
