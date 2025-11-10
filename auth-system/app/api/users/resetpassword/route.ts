import { NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connectDB } from "@/app/db/db";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, otp, newPassword, confirmPassword } = body;

    console.log("📩 Request received:", {
      hasEmail: !!email,
      hasOtp: !!otp,
      hasNewPassword: !!newPassword,
      hasConfirmPassword: !!confirmPassword,
    });

    // 🧩 STEP 1 — Request OTP (only email provided)
    if (email && !otp && !newPassword && !confirmPassword) {
      console.log("📧 Step 1: Sending OTP to", email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ User not found");
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const hashedOtp = await bcryptjs.hash(generatedOtp, 10);

      user.forgotPasswordToken = hashedOtp;
      user.forgotPasswordTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 min
      user.resetEmail = email;
      await user.save();

      console.log("✅ OTP generated and saved");

      // Send OTP Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODE_MAILER_USER,
          pass: process.env.NODE_MAILER_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.NODE_MAILER_USER,
        to: email,
        subject: "Your OTP for Password Reset",
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                 <h2 style="color: #7c3aed;">Password Reset Request</h2>
                 <p>Your OTP is: <strong style="font-size: 24px; color: #7c3aed;">${generatedOtp}</strong></p>
                 <p>This OTP will expire in 10 minutes.</p>
                 <p>If you didn't request this, please ignore this email.</p>
               </div>`,
      });

      console.log("✅ Email sent successfully");

      return NextResponse.json({
        message: "OTP sent successfully to your email.",
        success: true,
      });
    }

    // 🧩 STEP 2 — Verify OTP (only otp provided)
    if (otp && !email && !newPassword && !confirmPassword) {
      console.log("🔐 Step 2: Verifying OTP");

      // Find user who has an unexpired OTP
      const users = await User.find({
        forgotPasswordToken: { $exists: true, $ne: null },
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      });

      if (!users || users.length === 0) {
        console.log("❌ No valid OTP sessions found");
        return NextResponse.json(
          { message: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      // Check OTP against all users with active reset tokens
      let matchedUser = null;
      for (const user of users) {
        const isMatch = await bcryptjs.compare(
          otp,
          user.forgotPasswordToken || ""
        );
        if (isMatch) {
          matchedUser = user;
          break;
        }
      }

      if (!matchedUser) {
        console.log("❌ OTP doesn't match any user");
        return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
      }

      console.log("✅ OTP verified for user:", matchedUser.email);

      matchedUser.otpVerified = true;
      matchedUser.resetEmail = matchedUser.email; // store it for step 3 reference
      await matchedUser.save();

      return NextResponse.json({
        message: "OTP verified successfully.",
        email: matchedUser.email,
        success: true,
      });
    }

    // 🧩 STEP 3 — Reset Password (email + newPassword + confirmPassword)
    if (email && newPassword && confirmPassword && !otp) {
      console.log("🔑 Step 3: Resetting password for", email);

      if (newPassword !== confirmPassword) {
        console.log("❌ Passwords don't match");
        return NextResponse.json(
          { message: "Passwords do not match" },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        console.log("❌ Password too short");
        return NextResponse.json(
          { message: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Find user by email and check if OTP was verified
      const user = await User.findOne({
        resetEmail: email,
        otpVerified: true,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        console.log("❌ User not found or session expired");
        return NextResponse.json(
          {
            message: "Session expired or OTP not verified. Please start over.",
          },
          { status: 400 }
        );
      }

      console.log("✅ User found, updating password");

      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear OTP fields
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      user.otpVerified = false;
      user.resetEmail = undefined;
      await user.save();

      console.log("✅ Password reset successful");

      return NextResponse.json({
        message: "Password reset successful! Redirecting to login...",
        success: true,
      });
    }

    // Invalid request
    console.log("❌ Invalid request format");
    return NextResponse.json(
      {
        message: "Invalid request format. Please provide the required fields.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("❌ Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
