import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";
import { getTokenFromReq } from "@/lib/auth";

export const runtime = "nodejs";


// 🟢 GET all posts
export async function GET() {
  try {
    await connectToDB();
    const posts = await Post.find().populate("author", "name email");
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// 🟢 Create new post
export async function POST(req) {
  try {
    await connectToDB();

    // ✅ Extract token
    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ✅ Safe body parsing
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const { title, content } = body;

    // ✅ Validation
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    // ✅ Create post
    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: decoded.id,
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
