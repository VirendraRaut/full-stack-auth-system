import { NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connectDB } from "@/app/db/db";
import { sendEmail } from "@/app/helpers/mailer";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, token, newPassword } = await req.json();

    // 🧩 STEP 1 — Send Reset Password Email
    if (email && !token && !newPassword) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      // Send reset password link
      await sendEmail({
        email: user.email,
        emailType: "RESET",
        userId: user._id,
      });

      return NextResponse.json({
        message: "Password reset link sent to your registered email.",
      });
    }

    // 🧩 STEP 2 — Reset Password using token
    if (token && newPassword) {
      const user = await User.findOne({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() }, // valid token only
      });

      if (!user) {
        return NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 400 }
        );
      }

      // Hash and update password
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear token fields
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      await user.save();

      return NextResponse.json({ message: "Password reset successful" });
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
