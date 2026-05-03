import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"}/auth/signin?error=missing_code`);
  }

  try {
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"}/auth/signin?error=token_exchange_failed`);
    }

    const { access_token } = await tokenRes.json();

    const userRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"}/auth/signin?error=userinfo_failed`);
    }

    const user = await userRes.json();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-in-production");
    const token = await new SignJWT({
      id: user.id || user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    let redirect = "/assistant";
    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, "base64").toString());
        if (parsed.redirect) redirect = parsed.redirect;
      } catch {
        // ignore invalid state
      }
    }

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"}${redirect}`);
    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"}/auth/signin?error=oauth_failed`);
  }
}
