import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { createSession as createJWT } from "@/lib/auth/session";
import { createUser, findUserByEmail } from "@/lib/db";
import { createSession } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const userId = randomUUID();

    await createUser({
      id: userId,
      email,
      password_hash,
      name,
      created_at: new Date().toISOString(),
    });

    const token = await createJWT({
      userId,
      email,
      name,
    });

    await createSession({
      token,
      user_id: userId,
      email,
      name,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const response = NextResponse.json({ user: { id: userId, name, email } });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({
      error: process.env.NODE_ENV === "development"
        ? String(error)
        : "Failed to create account"
    }, { status: 500 });
  }
}
