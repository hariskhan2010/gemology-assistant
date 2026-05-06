import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import emailjs from "@emailjs/nodejs";
import { findUserByEmail, updateUser } from "@/lib/neon";

// Initialize EmailJS
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY!,
  privateKey: process.env.EMAILJS_PRIVATE_KEY!,
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent" });
    }

    // Generate reset token
    const resetToken = randomUUID();
    const resetExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    // Store reset token in user document
    await updateUser(
      { email },
      { reset_token: resetToken, reset_expires: resetExpires }
    );

    // Send reset email via EmailJS
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;
    
    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          to_name: user.name,
          reset_link: resetLink,
          reply_to: email,
          logo_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gem_logo.png`,
        }
      );
    } catch (emailError) {
      console.error("EmailJS error:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
