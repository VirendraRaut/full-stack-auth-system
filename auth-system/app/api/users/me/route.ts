import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connectDB } from "@/app/db/db";

connectDB();

// export async function GET(request:NextRequest){
//     try {
//         const userId = await getDataFromToken(request);
//         const user = await User.findOne({_id: userId}).select("-password");
//         return NextResponse.json({message: "User found", data: user});
//     } catch (error:any) {
//         return NextResponse.json({error: error.message}, {status: 400});
//     }
// }

export async function GET(request: NextRequest) {
    try {
      const token = request.cookies.get("token")?.value;
      console.log("🧩 Token received:", token);
      const userId = await getDataFromToken(request);
      console.log("✅ Decoded userId:", userId);
  
      const user = await User.findOne({ _id: userId }).select("-password");
      return NextResponse.json({ message: "User found", data: user });
    } catch (error: any) {
      console.log("❌ Error in /api/users/me:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  