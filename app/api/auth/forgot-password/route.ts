// app/api/auth/forgot-password/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "lib/email"; 

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // We don't want to reveal if a user exists or not for security reasons,
    // so we'll always return a success message even if the user doesn't exist
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If an account exists with this email, you will receive password reset instructions." },
        { status: 200 }
      );
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Set token expiration (e.g., 1 hour from now)
    const expires = new Date(Date.now() + 3600000);

    // Delete any existing reset tokens for this email
    await prisma.passwordReset.deleteMany({
      where: { email },
    });

    // Create a new password reset token
    await prisma.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expires,
      },
    });

    // Create the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    // Send the email with the reset link
    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
      html: `
        <div>
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your account.</p>
          <p>Please click on the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "If an account exists with this email, you will receive password reset instructions." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}