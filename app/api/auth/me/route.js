import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { getTokenFromReq } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectToDB();
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
