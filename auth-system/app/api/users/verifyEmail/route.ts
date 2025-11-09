import { connectDB } from "@/app/db/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/userModel";

connectDB();

export async function POST(request: NextRequest) {
    try {
        
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}