import { NextResponse } from "next/server";
import { createSession as createJWT } from "@/lib/auth/session";
import { createUser, findUserByEmail } from "@/lib/file-store/users";
import { createSession as createSessionRecord } from "@/lib/file-store/sessions";
import { randomUUID } from "crypto";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const stateParam = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/signin?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/signin?error=missing_code`);
    }

    let redirect = "/assistant";
    if (stateParam) {
      try {
        const state = JSON.parse(Buffer.from(stateParam, "base64").toString());
        redirect = state.redirect || "/assistant";
      } catch {}
    }

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/signin?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json();

    const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/signin?error=userinfo_failed`);
    }

    const userInfo = await userInfoResponse.json();

    let user = findUserByEmail(userInfo.email);
    if (!user) {
      const userId = randomUUID();
      createUser({
        id: userId,
        email: userInfo.email,
        passwordHash: "",
        name: userInfo.name || "Google User",
        createdAt: new Date().toISOString(),
      });
      user = {
        id: userId,
        email: userInfo.email,
        name: userInfo.name || "Google User",
        passwordHash: "",
        createdAt: new Date().toISOString(),
      };
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

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${redirect}`);
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/signin?error=oauth_failed`);
  }
}
