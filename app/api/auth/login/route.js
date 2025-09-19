import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json(); // ✅ parse safely
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken(user);

    const res = NextResponse.json({
      user: { _id: user._id, name: user.name, email: user.email },
    });

    // ✅ Cookie setup for production-safe JWT auth
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Login error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
