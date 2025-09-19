import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Post from "@/models/post";
import jwt from "jsonwebtoken";
import { getTokenFromReq } from "@/lib/auth";

// 🟢 Get all posts
export async function GET() {
  try {
    await connectToDB();
    const posts = await Post.find().populate("author", "name email");
    return NextResponse.json({ posts }); // 👈 wrap in object
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 🟢 Create new post
export async function POST(req) {
  try {
    await connectToDB();

    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const newPost = await Post.create({
      title,
      content,
      author: decoded.id, // 👈 logged in user
    });

    return NextResponse.json({ post: newPost }, { status: 201 }); // 👈 wrap in object
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
