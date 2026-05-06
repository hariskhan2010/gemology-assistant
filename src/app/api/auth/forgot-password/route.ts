import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import emailjs from "@emailjs/nodejs";
import { findUserByEmail, updateUser } from "@/lib/neon";

// Initialize EmailJS
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log("EmailJS Config Check:", {
  hasPublicKey: !!EMAILJS_PUBLIC_KEY,
  hasPrivateKey: !!EMAILJS_PRIVATE_KEY,
  hasServiceId: !!EMAILJS_SERVICE_ID,
  hasTemplateId: !!EMAILJS_TEMPLATE_ID,
  hasBaseUrl: !!BASE_URL,
});

if (EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
    privateKey: EMAILJS_PRIVATE_KEY,
  });
}

export async function POST(request: Request) {
  console.log("Forgot password API called");
  
  try {
    const body = await request.json();
    const { email } = body;
    console.log("Received email:", email);

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Email validation failed");
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Check database connection
    console.log("Looking up user by email...");
    const user = await findUserByEmail(email);
    console.log("User found:", !!user);

    // Always return success to prevent email enumeration
    if (!user) {
      console.log("User not found, returning success");
      return NextResponse.json({ 
        success: true, 
        message: "If the email exists, a reset link has been sent" 
      });
    }

    // Generate reset token
    const resetToken = randomUUID();
    const resetExpires = new Date(Date.now() + 3600000).toISOString();
    console.log("Generated reset token:", resetToken);

    // Store reset token in database
    console.log("Updating user with reset token...");
    await updateUser(
      { email },
      { reset_token: resetToken, reset_expires: resetExpires }
    );
    console.log("User updated successfully");

    // Create reset link
    const resetLink = `${BASE_URL}/auth/reset-password?token=${resetToken}`;
    console.log("Reset link:", resetLink);

    // Check if EmailJS is properly initialized
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error("EmailJS configuration missing");
      return NextResponse.json({ 
        error: "Email service not configured" 
      }, { status: 500 });
    }

    // Send reset email via EmailJS
    console.log("Sending email via EmailJS...");
    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          to_name: user.name,
          reset_link: resetLink,
          reply_to: email,
          logo_url: `${BASE_URL}/gem_logo.png`,
        }
      );
      console.log("EmailJS send result:", result);
    } catch (emailError) {
      console.error("EmailJS error:", emailError);
      // Don't fail the request if email fails, but log it
      return NextResponse.json({ 
        error: "Failed to send email. Please try again later." 
      }, { status: 500 });
    }

    console.log("Email sent successfully");
    return NextResponse.json({ 
      success: true, 
      message: "If the email exists, a reset link has been sent" 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ 
      error: "Failed to process request" 
    }, { status: 500 });
  }
}
