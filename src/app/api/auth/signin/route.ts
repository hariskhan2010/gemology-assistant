import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { createSession as createJWT } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/file-store/users";
import { createSession as createSessionRecord } from "@/lib/file-store/sessions";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    createSessionRecord({
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}
