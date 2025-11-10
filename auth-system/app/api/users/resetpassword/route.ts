import { NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connectDB } from "@/app/db/db";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, otp, newPassword, confirmPassword } = await req.json();

    // 🧩 STEP 1 — Request OTP (only email)
    if (email && !otp && !newPassword && !confirmPassword) {
      const user = await User.findOne({ email });
      if (!user)
        return NextResponse.json({ message: "User not found" }, { status: 404 });

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcryptjs.hash(generatedOtp, 10);

      user.forgotPasswordToken = hashedOtp;
      user.forgotPasswordTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 min
      await user.save();

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
        html: `<p>Your OTP is: <b>${generatedOtp}</b></p>
               <p>This OTP will expire in 10 minutes.</p>`,
      });

      return NextResponse.json({
        message: "OTP sent successfully to your email.",
      });
    }

    // 🧩 STEP 2 — Verify OTP (only otp)
    if (otp && !email && !newPassword && !confirmPassword) {
      // Find user who has an unexpired OTP
      const user = await User.findOne({
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      });

      if (!user)
        return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });

      const isMatch = await bcryptjs.compare(otp, user.forgotPasswordToken || "");
      if (!isMatch)
        return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });

      // Mark as verified temporarily (optional)
      user.isVerified = true;
      await user.save();

      return NextResponse.json({
        message: "OTP verified successfully.",
        email: user.email, // send email back to identify user for step 3
      });
    }

    // 🧩 STEP 3 — Reset Password (only newPassword + confirmPassword)
    if (newPassword && confirmPassword && !email && !otp) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: "Passwords do not match" },
          { status: 400 }
        );
      }

      // Find most recently verified user (or you can pass email in frontend if needed)
      const user = await User.findOne({ isVerified: true });
      if (!user)
        return NextResponse.json(
          { message: "No user found or OTP not verified" },
          { status: 400 }
        );

      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear OTP fields
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      user.isVerified = false;
      await user.save();

      return NextResponse.json({ message: "Password reset successful!" });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    console.error("❌ Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
