import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { invalidateSession } from "@/lib/file-store/sessions";

export async function POST() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie?.value) {
    invalidateSession(sessionCookie.value);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
