import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { findUserByResetToken, updateUser } from "@/lib/neon";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Find user with valid reset token
    const user = await findUserByResetToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    // Hash new password
    const password_hash = await hashPassword(password);

    // Update user password and clear reset token
    await updateUser(
      { id: user.id },
      { password_hash, reset_token: null, reset_expires: null }
    );

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
