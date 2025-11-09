import { connectDB } from "@/app/db/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/userModel";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log("Token:", token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
    }
    console.log(user);
    user.isVerified = true;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
