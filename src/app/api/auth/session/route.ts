import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { createHash } from "crypto";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie?.value) {
    return NextResponse.json({ user: null });
  }

  const session = await verifySession(sessionCookie.value);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const emailHash = createHash("md5").update(session.email.toLowerCase().trim()).digest("hex");

  return NextResponse.json({
    user: {
      id: session.userId,
      name: session.name,
      email: session.email,
      picture: session.picture || `https://www.gravatar.com/avatar/${emailHash}?d=mp&s=80`,
    },
  });
}
