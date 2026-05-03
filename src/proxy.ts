import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/session";

const PROTECTED_ROUTES = ["/assistant"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie?.value) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const session = await verifySession(sessionCookie.value);
  if (!session) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-User-Id", session.userId);
  response.headers.set("X-User-Email", session.email);
  response.headers.set("X-User-Name", session.name);

  return response;
}

export const config = {
  matcher: ["/assistant/:path*"],
};
