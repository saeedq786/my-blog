import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectToDB();
    const { email, password } = await req.json();

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

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      secure: process.env.NODE_ENV === "production", 
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
