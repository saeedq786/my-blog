import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";

// ✅ Safely extract token from Request headers
function getTokenFromReq(req) {
  const cookie = req.headers.get("cookie"); // cookie string from Request
  if (!cookie) return null;

  const match = cookie.match(/token=([^;]+)/); // look for 'token=...'
  return match ? match[1] : null;
}

// 🟢 GET all posts
export async function GET() {
  try {
    await connectToDB();

    const posts = await Post.find().populate("author", "name email");

    return NextResponse.json({ posts }); // wrap in object
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 🟢 POST create new post
export async function POST(req) {
  try {
    await connectToDB();

    // Extract token safely
    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Parse JSON body safely
    const body = await req.json(); // App Router Request automatically provides req.json()
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Create new post
    const newPost = await Post.create({
      title,
      content,
      author: decoded.id,
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
