import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";

// Safe token extraction
function getTokenFromReq(req) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req) {
  try {
    await connectToDB();

    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ user: null });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ user: null });
    }

    const user = await User.findById(decoded.id).select("-password");

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/auth/me error:", err.message);
    return NextResponse.json({ user: null });
  }
}
