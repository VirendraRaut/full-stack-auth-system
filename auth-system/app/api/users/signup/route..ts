import { connectDB } from "@/app/db/db";
import User from "@/app/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connectDB()