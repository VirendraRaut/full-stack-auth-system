import { connectDB } from "@/app/db/db";
import User from "@/app/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log(reqBody);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}