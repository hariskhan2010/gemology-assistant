import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/session";
import { findUserById, deleteUser } from "@/lib/neon";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const user = await findUserById(payload.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await deleteUser(payload.userId);

  const response = NextResponse.json({ success: true });
  response.cookies.delete("session");
  return response;
}
